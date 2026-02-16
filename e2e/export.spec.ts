import { expect, test } from "@playwright/test";

const EXPORT_TAB_LABELS = ["CLAUDE.md", "mcp.json", "AGENTS.md", "config.toml"];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("catalog-tour-completed", "true");
    localStorage.setItem("hero-dismissed", "true");
  });
});

test("selection flows from catalog to export and copy works", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator("[data-testid='catalog-card']").first();
  const selectedItemName = (
    await firstCard.getByTestId("catalog-card-title").textContent()
  )?.trim();
  expect(selectedItemName).toBeTruthy();

  const selectionCheckbox = firstCard.getByRole("checkbox");
  await selectionCheckbox.evaluate((el) => (el as HTMLButtonElement).click());
  await expect(selectionCheckbox).toHaveAttribute("aria-checked", "true");

  await page.getByRole("link", { name: /Project/i }).click();
  await expect(page).toHaveURL(/\/project$/);
  await expect(page.getByRole("heading", { name: "Project Builder" })).toBeVisible();

  await page.getByRole("button", { name: "Export Config" }).click();
  await expect(page).toHaveURL(/\/project\/export$/);
  await expect(page.getByRole("heading", { name: "Export Config" })).toBeVisible();

  let foundInConfig = false;
  for (const label of EXPORT_TAB_LABELS) {
    const tab = page.getByRole("tab", { name: label, exact: true });
    if ((await tab.count()) === 0) continue;

    await tab.click();
    const configText = await page.locator("pre").first().textContent();
    if (configText?.includes(selectedItemName!)) {
      foundInConfig = true;
      break;
    }
  }

  expect(foundInConfig).toBeTruthy();

  const copyButton = page.getByRole("button", { name: "Copy" }).first();
  await copyButton.click();
  await expect(page.getByRole("button", { name: "Copied!" }).first()).toBeVisible();
});
