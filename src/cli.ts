#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, statSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { Command } from 'commander';
import chalk from 'chalk';
import { Registry } from './engine/registry.js';
import { Analyzer } from './engine/analyzer.js';
import { generateFlowchart, generateThemedFlowchart } from './engine/template.js';
import { globalRegistry } from './engine/theme-registry.js';
import { FLAGS } from './cli-flags.js';
import type { LanguageName, LanguageConfig, AnalysisResult, AnalyzedNode } from './types.js';

const program = new Command();
const registry = new Registry();

const DEFAULT_IGNORE_DIRS = new Set(['node_modules', '.git', '.next', '.svn', '.hg', 'dist', 'build', 'target', '__pycache__', '.venv']);

// Build commander from declarative FLAGS
program
  .name('aicode2flow')
  .description('AI-powered code to Mermaid flowchart — 代码一键生成流程图')
  .version('0.2.0')
  .argument('[path]', 'Source code file or directory path')
  .allowExcessArguments(false);

for (const [key, def] of Object.entries(FLAGS)) {
  const opt = def.alias ? `-${def.alias}, --${key}` : `--${key}`;
  const typeHint = def.type === 'string' ? ' <path>' : '';
  program.option(`${opt}${typeHint}`, def.desc, def.default);
}

/** Recursively walk a directory and collect supported source files */
function scanFiles(
  dir: string,
  registry: Registry,
  excludePattern?: string,
  langFilter?: LanguageConfig
): { path: string; config: LanguageConfig }[] {
  const results: { path: string; config: LanguageConfig }[] = [];
  const exclude = excludePattern ? new RegExp(excludePattern) : null;

  function walk(current: string) {
    let entries;
    try { entries = readdirSync(current, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const fullPath = join(current, entry.name);
      if (exclude?.test(fullPath) || entry.name.startsWith('.')) continue;

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORE_DIRS.has(entry.name)) continue;
        walk(fullPath);
      } else if (entry.isFile()) {
        const config = registry.detect(fullPath);
        if (config && (!langFilter || config.name === langFilter.name)) {
          results.push({ path: fullPath, config });
        }
      }
    }
  }

  walk(dir);
  return results;
}

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1');
}

/** Merge multiple AnalysisResults into one (dedup nodes, cross-file edges) */
function mergeResults(results: AnalysisResult[]): AnalysisResult {
  const allNodes = new Map<string, AnalyzedNode>();
  const errors: string[] = [];

  for (const r of results) {
    errors.push(...r.errors);
    for (const n of r.nodes) {
      if (allNodes.has(n.id)) {
        const existing = allNodes.get(n.id)!;
        for (const c of n.calls) {
          if (!existing.calls.includes(c)) existing.calls.push(c);
        }
      } else {
        allNodes.set(n.id, { ...n, calls: [...n.calls] });
      }
    }
  }

  const knownIds = new Set(allNodes.keys());
  const edges: { from: string; to: string }[] = [];
  for (const n of allNodes.values()) {
    for (const callee of n.calls) {
      const calleeId = sanitizeId(callee);
      if (knownIds.has(calleeId)) {
        edges.push({ from: n.id, to: calleeId });
      }
    }
  }

  const nodes = [...allNodes.values()].sort((a, b) => {
    if (a.isEntry && !b.isEntry) return -1;
    if (!a.isEntry && b.isEntry) return 1;
    return a.name.localeCompare(b.name);
  });

  return { nodes, edges, errors };
}

