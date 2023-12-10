import { useCallback, useEffect, useState } from "react";

// Types
import type { Todo } from "../../types";

// Utils
import localStore from "../../utils/local-store";

// Fuse
import Fuse, { type FuseResult } from "fuse.js";

// Constants
const DB_KEY = "todo-database-v0.0.1";

// Internal Types
export type IndexTodo = Todo & { index: number };

type Item = {
  create: (item: Todo) => boolean;
  update: (item: IndexTodo) => boolean;
  delete: (index: number) => boolean;
  clear: () => boolean;
};

export type UseTodoHookResults = {
  items: IndexTodo[];
  loading: boolean;
  db: () => Item;
  search: (query: string) => FuseResult<IndexTodo>[];
};

/**
 * Facilitates the usage of the todo application
 * @example
 * const todo = useTodo();
 *
 * // Creating a todo
 * todo.db().create({
 *    creationDate: "2023-05-05",
 *    id: randomUUID(),
 *    state: "pending",
 *    tags: ["Urgent"],
 *    title: "Complete the assignment",
 *    description: "The software development methods assignment is due on December 13",
 * });
 *
 * // Getting all of items
 * const items = todo.items;
 *
 * // Searching throw the items
 * todo.search("assignment")
 *
 * // Deleting a todo
 * todo.db().delete(0); // You need to pass the index of todo which you want to delete
 *
 * // Clearing the whole database
 * todo.db().clear();
 */
const useTodo = (): UseTodoHookResults => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UseTodoHookResults["items"]>([]);

  //--- Database Actions ---//
  /** Creates a new item and add it to the database */
  const createItem = useCallback<Item["create"]>((item) => {
    try {
      const copiedItem = structuredClone(item);
      setItems((curr) => {
        const index = curr.length;

        // updating the array
        const copiedItems: UseTodoHookResults["items"] = [
          ...curr,
          {
            index,
            ...copiedItem,
          },
        ];

        // storing new items in database and creating a copied array
        localStore().store(DB_KEY, {
          data: copiedItems.map(
            ({ creationDate, id, state, tags, title, description }) => {
              return {
                creationDate,
                id,
                state,
                tags,
                title,
                description,
              };
            }
          ),
        });

        return copiedItems;
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  /** Updates an existing item in the database */
  const updateItem = useCallback<Item["update"]>((item) => {
    try {
      setItems((curr) => {
        // Checking if the new id matches to the existing id
        if (curr[item.index].id !== item.id)
          throw new Error(
            `Item id doesn't match to the existing item, existing id: ${
              curr[item.index].id
            }, new id: ${item.id}`
          );

        // Updating the updated item
        curr[item.index] = item;

        // storing two versions of the items
        const copiedIndexedItems: IndexTodo[] = []; // For setting to the items state
        const copiedItems: Todo[] = []; // For passing to local store

        // Lopping throw the items and copping them
        curr.forEach(
          ({ creationDate, id, index, state, tags, title, description }) => {
            copiedIndexedItems.push({
              creationDate,
              id,
              index,
              state,
              tags,
              title,
              description,
            });

            copiedItems.push({
              creationDate,
              id,
              state,
              tags,
              title,
              description,
            });
          }
        );

        localStore().store(DB_KEY, { data: copiedItems });

        return copiedIndexedItems;
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  /** Delete the desired item by passing it's index */
  const deleteItem = useCallback<Item["delete"]>((index) => {
    try {
      setItems((curr) => {
        const slicingPointStart = index > 1 ? index - 1 : index;
        const slicingPointEnd = index < curr.length ? index + 1 : index;

        const copiedItems: UseTodoHookResults["items"] = [];
        const copiedItemsForStore: Todo[] = [];

        // Storing the first slice of array
        curr.slice(0, slicingPointStart).forEach((item) => {
          copiedItems.push(item);

          const { creationDate, id, state, tags, title, description } = item;
          copiedItemsForStore.push({
            creationDate,
            id,
            state,
            tags,
            title,
            description,
          });
        });

        // Storing the second slice of array
        curr
          .slice(slicingPointEnd)
          .forEach(
            ({ creationDate, id, state, tags, title, description, index }) => {
              copiedItems.push({
                creationDate,
                id,
                state,
                tags,
                title,
                description,
                index: index !== 0 ? index - 1 : 0,
              });

              copiedItemsForStore.push({
                creationDate,
                id,
                state,
                tags,
                title,
                description,
              });
            }
          );

        localStore().store(DB_KEY, {
          data: copiedItemsForStore,
        });

        return copiedItems;
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  /** Clears the whole database of todo items */
  const clearItems = useCallback(() => {
    try {
      setItems([]);
      localStore().delete(DB_KEY);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const db = useCallback<() => Item>(
    () => ({
      create: createItem,
      update: updateItem,
      delete: deleteItem,
      clear: clearItems,
    }),
    [createItem, updateItem, deleteItem, clearItems]
  );

  //--- Search Action ---//
  /** Searches throw the database with fuse.js */
  const search = useCallback<UseTodoHookResults["search"]>(
    (query) => {
      const fuse = new Fuse(items, {
        includeScore: true,
        keys: ["title", "description", "tags"],
      });

      return fuse.search(query);
    },
    [items]
  );

  // Hydrates the items
  useEffect(() => {
    try {
      // Checks if the local storage already includes a data
      const { data } = localStore().read<{ data: Todo[] }>(DB_KEY);
      setItems(
        data.map((data, index) => ({
          ...data,
          index,
        }))
      );
    } catch {
      // Incase there were no data, stores a empty array into local storage
      localStore().store(DB_KEY, { data: [] });
    } finally {
      // Sets the loading status to false
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    db,
    search,
  };
};

export default useTodo;
