import { test, expect } from "@playwright/test";

const mockingData = {
  title: "Some todo task",
  description: "Here is the description of the todo task",
};

/** `playwright-report/` */
const SCREENSHOTS_PATH = "playwright-report/screenshots";

test("Task management test.", async ({ page, browserName }) => {
  await page.goto("/");

  // Opening Modal
  await page.getByText("Add Item").click();

  // Filling the Form
  await page.getByLabel("Title").fill(mockingData.title);
  await page.getByLabel("Description").fill(mockingData.description);

  // Submitting the form
  await page.getByText("Submit").click();

  // Awaiting until modal is closed
  await page.waitForTimeout(500);

  // Validating the existence of added item
  expect(page.getByText(mockingData.title)).toBeDefined();
  expect(page.getByText(mockingData.description)).toBeDefined();

  // Taking a screenshot
  await page.screenshot({
    path:
      SCREENSHOTS_PATH +
      "task-management-pending-tasks-" +
      browserName +
      ".png",
    fullPage: true,
  });

  // Setting the added task to completed
  await page.getByTestId("task-complete").click();

  // Validating if the task has been moved from `pending tasks`
  const pendingList = await page
    .getByTestId("pending-list")
    .allInnerTexts()
    .then((items) => items.filter((i) => i !== ""));
  expect(pendingList.length).toBe(0);

  // Validating if the task has been moved to `completed tasks`
  let completedList = await page
    .getByTestId("completed-list")
    .allInnerTexts()
    .then((items) => items.filter((i) => i !== ""));
  expect(completedList.length).toBe(1);

  // Taking a screenshot
  await page.screenshot({
    path:
      SCREENSHOTS_PATH +
      "/task-management-completed-tasks-" +
      browserName +
      ".png",
    fullPage: true,
  });

  // Deleting the tasks
  await page.getByTestId("task-delete").click();

  // Validating if the task has been successfully deleted
  completedList = await page
    .getByTestId("completed-list")
    .allInnerTexts()
    .then((items) => items.filter((i) => i !== ""));
  expect(completedList.length).toBe(0);

  // Taking a Screenshot
  await page.screenshot({
    path:
      SCREENSHOTS_PATH +
      "task-management-deleted-tasks-" +
      browserName +
      ".png",
    fullPage: true,
  });
});
