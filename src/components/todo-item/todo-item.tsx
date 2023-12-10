"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

import type { Todo } from "../../types";

import { TrashIcon, ArchiveBoxIcon } from "@heroicons/react/24/solid";

export interface ItemProps extends Todo {
  selectedTag?: string;
  setSelectedTag?: Dispatch<SetStateAction<string>>;
  onComplete?: () => void;
  onDelete?: () => void;
}

const TodoItem = ({
  state,
  tags,
  title,
  description,
  selectedTag,
  setSelectedTag,
  onComplete,
  onDelete,
}: ItemProps) => {
  const [actionsState, setActionsState] = useState<"hidden" | "visible">(
    "hidden"
  );
  const onExitTimeoutRef = useRef<number | null>(null);

  /** Updates the state of the actions */
  const onPointer = useCallback(
    (state: "hidden" | "visible", closingTimeout = 600) => {
      if (onExitTimeoutRef.current) {
        clearTimeout(onExitTimeoutRef.current);
        onExitTimeoutRef.current = null;
      }

      if (state === "visible") {
        setActionsState("visible");
      } else {
        onExitTimeoutRef.current = setTimeout(
          setActionsState.bind(null, "hidden"),
          closingTimeout
        ) as unknown as number;
      }
    },
    []
  );

  return (
    <li
      data-completed={state === "completed"}
      onPointerEnter={onPointer.bind(null, "visible", undefined)}
      onPointerLeave={onPointer.bind(null, "hidden", undefined)}
      className={[
        "p-6",
        "rounded-3xl",
        "border",
        "border-neutral-200",
        "relative",
        "md:bg-neutral-50",
        "max-w-full",
        "overflow-hidden",
        "md:overflow-visible",
        "data-[completed=true]:border-transparent",
        "data-[completed=true]:bg-primary-50",
      ].join(" ")}
    >
      <div className="flex md:justify-between md:flex-row flex-col items-center justify-start mb-2">
        <p className="text-lg font-normal my-0 mr-auto mb-2 md:mb-0">{title}</p>
        <div className="max-w-full md:max-w-[70%] overflow-x-auto flex justify-start mr-auto md:mr-0 md:flex-row-reverse gap-2">
          {tags.map(({ color, id, text }) => (
            <button
              data-color={color}
              data-selected={text === selectedTag}
              onClick={setSelectedTag?.bind(null, text)}
              className={[
                // Default Backgrounds
                "data-[selected=false]:data-[color=pink]:bg-pink-200/50",
                "data-[selected=false]:data-[color=blue]:bg-blue-200/50",
                "data-[selected=false]:data-[color=green]:bg-green-200/50",
                "data-[selected=false]:data-[color=red]:bg-red-200/50",
                // Hovered Backgrounds
                "data-[selected=false]:hover:data-[color=pink]:bg-pink-200/75",
                "data-[selected=false]:hover:data-[color=blue]:bg-blue-200/75",
                "data-[selected=false]:hover:data-[color=green]:bg-green-200/75",
                "data-[selected=false]:hover:data-[color=red]:bg-red-200/75",
                // Selected Backgrounds
                "data-[selected=true]:data-[color=pink]:bg-pink-200",
                "data-[selected=true]:data-[color=blue]:bg-blue-200",
                "data-[selected=true]:data-[color=green]:bg-green-200",
                "data-[selected=true]:data-[color=red]:bg-red-200",
                // Border Colors
                "data-[selected=false]:data-[color=pink]:border-pink-400",
                "data-[selected=false]:data-[color=blue]:border-blue-400",
                "data-[selected=false]:data-[color=green]:border-green-400",
                "data-[selected=false]:data-[color=red]:border-red-400",
                "data-[selected=true]:border-transparent",
                "transition-colors",
                "duration-150",
                "border",
                "px-4",
                "py-1",
                "rounded-3xl",
                "overflow-hidden",
                "text-xs",
                "select-none",
                "flex-shrink-0",
              ].join(" ")}
              key={id}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      <span className="text-xs leading-tight font-light">{description}</span>
      <div
        data-state={actionsState}
        className={[
          "flex",
          "md:flex-col",
          "justify-end",
          "gap-1",
          "mt-4",
          "text-sm",
          "text-neutral-900",
          "md:absolute",
          "md:-left-4",
          "md:top-[50%]",
          "md:items-start",
          "md:translate-x-0",
          "md:translate-y-[-50%]",
          "md:mt-0",
          "md:transition-[opacity,transform]",
          "md:duration-200",
          "md:ease-elastic-1",
          "md:opacity-0",
          "md:data-[state=hidden]:opacity-0",
          "md:data-[state=visible]:translate-x-[-100%]",
          "md:data-[state=visible]:opacity-100",
        ].join(" ")}
      >
        <button
          onClick={onDelete}
          className="p-2 rounded-3xl bg-red-200/25 hover:bg-red-200 transition-colors duration-150"
        >
          <span className="hidden">Delete</span>
          <TrashIcon className="w-4 h-4" />
        </button>
        <button
          disabled={state === "completed"}
          onClick={onComplete}
          className="p-2 rounded-3xl bg-neutral-100/25 hover:bg-neutral-100 transition-colors duration-150 disabled:opacity-50"
        >
          <span className="hidden">Complete</span>
          <ArchiveBoxIcon className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
