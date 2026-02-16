import {
  createSearchParamsCache,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const catalogSearchParams = {
  platform: parseAsStringLiteral([
    "claude-code",
    "codex",
    "both",
  ] as const).withDefault("both"),
  category: parseAsString.withDefault(""),
  q: parseAsString.withDefault(""),
  priority: parseAsString.withDefault(""),
  source: parseAsString.withDefault(""),
};

export const searchParamsCache = createSearchParamsCache(catalogSearchParams);
