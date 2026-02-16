"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "catalog-tour-completed";

interface TourStep {
  target: string;
  text: string;
}

const STEPS: TourStep[] = [
  {
    target: "platform-toggle",
    text: "Choose your platform: Claude Code, Codex, or both. Install commands update automatically.",
  },
  {
    target: "category-tabs",
    text: "Filter by category: Skills, MCP Servers, Multi-Agent tools, Testing, CI/CD, and more.",
  },
  {
    target: "catalog-card",
    text: "Select tools for your project. Your selections persist across page loads.",
  },
  {
    target: "nav-project",
    text: "When you're ready, open My Project to review your selections and export config files.",
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getTargetRect(testId: string): TargetRect | null {
  const el = document.querySelector(`[data-testid="${testId}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function TooltipTour() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [visible, setVisible] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(176);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  const step = STEPS[currentStep];

  const updatePosition = useCallback(() => {
    if (!step) return;
    const rect = getTargetRect(step.target);
    setTargetRect(rect);
  }, [step]);

  // Auto-start on first visit to catalog page
  useEffect(() => {
    if (!hydrated) return;
    if (window.location.pathname !== "/") return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;

    // Wait for catalog to render
    const timer = setTimeout(() => {
      const target = document.querySelector(
        `[data-testid="${STEPS[0].target}"]`
      );
      if (target) {
        setActive(true);
        setCurrentStep(0);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [hydrated]);

  // Listen for replay event
  useEffect(() => {
    function handleReplay() {
      if (window.location.pathname !== "/") return;
      setCurrentStep(0);
      setActive(true);
    }
    window.addEventListener("replay-tour", handleReplay);
    return () => window.removeEventListener("replay-tour", handleReplay);
  }, []);

  // Position tooltip when step changes
  useEffect(() => {
    if (!active || !step) return;

    const el = document.querySelector(`[data-testid="${step.target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Wait for scroll to finish then position
    const timer = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, 400);

    return () => {
      clearTimeout(timer);
      setVisible(false);
    };
  }, [active, currentStep, step, updatePosition]);

  // Handle resize
  useEffect(() => {
    if (!active) return;
    function handleResize() {
      updatePosition();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active, updatePosition]);

  // Reposition on page/viewport movement (especially on mobile browser UI changes)
  useEffect(() => {
    if (!active) return;

    function handleViewportChange() {
      updatePosition();
    }

    window.addEventListener("scroll", handleViewportChange, { passive: true });
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", handleViewportChange);
    visualViewport?.addEventListener("scroll", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange);
      visualViewport?.removeEventListener("resize", handleViewportChange);
      visualViewport?.removeEventListener("scroll", handleViewportChange);
    };
  }, [active, updatePosition]);

  const completeTour = useCallback(() => {
    setActive(false);
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(
      new CustomEvent("tour-status-changed", { detail: { completed: true } })
    );
  }, []);

  const handleNext = useCallback(() => {
    setVisible(false);
    if (currentStep >= STEPS.length - 1) {
      completeTour();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [completeTour, currentStep]);

  const handleSkip = useCallback(() => {
    completeTour();
  }, [completeTour]);

  // Focus the step action button when tooltip content is shown
  useEffect(() => {
    if (!active || !visible) return;
    nextButtonRef.current?.focus();
  }, [active, currentStep, visible]);

  // Track tooltip height for viewport-safe placement without reading refs during render
  useEffect(() => {
    if (!active || !visible) return;
    const tooltipEl = tooltipRef.current;
    if (!tooltipEl) return;

    function syncHeight() {
      const nextHeight = tooltipEl.offsetHeight;
      setTooltipHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    }

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(tooltipEl);
    return () => observer.disconnect();
  }, [active, currentStep, visible]);

  // Keep keyboard interaction scoped to the tooltip while active
  useEffect(() => {
    if (!active) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleSkip();
        return;
      }

      if (event.key !== "Tab") return;
      const tooltipEl = tooltipRef.current;
      if (!tooltipEl) return;

      const focusable = Array.from(
        tooltipEl.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        tooltipEl.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!activeElement || activeElement === first || !tooltipEl.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (!activeElement || activeElement === last || !tooltipEl.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, handleSkip]);

  if (!hydrated || !active || !targetRect) return null;

  // Calculate viewport-safe spotlight + tooltip placement
  const pad = 6;
  const viewportMargin = 12;
  const visualViewport = window.visualViewport;
  const viewportWidth = visualViewport?.width ?? window.innerWidth;
  const viewportHeight = visualViewport?.height ?? window.innerHeight;
  const viewportOffsetLeft = visualViewport?.offsetLeft ?? 0;
  const viewportOffsetTop = visualViewport?.offsetTop ?? 0;
  const viewportRight = viewportOffsetLeft + viewportWidth;
  const viewportBottom = viewportOffsetTop + viewportHeight;
  const tooltipWidth = Math.min(
    320,
    Math.max(220, viewportWidth - viewportMargin * 2)
  );
  const gap = 12;

  const availableBelow =
    viewportBottom - (targetRect.top + targetRect.height + gap + viewportMargin);
  const availableAbove =
    targetRect.top - (viewportOffsetTop + gap + viewportMargin);
  const renderAbove = availableBelow < tooltipHeight && availableAbove > availableBelow;

  const unclampedTop = renderAbove
    ? targetRect.top - tooltipHeight - gap
    : targetRect.top + targetRect.height + gap;
  const minTop = viewportOffsetTop + viewportMargin;
  const maxTop = viewportBottom - tooltipHeight - viewportMargin;
  const tooltipTop = Math.max(
    minTop,
    Math.min(unclampedTop, maxTop)
  );
  const minLeft = viewportOffsetLeft + viewportMargin;
  const maxLeft = viewportRight - tooltipWidth - viewportMargin;
  const tooltipLeft = Math.max(
    minLeft,
    Math.min(targetRect.left, maxLeft)
  );
  const tooltipMaxHeight = Math.max(
    140,
    Math.min(
      renderAbove ? availableAbove : availableBelow,
      viewportHeight - viewportMargin * 2
    )
  );

  const targetCenter = targetRect.left + targetRect.width / 2;
  const arrowLeft = Math.max(
    14,
    Math.min(targetCenter - tooltipLeft - 6, tooltipWidth - 26)
  );

  const spotlightRect = {
    x: Math.max(0, targetRect.left - pad),
    y: Math.max(0, targetRect.top - pad),
    w: targetRect.width + pad * 2,
    h: targetRect.height + pad * 2,
  };

  return createPortal(
    <div className="fixed inset-0 z-[9998]" style={{ pointerEvents: "none" }}>
      {/* Backdrop with spotlight cutout */}
      <svg
        className="fixed inset-0 w-full h-full"
        aria-hidden="true"
        style={{
          pointerEvents: "auto",
          width: "100%",
          height: "100%",
        }}
        onClick={handleNext}
      >
        <defs>
          <mask id="tour-spotlight">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={spotlightRect.x}
              y={spotlightRect.y}
              width={spotlightRect.w}
              height={spotlightRect.h}
              rx="8"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.5)"
          mask="url(#tour-spotlight)"
        />
      </svg>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Onboarding tour step ${currentStep + 1} of ${STEPS.length}`}
        tabIndex={-1}
        className="fixed z-[9999]"
        style={{
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
          width: `${tooltipWidth}px`,
          maxHeight: `${tooltipMaxHeight}px`,
          pointerEvents: "auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Arrow */}
        <div
          className={`absolute h-3 w-3 rotate-45 bg-zinc-800 border-zinc-700 ${
            renderAbove
              ? "-bottom-1.5 border-r border-b"
              : "-top-1.5 border-l border-t"
          }`}
          style={{ left: `${arrowLeft}px` }}
        />

        <div
          className="relative overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-3 shadow-xl"
          style={{ maxHeight: "100%" }}
        >
          <p className="mb-1 text-xs text-zinc-500">
            Step {currentStep + 1} of {STEPS.length}
          </p>
          <p className="text-sm text-zinc-200">{step.text}</p>
          <div className="mt-3 flex items-center justify-between border-t border-zinc-700/60 pt-3">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-zinc-500 hover:text-zinc-400 underline"
            >
              Skip tour
            </button>
            <button
              ref={nextButtonRef}
              type="button"
              onClick={handleNext}
              className="text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md transition-colors"
            >
              {currentStep === STEPS.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
