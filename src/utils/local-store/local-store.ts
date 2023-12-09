type ReadConfig = {
  parseToJSON: boolean;
};

/** Reads the item from the `local storage` and return the parsed version of it */
const readAction = <T extends Record<string, unknown>>(
  id: string,
  config: ReadConfig = { parseToJSON: true }
): T => {
  const item = localStorage.getItem(id);

  if (item === null) throw new Error(`"${id} "doesn't exits in local storage`);

  return config.parseToJSON ? JSON.parse(item) : item;
};

/** Stores the item to the `local storage` */
const storeAction = (
  id: string,
  data: string | Record<string, unknown>
): void => {
  localStorage.setItem(
    id,
    typeof data !== "string" ? JSON.stringify(data) : data
  );
};

/** Deletes the specific record from `local storage` */
const deleteAction = (id: string) => localStorage.removeItem(id);

/** Clears the `local storage` */
const clearAction = () => localStorage.clear();

const localStore = () => ({
  read: readAction,
  store: storeAction,
  delete: deleteAction,
  clear: clearAction,
});

export default localStore;
