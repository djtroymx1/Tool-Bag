import type { CatalogItem } from "@/types/catalog";

export function generateMcpJson(items: CatalogItem[]): string {
  const mcpItems = items.filter((item) => item.mcp_config_claude !== null);

  if (mcpItems.length === 0) {
    return JSON.stringify({ mcpServers: {} }, null, 2);
  }

  const mcpServers: Record<string, unknown> = {};

  for (const item of mcpItems) {
    if (item.mcp_config_claude) {
      // mcp_config_claude is stored as { "serverName": { ...config } }
      for (const [key, value] of Object.entries(item.mcp_config_claude)) {
        mcpServers[key] = value;
      }
    }
  }

  return JSON.stringify({ mcpServers }, null, 2);
}