async function renderImage(mermaid: string, outputPath: string, format: string): Promise<void> {
  const tmpDir = mkdtempSync(join(tmpdir(), 'aicode2flow-'));
  const mmdPath = join(tmpDir, 'diagram.mmd');
  try {
    writeFileSync(mmdPath, mermaid, 'utf-8');
    const { run } = await import('@mermaid-js/mermaid-cli');
    await run(mmdPath, outputPath, {
      outputFormat: format as 'svg' | 'png',
      quiet: true,
    });
    console.log(chalk.green(`✓ Flowchart rendered to ${outputPath}`));
  } catch (e: any) {
    console.error(chalk.red(`✖ Failed to render ${format.toUpperCase()}: ${e.message}`));
    console.error(chalk.yellow('Tip: Try installing puppeteer: npm install puppeteer --save-optional'));
    process.exit(1);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function analyzeFile(filePath: string, config: LanguageConfig): Promise<AnalysisResult> {
  let source: string;
  try {
    source = readFileSync(filePath, 'utf-8');
  } catch (e: any) {
    return { nodes: [], edges: [], errors: [`${filePath}: ${e.message}`] };
  }
  const analyzer = new Analyzer(config);
  return analyzer.analyze(source);
}

async function main(path: string, options: Record<string, any>) {
  const fullPath = resolve(path);

  if (!existsSync(fullPath)) {
    console.error(chalk.red(`✖ File not found: ${fullPath}`));
    process.exit(1);
  }

  const isDir = statSync(fullPath).isDirectory();
  let results: AnalysisResult[];

  if (isDir) {
    // Directory mode — scan and analyze all supported files
    let langFilter: LanguageConfig | undefined;
    if (options.language) {
      langFilter = registry.get(options.language as LanguageName);
      if (!langFilter) {
        console.error(chalk.red(`✖ Unsupported language: ${options.language}. Supported: ${registry.languages().join(', ')}`));
        process.exit(1);
      }
    }

    const files = scanFiles(fullPath, registry, options.exclude, langFilter);
    if (files.length === 0) {
      console.error(chalk.yellow('⚠ No supported source files found in the directory.'));
      process.exit(0);
    }

    console.log(chalk.dim(`🔍 Scanning ${files.length} file(s)...`));

    results = [];
    let totalErrors = 0;
    for (const f of files) {
      const r = await analyzeFile(f.path, f.config);
      results.push(r);
      totalErrors += r.errors.length;
    }

    if (totalErrors > 0) {
      console.error(chalk.yellow(`⚠ ${totalErrors} warning(s) during analysis`));
    }

    results = [mergeResults(results)];
  } else {
    // Single file mode
    const config = options.language
      ? registry.get(options.language as LanguageName)
      : registry.detect(fullPath);

    if (!config) {
      const msg = options.language
        ? `✖ Unsupported language: ${options.language}. Supported: ${registry.languages().join(', ')}`
        : `✖ Unsupported file type. Supported: ${registry.languages().join(', ')}`;
      console.error(chalk.red(msg));
      process.exit(1);
    }

    results = [await analyzeFile(fullPath, config)];
  }

  const result = results[0];
  for (const err of result.errors) {
    console.error(chalk.yellow(`⚠ ${err}`));
  }

  if (result.nodes.length === 0) {
    console.error(chalk.yellow('⚠ No functions found.'));
    process.exit(0);
  }

  // Generate Mermaid (with theme support)
  let mermaid: string;
  if (options.theme) {
    // 加载主题
    try {
      const theme = globalRegistry.resolve(options.theme);
      mermaid = generateThemedFlowchart(result.nodes, result.edges, options.direction ?? 'TD', theme);
    } catch (e: any) {
      console.error(chalk.yellow(`⚠ Failed to load theme '${options.theme}': ${e.message}`));
      console.error(chalk.yellow(`Using default flowchart instead`));
      mermaid = generateFlowchart(result.nodes, result.edges, options.direction ?? 'TD');
    }
  } else {
    mermaid = generateFlowchart(result.nodes, result.edges, options.direction ?? 'TD');
  }
  const markdown = `\`\`\`mermaid\n${mermaid}\n\`\`\``;

  // Determine output format
  const outPath = options.output ? resolve(options.output) : null;
  let format = options.format ?? 'mermaid';

  if (outPath) {
    const ext = outPath.endsWith('.svg') ? 'svg' : outPath.endsWith('.png') ? 'png' : null;
    if (ext) format = ext;
  }

  if (format === 'svg' || format === 'png') {
    if (!outPath) {
      console.error(chalk.red('✖ --output path is required for SVG/PNG output'));
      process.exit(1);
    }
    await renderImage(mermaid, outPath, format);
  } else {
    if (outPath) {
      const content = outPath.endsWith('.md') ? markdown : mermaid;
      writeFileSync(outPath, content, 'utf-8');
      console.log(chalk.green(`✓ Flowchart written to ${outPath}`));
    } else {
      console.log('\n' + chalk.bold('📊 Generated Flowchart'));
      console.log(chalk.dim('─'.repeat(50)));
      console.log('\n' + mermaid);
      console.log('\n' + chalk.dim('Copy the above output into a ```mermaid code block in GitHub Markdown.') + '\n');
    }
  }

  console.log(chalk.dim(`📦 ${result.nodes.length} nodes, ${result.edges.length} edges`));
}

program.action((path: string | undefined, options: Record<string, any>) => {
  // Handle --list-themes
  if (options.listThemes) {
    const themes = globalRegistry.list();
    console.log(chalk.bold('📊 Available Themes:'));
    console.log(chalk.dim('─'.repeat(50)));
    for (const theme of themes) {
      console.log(`${chalk.cyan(theme.name)}${theme.meta?.description ? ` - ${theme.meta.description}` : ''}`);
    }
    console.log(chalk.dim('─'.repeat(50)));
    console.log(chalk.dim(`Total: ${themes.length} theme(s)`));
    process.exit(0);
  }

  // Check if path is provided
  if (!path) {
    console.error(chalk.red('✖ Missing required argument: path'));
    console.error(chalk.dim('Usage: aicode2flow <path> [options]'));
    console.error(chalk.dim('Run: aicode2flow --help for more information'));
    process.exit(1);
  }

  main(path, options).catch((e) => {
    console.error(chalk.red(`✖ Unexpected error: ${e.message}`));
    process.exit(1);
  });
});

program.parse(process.argv);
