import { expect, test } from "@playwright/test";

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

  await page.getByRole("button", { name: /MCP Servers/i }).first().click();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("category"))
    .toBe("MCP Servers");

  const platformToggle = page.getByTestId("platform-toggle");
  await expect(platformToggle).toBeVisible();
  await platformToggle.getByText("Codex", { exact: true }).click();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("platform"))
    .toBe("codex");
});

test("catalog card expands on click", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator("[data-testid='catalog-card']").first();
  await firstCard.getByTestId("catalog-card-expand").click();
  await expect(firstCard.getByTestId("catalog-card-expanded")).toBeVisible();
});
