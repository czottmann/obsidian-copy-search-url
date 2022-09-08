import { View } from "obsidian";

interface GetQueryFunction {
  (): string;
}

export interface SearchLeafView extends View {
  getQuery: GetQueryFunction;
}
