#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
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

program.action((path: string, options: Record<string, any>) => {
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

  // Output
  if (options.output) {
    const outPath = resolve(options.output);
    const content = outPath.endsWith('.md') ? markdown : mermaid;
    writeFileSync(outPath, content, 'utf-8');
    console.log(chalk.green(`✓ Flowchart written to ${outPath}`));
  } else {
    // Print to stdout
    console.log('\n' + chalk.bold('📊 Generated Flowchart'));
    console.log(chalk.dim('─'.repeat(50)));
    console.log('\n' + mermaid);
    console.log('\n' + chalk.dim('Copy the above output into a ```mermaid code block in GitHub Markdown.') + '\n');
  }

  // Summary
  console.log(chalk.dim(`📦 ${result.nodes.length} nodes, ${result.edges.length} edges`));
});

program.parse(process.argv);
