import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Skip the onboarding tour in tests
  await page.addInitScript(() => {
    localStorage.setItem("catalog-tour-completed", "true");
    localStorage.setItem("hero-dismissed", "true");
  });
});

test("catalog page loads", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Tool Bag", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(/tool/);
  await expect(page.locator("[data-testid='catalog-card']").first()).toBeVisible();
});

test("search filters catalog results", async ({ page }) => {
  await page.goto("/");

  const firstTitle = await page
    .locator("[data-testid='catalog-card-title']")
    .first()
    .textContent();
  expect(firstTitle).toBeTruthy();

  const searchTerm = firstTitle!.trim().split(/\s+/)[0];
  await page.getByPlaceholder("Search tools...").fill(searchTerm);

  await expect
    .poll(() => new URL(page.url()).searchParams.get("q"))
    .toBe(searchTerm);

  const filteredTitles = await page
    .locator("[data-testid='catalog-card-title']")
    .allTextContents();
  expect(filteredTitles.length).toBeGreaterThan(0);
  expect(
    filteredTitles.some((title) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).toBeTruthy();
});

test("category tabs and platform toggle update filters", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: /MCP Servers/i })
    .first()
    .evaluate((el) => (el as HTMLButtonElement).click());
  await expect
    .poll(() => new URL(page.url()).searchParams.get("category"))
    .toBe("MCP Servers");

  const platformToggle = page.getByTestId("platform-toggle");
  await expect(platformToggle).toBeVisible();
  await platformToggle
    .getByText("Codex", { exact: true })
    .evaluate((el) => (el as HTMLButtonElement).click());
  await expect
    .poll(() => new URL(page.url()).searchParams.get("platform"))
    .toBe("codex");
});

test("catalog card expands on click", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator("[data-testid='catalog-card']").first();
  const expandButton = firstCard.getByTestId("catalog-card-expand");
  const expandedContainer = firstCard.getByTestId(
    "catalog-card-expanded-container"
  );

  await expandButton.evaluate((el) => (el as HTMLButtonElement).click());

  await expect.poll(() => expandButton.getAttribute("aria-label")).toMatch(
    /^Collapse /
  );
  await expect
    .poll(() => expandedContainer.evaluate((el) => el.hasAttribute("inert")))
    .toBe(false);
});

test("collapsed card content is not keyboard focusable", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator("[data-testid='catalog-card']").first();
  const expandedContainer = firstCard.getByTestId(
    "catalog-card-expanded-container"
  );
  const expandButton = firstCard.getByTestId("catalog-card-expand");

  await expect
    .poll(() => expandedContainer.evaluate((el) => el.hasAttribute("inert")))
    .toBe(true);

  await expandButton.focus();
  await page.keyboard.press("Tab");

  const focusedInsideCollapsedContent = await page.evaluate(() => {
    const firstCardEl = document.querySelector("[data-testid='catalog-card']");
    const expandedContainerEl = firstCardEl?.querySelector(
      "[data-testid='catalog-card-expanded-container']"
    );
    const active = document.activeElement;
    return Boolean(
      active &&
        expandedContainerEl &&
        expandedContainerEl.contains(active)
    );
  });

  expect(focusedInsideCollapsedContent).toBe(false);
});

test("card expand button toggles expanded content accessibility", async ({
  page,
}) => {
  await page.goto("/");

  const firstCard = page.locator("[data-testid='catalog-card']").first();
  const expandButton = firstCard.getByTestId("catalog-card-expand");
  const expandedContainer = firstCard.getByTestId(
    "catalog-card-expanded-container"
  );

  await expect
    .poll(() => expandedContainer.evaluate((el) => el.hasAttribute("inert")))
    .toBe(true);

  await expandButton.evaluate((el) => (el as HTMLButtonElement).click());
  await expect
    .poll(() => expandedContainer.evaluate((el) => el.hasAttribute("inert")))
    .toBe(false);

  await expandButton.evaluate((el) => (el as HTMLButtonElement).click());
  await expect
    .poll(() => expandedContainer.evaluate((el) => el.hasAttribute("inert")))
    .toBe(true);
});
