import { expect, test, type Page } from "@playwright/test";

async function waitForFirstTourStep(page: Page) {
  await expect(page.getByText("Step 1 of 4")).toBeVisible({ timeout: 6000 });
}

async function completeTour(page: Page) {
  await waitForFirstTourStep(page);
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Next", exact: true }).click();
  }
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByText(/Step \d of 4/)).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("catalog-tour-completed");
    localStorage.removeItem("hero-dismissed");
  });
});

test("tour appears on first visit", async ({ page }) => {
  await page.goto("/");
  await waitForFirstTourStep(page);
});

test("tour advances through all 4 steps", async ({ page }) => {
  await page.goto("/");
  await waitForFirstTourStep(page);

  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Step 2 of 4")).toBeVisible();

  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Step 3 of 4")).toBeVisible();

  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Step 4 of 4")).toBeVisible();

  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByText(/Step \d of 4/)).toHaveCount(0);
});

test("tour sets completion in localStorage", async ({ page }) => {
  await page.goto("/");
  await completeTour(page);

  const tourCompleted = await page.evaluate(() =>
    localStorage.getItem("catalog-tour-completed")
  );
  expect(tourCompleted).toBe("true");
});

test("skip tour dismisses and sets completion", async ({ page }) => {
  await page.goto("/");
  await waitForFirstTourStep(page);

  await page.getByRole("button", { name: "Skip tour", exact: true }).click();
  await expect(page.getByText(/Step \d of 4/)).toHaveCount(0);

  const tourCompleted = await page.evaluate(() =>
    localStorage.getItem("catalog-tour-completed")
  );
  expect(tourCompleted).toBe("true");
});

test("Escape key dismisses tour", async ({ page }) => {
  await page.goto("/");
  await waitForFirstTourStep(page);

  await page.keyboard.press("Escape");
  await expect(page.getByText(/Step \d of 4/)).toHaveCount(0);
});

test("replay button appears after tour completion", async ({ page }) => {
  await page.goto("/");
  await completeTour(page);

  await expect(page.getByTestId("tour-replay-button")).toBeVisible();
});

test("replay button restarts tour", async ({ page }) => {
  await page.goto("/");
  await completeTour(page);

  const replayButton = page.getByTestId("tour-replay-button");
  await expect(replayButton).toBeVisible();
  await replayButton.click();

  await expect(page.getByTestId("tour-replay-button")).toHaveCount(0);
  await waitForFirstTourStep(page);
});

test.describe("mobile viewport", () => {
  test.use({
    viewport: { width: 320, height: 568 },
    isMobile: true,
    hasTouch: true,
  });

  test("tour actions remain accessible on small screens", async ({ page }) => {
    await page.goto("/");
    await waitForFirstTourStep(page);

    for (let index = 0; index < 4; index++) {
      const action = index === 3 ? "Done" : "Next";
      const button = page.getByRole("button", { name: action, exact: true });

      await expect(button).toBeVisible();
      const geometry = await button.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const visualViewport = window.visualViewport;
        const viewportTop = visualViewport?.offsetTop ?? 0;
        const viewportLeft = visualViewport?.offsetLeft ?? 0;
        const viewportBottom = viewportTop + (visualViewport?.height ?? window.innerHeight);
        const viewportRight = viewportLeft + (visualViewport?.width ?? window.innerWidth);

        return {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          viewportTop,
          viewportLeft,
          viewportBottom,
          viewportRight,
        };
      });

      expect(geometry.top).toBeGreaterThanOrEqual(geometry.viewportTop);
      expect(geometry.left).toBeGreaterThanOrEqual(geometry.viewportLeft);
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportBottom);
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewportRight);

      await button.evaluate((el) => {
        (el as HTMLButtonElement).click();
      });
    }

    await expect(page.getByText(/Step \d of 4/)).toHaveCount(0);
  });
});
