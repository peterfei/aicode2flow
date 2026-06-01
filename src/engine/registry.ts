import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LanguageConfig, LanguageName } from '../types.js';

/** Find config/languages/ by walking up from the module location */
function findConfigDir(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, 'config', 'languages');
    if (existsSync(candidate)) return candidate;
    dir = dirname(dir);
  }
  throw new Error('config/languages/ not found');
}

const CONFIG_DIR = findConfigDir();

export class Registry {
  private configs = new Map<string, LanguageConfig>();

  constructor() {
    this.loadAll();
  }

  private loadAll() {
    const files = readdirSync(CONFIG_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const raw = readFileSync(join(CONFIG_DIR, file), 'utf-8');
      const config = JSON.parse(raw) as LanguageConfig;
      config.extensions.forEach(ext => this.configs.set(ext, config));
    }
  }

  /** Detect language from file path (extension-based) */
  detect(filePath: string): LanguageConfig | undefined {
    const ext = '.' + filePath.split('.').pop()?.toLowerCase();
    if (ext && this.configs.has(ext)) return this.configs.get(ext);
    for (const [key, cfg] of this.configs) {
      if (filePath.endsWith(key)) return cfg;
    }
    return undefined;
  }

  /** Get config by explicit language name */
  get(name: LanguageName): LanguageConfig | undefined {
    for (const cfg of this.configs.values()) {
      if (cfg.name === name) return cfg;
    }
    return undefined;
  }

  /** List all supported language names */
  languages(): string[] {
    return [...new Set([...this.configs.values()].map(c => c.name))];
  }
}
