import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import Parser from 'tree-sitter';
import type { LanguageConfig, AnalyzedNode, AnalysisResult } from '../types.js';

/** Find queries/ directory by walking up from the module location */
function findQueriesDir(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, 'queries');
    if (existsSync(candidate)) return candidate;
    dir = dirname(dir);
  }
  throw new Error('queries/ not found');
}

const QUERIES_DIR = findQueriesDir();
const _require = createRequire(import.meta.url);
const grammarCache = new Map<string, Parser.Language>();

function loadGrammar(name: string): Parser.Language {
  if (grammarCache.has(name)) return grammarCache.get(name)!;
  const lang: Parser.Language = _require(name);
  grammarCache.set(name, lang);
  return lang;
}

export class Analyzer {
  private parser: Parser;

  constructor(private config: LanguageConfig) {
    this.parser = new Parser();
  }

  analyze(source: string): AnalysisResult {
    const errors: string[] = [];

    // Load grammar and parse
    let tree: Parser.Tree;
    let lang: Parser.Language;
    try {
      lang = loadGrammar(this.config.grammar);
      this.parser.setLanguage(lang);
      tree = this.parser.parse(source);
    } catch (e: any) {
      return { nodes: [], edges: [], errors: [`Parse failed: ${e.message}`] };
    }

    const root = tree.rootNode;
    if (root.childCount === 0) {
      return { nodes: [], edges: [], errors: ['Empty file or parse produced no nodes'] };
    }

    // Load SCM query file
    const queryPath = join(QUERIES_DIR, `${this.config.name}.scm`);
    let querySrc: string;
    try {
      querySrc = readFileSync(queryPath, 'utf-8');
    } catch {
      return { nodes: [], edges: [], errors: [`Query file not found: ${queryPath}`] };
    }

    let query: Parser.Query;
    try {
      query = new Parser.Query(lang, querySrc);
    } catch (e: any) {
      return { nodes: [], edges: [], errors: [`Query parse error: ${e.message}`] };
    }

    const matches = query.matches(root);
    const rawMatches = new Map<string, { name?: string; callee?: string; startLine: number }[]>();

    // Process all matches: group by capture tag (e.g., @function, @call, @condition)
    for (const m of matches) {
      // Find the type name from captures (captures that aren't metadata)
      let typeName = '';
      const metaNames = ['name', 'body', 'cond', 'callee', 'params', 'expr'];
      for (const c of m.captures) {
        if (!metaNames.includes(c.name)) {
          typeName = c.name;
        }
      }
      if (!typeName) continue;

      if (!rawMatches.has(typeName)) rawMatches.set(typeName, []);

      const entry: any = { startLine: 0 };
      for (const c of m.captures) {
        if (c.name === 'name') entry.name = c.node.text;
        if (c.name === 'callee') entry.callee = c.node.text;
        entry.startLine = Math.min(entry.startLine || Infinity, c.node.startPosition.row + 1);
      }
      rawMatches.get(typeName)!.push(entry);
    }

    // Build nodes from type matches (function, method, arrow, etc.)
    const nodes: AnalyzedNode[] = [];
    const seenNames = new Set<string>();

    for (const [typeName, entries] of rawMatches) {
      if (typeName === 'call' || typeName === 'condition' || typeName === 'loop') continue;
      const def = this.config.nodeTypes[typeName];
      if (!def) continue;

      for (const e of entries) {
        const name = e.name;
        if (!name || seenNames.has(name)) continue;
        if (name.trim() === '' || name.includes('(')) continue;
        if (name.includes(' ')) continue; // likely not a function name
        seenNames.add(name);

        const isEntry = this.config.entryPoints.some(ep =>
          ep.match === 'full' ? name === ep.pattern : name.includes(ep.pattern)
        );

        nodes.push({
          id: this.sanitizeId(name),
          name,
          type: typeName,
          shape: isEntry ? 'stadium' : def.shape,
          startLine: e.startLine,
          isEntry,
          calls: [],
        });
      }
    }

    // Resolve call edges — find which function body each call lives in
    const calls = rawMatches.get('call') ?? [];
    for (const c of calls) {
      if (!c.callee) continue;
      // Find the nearest function defined before this call position
      const caller = [...nodes]
        .filter(n => n.startLine <= c.startLine)
        .sort((a, b) => b.startLine - a.startLine)[0];

      if (caller && caller.name !== c.callee && !caller.calls.includes(c.callee)) {
        caller.calls.push(c.callee);
      }
    }

    // Build edges — only connect to known nodes
    const knownIds = new Set(nodes.map(n => n.id));
    const edges = nodes.flatMap(n =>
      n.calls
        .filter(callee => knownIds.has(this.sanitizeId(callee)))
        .map(callee => ({ from: n.id, to: this.sanitizeId(callee) }))
    );

    // Sort: entry points first, then by source line
    nodes.sort((a, b) => {
      if (a.isEntry && !b.isEntry) return -1;
      if (!a.isEntry && b.isEntry) return 1;
      return a.startLine - b.startLine;
    });

    return { nodes, edges, errors };
  }

  private sanitizeId(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1');
  }
}
