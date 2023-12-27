import { test, expect } from "@playwright/test";

const mockingData = {
  title: "Some todo task",
  description: "Here is the description of the todo task",
};

test("Hydrates the tasks from localstorage after a full page reload.", async ({ page }) => {
  await page.goto("/");

  // Opening Modal
  await page.getByText("Add Item").click();

  // Filling the Form
  await page.getByLabel("Title").fill(mockingData.title);
  await page.getByLabel("Description").fill(mockingData.description);

  // Submitting the form
  await page.getByText("Submit").click();

  // Reloading the page
  await page.reload();
  await page.waitForTimeout(500);

  // Validating the existence of added item
  expect(page.getByText(mockingData.title)).toBeDefined();
  expect(page.getByText(mockingData.description)).toBeDefined();
});
