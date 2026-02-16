import type { Category, Platform, Priority, Source } from "./catalog";

export interface FilterState {
  platform: Platform | "both";
  category: Category | "";
  q: string;
  stack: string[];
  priority: Priority | "";
  source: Source | "";
}
