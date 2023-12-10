import { useCallback, useMemo, useState } from "react";

// Types
import { Todo } from "../../types";

// Konj UI
import { AnchoredDialog } from "@konj-org/react-ui";

// Icons
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";

// Components
import TodoItem from "../todo-item";
import TodoInput from "../todo-input";

// Hooks
import useTodo, { IndexTodo, UseTodoHookResults } from "../../hooks/use-todo";

// Stylings
const buttonClassName = [
  "disabled:cursor-default",
  "disabled:opacity-50",
  "disabled:border-transparent",
  "flex",
  "rounded-xl",
  "justify-center",
  "items-center",
  "text-sm",
  "gap-1",
  "bg-white",
  "hover:not(:disabled):bg-neutral-50",
  "active:not(:disabled):bg-neutral-100",
  "border-neutral-300",
  "border",
  "transition-colors",
  "duration-200",
  "p-2",
  "md:px-4",
].join(" ");

/** Groups the tasks into a single component */
const GroupedTask = ({
  tasks,
  title,
  db,
}: {
  tasks: IndexTodo[];
  title: string;
  db: UseTodoHookResults["db"];
}) => {
  return (
    <section>
      <p className="text-sm font-semibold">{title} items</p>
      <ol
        data-testid={title.toLowerCase() + "-list"}
        className="my-4 grid gap-2"
      >
        {tasks.map(({ index, ...item }) => (
          <TodoItem
            key={item.id}
            onDelete={() => db().delete(index)}
            onComplete={() =>
              db().update({
                ...item,
                index,
                state: "completed",
              })
            }
            {...item}
          />
        ))}
      </ol>
      {tasks.length === 0 && (
        <p className="my-8 text-center max-w-[70%] mx-auto opacity-50 font-mono text-sm">
          There are no "{title}" task
        </p>
      )}
    </section>
  );
};

/** Provides the wrapper around the main elements of the page */
const TodoList = () => {
  const { db, items, loading } = useTodo();
  const [addingItemDialog, setAddingItemDialog] = useState(false);

  /** Submits the added items to database */
  const onAddItem = useCallback(
    (data: Todo) => {
      db().create(data);

      setAddingItemDialog(false);
    },
    [db]
  );

  /** Groups the tasks into two buckets of `completed` and `pending` items */
  const { completedItems, pendingItems } = useMemo(() => {
    const pendingItems: typeof items = [];
    const completedItems: typeof items = [];

    items.forEach((item) => {
      if (item.state === "completed") completedItems.push(item);
      if (item.state === "pending") pendingItems.push(item);
    });

    return {
      pendingItems,
      completedItems,
    };
  }, [items]);

  return (
    <>
      <div className="px-8 md:px-0 max-w-3xl mx-auto my-8 relative min-h-[40vh] pb-12">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 py-3 bg-white z-10 mb-4">
          {/* Title */}
          <h2 className="text-3xl font-extrabold">To Do Tasks</h2>
          {/* Main Actions */}
          <div className="flex gap-1 justify-end">
            <button
              aria-label="search"
              data-testid="search-modal-opener"
              disabled={true}
              onClick={setAddingItemDialog.bind(null, true)}
              className={buttonClassName}
            >
              <MagnifyingGlassIcon className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:block">Search</span>
            </button>
            <button
              aria-label="Add item"
              data-testid="add-modal-opener"
              disabled={loading}
              onClick={setAddingItemDialog.bind(null, true)}
              className={buttonClassName}
            >
              <PlusIcon className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:block">Add Item</span>
            </button>
          </div>
        </div>
        {/* Tasks and Loading state */}
        {loading && <p className="text-center my-4">Loading...</p>}
        {!loading && (
          <div className="grid gap-6">
            <GroupedTask tasks={pendingItems} db={db} title="Pending" />
            <GroupedTask tasks={completedItems} db={db} title="Completed" />
          </div>
        )}
      </div>
      {/* Dialogs */}
      <AnchoredDialog
        slim
        title="Adding item"
        state={addingItemDialog}
        setState={setAddingItemDialog}
      >
        <TodoInput onSubmit={onAddItem} />
      </AnchoredDialog>
    </>
  );
};

export default TodoList;
