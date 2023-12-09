// Node JS
import { randomUUID } from "node:crypto";

// Vitest
import { beforeEach, afterEach } from "vitest";

// React Testing Library
import { renderHook, act } from "@testing-library/react";

// Mocked Local Storage
import localStorageMock from "../../__test__/mocks/localStorage";

// useTodo
import useTodo from "./use-todo";

// Mocking Data
const mockingTitles = [
  "Todays tasks",
  "Uni exams",
  "Updating Portfolio",
  "Emailing the application committee",
  "Shopping groceries",
];

describe("useTodo", () => {
  beforeEach(() => {
    // Setting Mocked localStorage
    vi.stubGlobal("localStorage", localStorageMock);
  });

  afterEach(() => {
    // Deleting the Mocked localStorage
    vi.unstubAllGlobals();
  });

  test("Appending items to the todo list", () => {
    const { result } = renderHook(() => useTodo());

    expect(result.current.items).length(0);

    act(() => {
      result.current.db().create({
        creationDate: "",
        id: randomUUID(),
        state: "completed",
        tags: [],
        title: "",
        description: "",
      });
    });

    expect(result.current.items).length(1);

    // Clearing the Database
    act(() => {
      result.current.db().clear();
    });
  });

  test("Removing items from the todo list", () => {
    const { result } = renderHook(() => useTodo());

    // Adding 10 items
    act(() => {
      for (let i = 0; i <= 10; i++) {
        result.current.db().create({
          creationDate: "",
          id: randomUUID(),
          state: "completed",
          tags: [],
          title: i.toString(),
          description: "",
        });
      }
    });

    // Removing the first item
    act(() => {
      result.current.db().delete(0);
    });

    // Checking if the first item was successfully deleted
    // [0,1,2,3,4,5,6,7,8,9] ==> [1,2,3,4,5,6,7,8,9]
    expect(result.current.items[0].title).toBe("1");

    // Removing the last item
    act(() => {
      result.current.db().delete(9);
    });

    // Checking if the last item was successfully deleted
    // [1,2,3,4,5,6,7,8,9] ==> [1,2,3,4,5,6,7,8]
    expect(result.current.items[7].title).toBe("8");

    // Clearing the Database
    act(() => {
      result.current.db().clear();
    });
  });

  test("Searching throw the items", () => {
    const { result } = renderHook(() => useTodo());

    // Adding items
    act(() => {
      mockingTitles.forEach((title) => {
        result.current.db().create({
          creationDate: "",
          id: randomUUID(),
          state: "pending",
          tags: [],
          title,
          description: "",
        });
      });
    });

    // Checking if the first results matches the query
    act(() => {
      const searchResults = result.current.search("Shopping");

      expect(searchResults[0].item.title).toBe(mockingTitles[4]);
    });

    // Clearing the Database
    act(() => {
      result.current.db().clear();
    });
  });

  test("Updating an existing item", () => {
    const { result } = renderHook(() => useTodo());

    // Adding items
    act(() => {
      mockingTitles.forEach((title) => {
        result.current.db().create({
          creationDate: "",
          id: randomUUID(),
          state: "pending",
          tags: [],
          title,
          description: "",
        });
      });
    });

    // Updating the first item of the todo list
    act(() => {
      const item = result.current.items[0];
      item.title = "Updated title";
      item.state = "completed";

      result.current.db().update(item);
    });

    expect(result.current.items[0].title).toBe("Updated title");
    expect(result.current.items[0].state).toBe("completed");

    // Clearing the Database
    act(() => {
      result.current.db().clear();
    });
  });
});
