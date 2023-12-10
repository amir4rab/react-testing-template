import { type FormEventHandler, useCallback, useRef } from "react";

// Types
import type { UUID } from "node:crypto";
import type { Todo } from "../../types";

// Internal Types
export interface TodoInputProps {
  data?: Todo;
  onSubmit?: (item: Todo) => void;
}

const defaultData: Todo = {
  creationDate: "",
  id: "" as UUID,
  state: "pending",
  tags: [],
  title: "",
  description: "",
};

/** Provides a component to wrap label and input together in a simpler way */
const InputGroup = ({
  id,
  name,
  defaultValue,
  placeholder,
  title,
  inputType = "input",
}: {
  id: string;
  name: string;
  title: string;
  placeholder: string;
  defaultValue: string;
  inputType?: "textarea" | "input";
}) => {
  return (
    <div>
      <label htmlFor={id} className="text-xl mb-1 block font-semibold">
        {title}
      </label>
      {inputType === "input" && (
        <input
          id={id}
          name={name}
          className="w-full px-4 py-2 rounded-xl border outline-none bg-neutral-50 border-neutral-200 focus-visible:border-primary-300 text-sm"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
      {inputType === "textarea" && (
        <textarea
          id={id}
          name={name}
          className="w-full px-4 py-2 rounded-xl border outline-none bg-neutral-50 border-neutral-200 focus-visible:border-primary-300 text-sm resize-none md:h-[30vh] h-[20vh] overflow-y-auto"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
};

const TodoInput = ({ data = defaultData, onSubmit }: TodoInputProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  /** Submits the values to the parent component and resets the input fields */
  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const { current: form } = formRef;
      const { current: button } = buttonRef;

      if (form === null || button === null) return;

      const formData = new FormData(form, button);
      const items: Map<string, string> = new Map();

      for (const item of formData.entries()) {
        const [key, value] = item;
        if (typeof key === "string" && typeof value === "string")
          items.set(key, value);
      }

      const date = new Date();
      onSubmit &&
        onSubmit({
          creationDate: date.toLocaleDateString("en-uk"),
          id: crypto.randomUUID(),
          state: "pending",
          tags: [],
          title: items.has("title") ? items.get("title")! : "",
          description: items.has("description")
            ? items.get("description")!
            : "",
        });

      form.reset();
    },
    [onSubmit]
  );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-6 min-h-full justify-start"
    >
      <InputGroup
        id="title-input"
        name="title"
        title="Title"
        defaultValue={data.title}
        placeholder="Doing Groceries"
      />
      <InputGroup
        id="description-input"
        name="description"
        title="Description"
        defaultValue={data.description ? data.description : ""}
        placeholder="Eggs, Potatoes, Milk"
        inputType="textarea"
      />
      <div className="grow flex justify-end items-end">
        <button
          ref={buttonRef}
          className={[
            "bg-primary-200/50",
            "hover:bg-primary-200",
            "active:bg-primary-200",
            "text-sm",
            "px-4",
            "py-1",
            "rounded-lg",
            "border",
            "border-primary-300/50",
            "duration-150",
            "transition-colors",
          ].join(" ")}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TodoInput;
