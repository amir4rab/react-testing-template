import { test, expect } from "@playwright/test";

test("has the main title", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("RTT")).toBeInViewport();
});
