// Testing Library
import { act, render, screen } from "@testing-library/react";

// Components
import TodoList from "./todo-list";

describe("Todo List Component", () => {
  it("renders main components", () => {
    render(<TodoList />);

    const title = screen.getByText("To Do Tasks");
    expect(title).toBeInTheDocument();

    const pendingTitle = screen.getByText("Pending items");
    expect(pendingTitle).toBeInTheDocument();

    const completedTitle = screen.getByText("Completed items");
    expect(completedTitle).toBeInTheDocument();
  });

  it("possibility of managing items", () => {
    render(<TodoList />);

    const addButton = screen.getByTestId("add-modal-opener");
    addButton.click();

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const submitButton = screen.getByText("Submit");

    titleInput.value = "Some Title";
    descriptionInput.value = "Some Description";

    act(() => {
      submitButton.click();
    });

    const pendingTasks = screen.getByTestId("pending-list");

    expect(pendingTasks.childElementCount).toBe(1);
  });
});
