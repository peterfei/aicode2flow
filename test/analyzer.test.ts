import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { Registry } from '../src/engine/registry.js';
import { Analyzer } from '../src/engine/analyzer.js';
import { generateFlowchart } from '../src/engine/template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(__dirname, 'fixtures');

function loadFixture(name: string): string | null {
  const p = join(FIXTURES, name);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf-8');
}

describe('Registry', () => {
  const registry = new Registry();

  it('should detect Go files', () => {
    const cfg = registry.detect('main.go');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('go');
  });

  it('should detect Python files', () => {
    const cfg = registry.detect('app.py');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('python');
  });

  it('should detect JavaScript files', () => {
    const cfg = registry.detect('index.js');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('javascript');
  });

  it('should return supported languages', () => {
    const langs = registry.languages();
    expect(langs).toContain('go');
    expect(langs).toContain('python');
    expect(langs).toContain('javascript');
  });

  it('should detect TypeScript files', () => {
    const cfg = registry.detect('app.ts');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('typescript');
  });

  it('should detect Rust files', () => {
    const cfg = registry.detect('main.rs');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('rust');
  });

  it('should detect Java files', () => {
    const cfg = registry.detect('App.java');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('java');
  });

  it('should detect C files', () => {
    const cfg = registry.detect('main.c');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('c');
  });

  it('should detect C++ files', () => {
    const cfg = registry.detect('main.cpp');
    expect(cfg).toBeDefined();
    expect(cfg!.name).toBe('cpp');
  });

  it('should return undefined for unknown extensions', () => {
    expect(registry.detect('file.rb')).toBeUndefined();
  });

  it('should return all 8 supported languages', () => {
    const langs = registry.languages();
    expect(langs).toContain('go');
    expect(langs).toContain('python');
    expect(langs).toContain('javascript');
    expect(langs).toContain('typescript');
    expect(langs).toContain('rust');
    expect(langs).toContain('java');
    expect(langs).toContain('c');
    expect(langs).toContain('cpp');
  });
});

describe('Analyzer', () => {
  const registry = new Registry();

  it('should analyze Go source file', () => {
    const source = loadFixture('sample.go');
    if (!source) return; // skip if fixture not found
    const config = registry.detect('sample.go')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
    expect(result.nodes.some(n => n.name === 'greet')).toBe(true);
    expect(result.nodes.some(n => n.name === 'processUser')).toBe(true);
  });

  it('should analyze Python source file', () => {
    const source = loadFixture('sample.py');
    if (!source) return;
    const config = registry.detect('sample.py')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
    expect(result.nodes.some(n => n.name === 'greet')).toBe(true);
  });

  it('should analyze JavaScript source file', () => {
    const source = loadFixture('sample.js');
    if (!source) return;
    const config = registry.detect('sample.js')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
    expect(result.nodes.some(n => n.name === 'greet')).toBe(true);
  });

  it('should analyze TypeScript source file', () => {
    const source = loadFixture('sample.ts');
    if (!source) return;
    const config = registry.detect('sample.ts')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
    expect(result.nodes.some(n => n.name === 'greet')).toBe(true);
  });

  it('should analyze Rust source file', () => {
    const source = loadFixture('sample.rs');
    if (!source) return;
    const config = registry.detect('sample.rs')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
    expect(result.nodes.some(n => n.name === 'greet')).toBe(true);
  });

  it('should analyze Java source file', () => {
    const source = loadFixture('sample.java');
    if (!source) return;
    const config = registry.detect('sample.java')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
  });

  it('should analyze C source file', () => {
    const source = loadFixture('sample.c');
    if (!source) return;
    const config = registry.detect('sample.c')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
  });

  it('should analyze C++ source file', () => {
    const source = loadFixture('sample.cpp');
    if (!source) return;
    const config = registry.detect('sample.cpp')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.errors).toHaveLength(0);
    expect(result.nodes.length).toBeGreaterThanOrEqual(4);
    expect(result.nodes.some(n => n.name === 'main')).toBe(true);
  });

  it('should detect entry points', () => {
    const source = loadFixture('sample.go');
    if (!source) return;
    const config = registry.detect('sample.go')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    const entry = result.nodes.find(n => n.isEntry);
    expect(entry).toBeDefined();
    expect(entry!.name).toBe('main');
  });

  it('should generate call edges', () => {
    const source = loadFixture('sample.go');
    if (!source) return;
    const config = registry.detect('sample.go')!;
    const analyzer = new Analyzer(config);
    const result = analyzer.analyze(source);

    expect(result.edges.length).toBeGreaterThan(0);
    // main should call processUser
    const mainEdges = result.edges.filter(e => e.from === 'main');
    expect(mainEdges.length).toBeGreaterThan(0);
  });
});

describe('Mermaid Generator', () => {
  it('should generate valid Mermaid for empty nodes', () => {
    const output = generateFlowchart([], []);
    expect(output).toContain('flowchart TD');
  });

  it('should generate Mermaid with entry point', () => {
    const nodes = [
      { id: 'main', name: 'main', type: 'function', shape: 'stadium' as const, startLine: 1, isEntry: true, calls: ['greet'] },
      { id: 'greet', name: 'greet', type: 'function', shape: 'round' as const, startLine: 2, isEntry: false, calls: [] },
    ];
    const edges = [{ from: 'main', to: 'greet' }];
    const output = generateFlowchart(nodes, edges);

    expect(output).toContain('flowchart TD');
    expect(output).toContain('main');
    expect(output).toContain('greet');
    expect(output).toContain('main --> greet');
  });

  it('should render LR direction', () => {
    const output = generateFlowchart([], [], 'LR');
    expect(output).toContain('flowchart LR');
  });
});
