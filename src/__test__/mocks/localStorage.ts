// Vitest
import { vi } from "vitest";

const storage = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => {
    if (storage.has(key)) {
      return storage.get(key);
    } else {
      return null;
    }
  }),
  setItem: vi.fn((key: string, data: string) => storage.set(key, data)),
  removeItem: vi.fn((key: string) => storage.delete(key)),
  clear: vi.fn(() => storage.clear()),
};

export default localStorageMock;
