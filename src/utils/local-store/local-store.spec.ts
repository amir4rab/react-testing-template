// Vitest
import { vi, beforeEach, afterEach } from "vitest";

// Local Store
import localStore from "./local-store";

// Mocks
import localStorageMock from "../../__test__/mocks/localStorage";

describe("Local Store ", () => {
  beforeEach(() => {
    // Setting Mocked localStorage
    vi.stubGlobal("localStorage", localStorageMock);

    // Storing item in local storage
    localStore().store("test", { data: ["hello world"] });
  });

  afterEach(() => {
    // Deleting the Mocked localStorage
    vi.unstubAllGlobals();
  });

  it("Stores and retrieves the items from localStorage", () => {
    // Reading the stored item from local storage
    const item = localStore().read<{ data: string[] }>("test");

    expect(item).toBeTypeOf("object");
    expect(item.data).length(1);
  });

  it("Deletes the item from the localStorage", () => {
    let item = localStorage.getItem("test");
    expect(item).toBeTypeOf("string");

    localStore().delete("test");

    item = localStorage.getItem("test");
    expect(item).toBe(null);
  });

  it("Clears localStorage", () => {
    let item = localStorage.getItem("test");
    expect(item).toBeTypeOf("string");

    localStore().clear();

    item = localStorage.getItem("test");
    expect(item).toBe(null);
  });
});
