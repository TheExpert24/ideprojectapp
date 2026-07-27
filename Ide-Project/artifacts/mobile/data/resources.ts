export type ResourceCategory =
  | "financial"
  | "housing"
  | "legal"
  | "employment"
  | "mental"
  | "benefits"
  | "community";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const CATEGORIES: { id: ResourceCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "financial", label: "Money" },
  { id: "housing", label: "Housing" },
  { id: "legal", label: "Legal" },
  { id: "employment", label: "Jobs" },
  { id: "mental", label: "Health" },
  { id: "community", label: "Community" },
];

export const RESOURCES: Resource[] = [];
