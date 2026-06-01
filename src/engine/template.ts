import type { AnalyzedNode, NodeShape } from '../types.js';

const SHAPE_MAP: Record<NodeShape, [string, string]> = {
  round: ['(', ')'],
  diamond: ['{', '}'],
  hex: ['{{', '}}'],
  stadium: ['([', '])'],
};

export function generateFlowchart(
  nodes: AnalyzedNode[],
  edges: { from: string; to: string }[],
  direction: string = 'TD'
): string {
  const lines: string[] = [];
  lines.push(`flowchart ${direction}`);
  lines.push('');

  // Render nodes
  for (const n of nodes) {
    const [open, close] = SHAPE_MAP[n.shape] ?? SHAPE_MAP.round;
    const label = n.isEntry ? `⭐ ${n.name}` : n.name;
    lines.push(`  ${n.id}${open}"${label}"${close}`);
  }

  if (edges.length > 0) {
    lines.push('');
    // Render edges
    for (const e of edges) {
      lines.push(`  ${e.from} --> ${e.to}`);
    }
  }

  return lines.join('\n');
}
