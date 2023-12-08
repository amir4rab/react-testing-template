import type { Tag } from "./tag";
import type { UUID } from "crypto";

export type Todo = {
  id: UUID;
  title: string;
  description?: string;
  tags: Tag[];
  creationDate: string;
  state: "pending" | "completed";
};
