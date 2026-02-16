export interface ExportConfig {
  claudeMd: string;
  agentsMd: string;
  mcpJson: string;
  configToml: string;
}

export type ExportPlatform = "claude-code" | "codex" | "both";
