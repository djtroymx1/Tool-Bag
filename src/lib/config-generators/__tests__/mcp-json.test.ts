import { describe, it, expect } from "vitest";
import { generateMcpJson } from "../mcp-json";
import {
  skillItem,
  mcpItem,
  mcpItemWithEnv,
  allFixtureItems,
} from "./fixtures";

describe("generateMcpJson", () => {
  it("returns valid JSON with empty mcpServers for no items", () => {
    const result = generateMcpJson([]);
    const parsed = JSON.parse(result);
    expect(parsed).toEqual({ mcpServers: {} });
  });

  it("returns valid JSON with empty mcpServers when no items have mcp_config", () => {
    const result = generateMcpJson([skillItem]);
    const parsed = JSON.parse(result);
    expect(parsed).toEqual({ mcpServers: {} });
  });

  it("produces valid JSON output", () => {
    const result = generateMcpJson([mcpItem, mcpItemWithEnv]);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("includes MCP server configs from items with mcp_config_claude", () => {
    const result = generateMcpJson([mcpItem]);
    const parsed = JSON.parse(result);
    expect(parsed.mcpServers.context7).toBeDefined();
    expect(parsed.mcpServers.context7.command).toBe("npx");
    expect(parsed.mcpServers.context7.args).toEqual([
      "-y",
      "@upstash/context7-mcp@latest",
    ]);
  });

  it("merges multiple MCP server configs", () => {
    const result = generateMcpJson([mcpItem, mcpItemWithEnv]);
    const parsed = JSON.parse(result);
    expect(Object.keys(parsed.mcpServers)).toHaveLength(2);
    expect(parsed.mcpServers.context7).toBeDefined();
    expect(parsed.mcpServers.supabase).toBeDefined();
  });

  it("preserves env vars in MCP config", () => {
    const result = generateMcpJson([mcpItemWithEnv]);
    const parsed = JSON.parse(result);
    expect(parsed.mcpServers.supabase.env).toEqual({
      SUPABASE_ACCESS_TOKEN: "<your-token>",
    });
  });

  it("filters out items without mcp_config_claude from mixed set", () => {
    const result = generateMcpJson(allFixtureItems);
    const parsed = JSON.parse(result);
    // mcpItem, mcpItemWithEnv, and mcpItemWithCodexOverride include claude MCP config
    expect(Object.keys(parsed.mcpServers)).toHaveLength(3);
  });
});
