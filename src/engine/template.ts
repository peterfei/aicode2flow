import type { AnalyzedNode, NodeShape, ThemeConfig } from '../types.js';
import { generateStyledFlowchart } from './theme-engine.js';

const SHAPE_MAP: Record<NodeShape, [string, string]> = {
  round: ['(', ')'],
  diamond: ['{', '}'],
  hex: ['{{', '}}'],
  stadium: ['[(', ')]'],  // Special handling in theme-engine for stadium shape
};

/**
 * 生成流程图（保持向后兼容）
 *
 * @param nodes - 分析的节点
 * @param edges - 边
 * @param direction - 方向
 * @returns Mermaid 代码
 */
export function generateFlowchart(
  nodes: AnalyzedNode[],
  edges: { from: string; to: string }[],
  direction: string = 'TD'
): string {
  return generateStyledFlowchart(nodes, edges, direction);
}

/**
 * 生成带主题的流程图
 *
 * @param nodes - 分析的节点
 * @param edges - 边
 * @param direction - 方向
 * @param theme - 主题配置（可选）
 * @returns Mermaid 代码
 */
export function generateThemedFlowchart(
  nodes: AnalyzedNode[],
  edges: { from: string; to: string }[],
  direction: string = 'TD',
  theme?: ThemeConfig
): string {
  return generateStyledFlowchart(nodes, edges, direction, theme);
}
