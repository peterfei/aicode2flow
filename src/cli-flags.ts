export interface FlagDef {
  alias?: string;
  type: 'string' | 'boolean';
  desc: string;
  default?: string | boolean;
}

export const FLAGS: Record<string, FlagDef> = {
  output:    { alias: 'o', type: 'string', desc: 'Output file path (.mmd / .md / .svg / .png)' },
  format:    { alias: 'f', type: 'string', desc: 'Output format: mermaid / svg / png', default: 'mermaid' },
  depth:     { alias: 'd', type: 'string', desc: 'Analysis depth', default: '0' },
  language:  { alias: 'l', type: 'string', desc: 'Force language (go/python/javascript)' },
  exclude:   { alias: 'e', type: 'string', desc: 'Exclude pattern (glob)' },
  direction: { type: 'string', desc: 'Flow direction: TD (top-down) / LR (left-right)', default: 'TD' },
  theme:     { alias: 't', type: 'string', desc: 'Theme name (github-dark, dracula, nord, etc.)' },
  listThemes: { type: 'boolean', desc: 'List all available themes (no path required)' },
  ai:        { type: 'boolean', desc: 'Enable AI semantic enhancement', default: false },
};
