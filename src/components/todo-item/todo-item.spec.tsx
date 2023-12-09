// Node JS
import { randomUUID } from "node:crypto";

// Testing Library
import { render, screen } from "@testing-library/react";

// Components
import TodoItem from "./todo-item";

// Types
import type { Todo } from "../../types";

// Required Data
const currentDate = new Date().toDateString();
const item: Todo = {
  creationDate: currentDate,
  id: randomUUID(),
  state: "pending",
  tags: [
    {
      color: "pink",
      id: randomUUID(),
      text: "Urgent",
    },
  ],
  title: "Go Shopping",
  description: "Shopping list: Eggs, Milk and Coffee",
};

describe("Todo Item Component", () => {
  it("renders its items", () => {
    render(<TodoItem {...item} />);

    const title = screen.getByText(item.title);
    expect(title).toBeInTheDocument();

    // Checking if description exits
    if (item.description) {
      const description = screen.getByText(item?.description);
      expect(description).toBeInTheDocument();
    }

    // Checking if tags exit
    item.tags.forEach(({ text }) => {
      const tagElement = screen.getByText(text);
      expect(tagElement).toBeInTheDocument();
    });
  });
});
