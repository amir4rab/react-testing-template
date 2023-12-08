import type { UUID } from "node:crypto";

export type Tag = {
  color: "pink" | "blue" | "green" | "red";
  text: string;
  id: UUID;
};
