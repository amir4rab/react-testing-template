// Testing Library
import { render, screen } from "@testing-library/react";

// Components
import TodoInput from "./todo-input";

// Types
import { Todo } from "../../types";

// Mocking Data
const mockingData = {
  title: "Some Title",
  description: "Some Description",
};

describe("Todo Input Component", () => {
  it("renders the inputs", () => {
    render(<TodoInput />);

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const descriptionInput = screen.getByLabelText("Description");
    expect(descriptionInput).toBeInTheDocument();
  });

  it("submits the required values", () => {
    const onSubmit = ({ title, description, id }: Todo) => {
      expect(title).toBe(mockingData.title);
      expect(description).toBe(mockingData.description);
      expect(id).toBeTypeOf("string");
    };

    render(<TodoInput onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const submitButton = screen.getByText("Submit");

    titleInput.value = mockingData.title;
    descriptionInput.value = mockingData.description;

    submitButton.click();
  });

  it("clears the inputs after submission", () => {
    render(<TodoInput />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const submitButton = screen.getByText("Submit");

    titleInput.value = mockingData.title;
    descriptionInput.value = mockingData.description;

    submitButton.click();

    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });
});
