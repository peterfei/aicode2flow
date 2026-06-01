#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { Command } from 'commander';
import chalk from 'chalk';
import { Registry } from './engine/registry.js';
import { Analyzer } from './engine/analyzer.js';
import { generateFlowchart } from './engine/template.js';
import { FLAGS } from './cli-flags.js';
import type { LanguageName } from './types.js';

const program = new Command();
const registry = new Registry();

// Build commander from declarative FLAGS
program
  .name('aicode2flow')
  .description('AI-powered code to Mermaid flowchart — 代码一键生成流程图')
  .version('0.1.0')
  .argument('<path>', 'Source code file or directory path')
  .allowExcessArguments(false);

for (const [key, def] of Object.entries(FLAGS)) {
  const opt = def.alias ? `-${def.alias}, --${key}` : `--${key}`;
  const typeHint = def.type === 'string' ? ' <path>' : '';
  program.option(`${opt}${typeHint}`, def.desc, def.default);
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

async function main(path: string, options: Record<string, any>) {
  const fullPath = resolve(path);

  if (!existsSync(fullPath)) {
    console.error(chalk.red(`✖ File not found: ${fullPath}`));
    process.exit(1);
  }

  const stat = statSync(fullPath);
  const isDir = stat.isDirectory();

  // Determine language config
  let config;
  if (options.language) {
    config = registry.get(options.language as LanguageName);
    if (!config) {
      console.error(chalk.red(`✖ Unsupported language: ${options.language}. Supported: ${registry.languages().join(', ')}`));
      process.exit(1);
    }
  } else if (isDir) {
    console.error(chalk.red('✖ Directory analysis not yet supported. Please specify a file.'));
    process.exit(1);
  } else {
    config = registry.detect(fullPath);
    if (!config) {
      console.error(chalk.red(`✖ Unsupported file type. Supported: ${registry.languages().join(', ')}`));
      process.exit(1);
    }
  }

  // Read source
  let source: string;
  try {
    source = readFileSync(fullPath, 'utf-8');
  } catch (e: any) {
    console.error(chalk.red(`✖ Failed to read file: ${e.message}`));
    process.exit(1);
  }

  // Analyze
  const analyzer = new Analyzer(config);
  const result = analyzer.analyze(source);

  if (result.errors.length > 0) {
    for (const err of result.errors) {
      console.error(chalk.yellow(`⚠ ${err}`));
    }
  }

  if (result.nodes.length === 0) {
    console.error(chalk.yellow('⚠ No functions found in the file.'));
    process.exit(0);
  }

  // Generate Mermaid
  const mermaid = generateFlowchart(result.nodes, result.edges, options.direction ?? 'TD');
  const markdown = `\`\`\`mermaid\n${mermaid}\n\`\`\``;

  // Determine output format
  const outPath = options.output ? resolve(options.output) : null;
  let format = options.format ?? 'mermaid';

  // Auto-detect format from output file extension
  if (outPath) {
    const ext = outPath.endsWith('.svg') ? 'svg' : outPath.endsWith('.png') ? 'png' : null;
    if (ext) format = ext;
  }

  // Render based on format
  if (format === 'svg' || format === 'png') {
    if (!outPath) {
      console.error(chalk.red('✖ --output path is required for SVG/PNG output'));
      process.exit(1);
    }
    await renderImage(mermaid, outPath, format);
  } else {
    // Mermaid text output
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

  // Summary
  console.log(chalk.dim(`📦 ${result.nodes.length} nodes, ${result.edges.length} edges`));
}

program.action((path: string, options: Record<string, any>) => {
  main(path, options).catch((e) => {
    console.error(chalk.red(`✖ Unexpected error: ${e.message}`));
    process.exit(1);
  });
});

program.parse(process.argv);
