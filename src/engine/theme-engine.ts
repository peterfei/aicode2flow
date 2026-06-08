/**
 * 主题引擎
 *
 * 元编程设计：
 * - 纯函数：输入→输出，无副作用
 * - 代码生成代码：配置→Mermaid指令
 * - 数据驱动：样式规则自动映射
 */

import type { AnalyzedNode } from '../types.js';
import type { ThemeConfig } from '../types.js';

/**
 * 应用主题到 Mermaid 图表
 *
 * 核心算法：
 * 1. 解析原始 Mermaid，识别节点和边
 * 2. 应用样式规则（数据驱动映射）
 * 3. 注入主题指令
 *
 * @param mermaid - 原始 Mermaid 代码
 * @param theme - 主题配置
 * @returns 增强后的 Mermaid 代码
 */
export function applyThemeToMermaid(
  mermaid: string,
  theme: ThemeConfig
): string {
  const lines = mermaid.split('\n');
  const output: string[] = [];

  // 注入全局指令（在开头）
  if (theme.directives) {
    for (const directive of theme.directives) {
      output.push(`%%${directive}`);
    }
  }

  // 解析节点信息
  const nodeInfo = parseNodeInfo(lines);

  // 处理每一行
  const processedNodes = new Set<string>();

  for (const line of lines) {
    output.push(line);

    // 为节点应用样式
    for (const info of nodeInfo) {
      if (line.includes(info.id) && !processedNodes.has(info.id)) {
        const style = theme.styles?.[info.type];
        if (style) {
          output.push(`  style ${info.id} ${style}`);
          processedNodes.add(info.id);
        }
      }
    }
  }

  // 应用边的样式
  if (theme.links?.default) {
    output.push(`  linkStyle default ${theme.links.default}`);
  }

  return output.join('\n');
}

/**
 * 从分析结果直接生成带主题的流程图
 *
 * 元编程：跳过中间Mermaid字符串，直接生成带样式的代码
 *
 * @param nodes - 分析的节点
 * @param edges - 边
 * @param direction - 方向
 * @param theme - 主题配置（可选）
 * @returns Mermaid 代码
 */
export function generateStyledFlowchart(
  nodes: AnalyzedNode[],
  edges: { from: string; to: string }[],
  direction: string = 'TD',
  theme?: ThemeConfig
): string {
  const lines: string[] = [];

  // 注入主题指令
  if (theme?.directives) {
    for (const directive of theme.directives) {
      lines.push(`%%${directive}`);
    }
  }

  lines.push(`flowchart ${direction}`);
  lines.push('');

  // 渲染节点
  for (const n of nodes) {
    const shape = getShapeSyntax(n.shape);
    const entryMarker = theme?.entryMarker ?? '';
    const label = n.isEntry && entryMarker ? `${entryMarker} ${n.name}` : n.name;

    // 对于stadium形状，使用标准格式：nodeID([label])
    if (n.shape === 'stadium') {
      lines.push(`  ${n.id}([${n.name}])`);
    } else {
      lines.push(`  ${n.id}${shape.open}"${label}"${shape.close}`);
    }

    // 应用节点样式
    if (theme?.styles) {
      const nodeType = inferNodeType(n);
      const style = theme.styles[nodeType];
      if (style) {
        lines.push(`  style ${n.id} ${style}`);
      }
    }
  }

  // 渲染边
  if (edges.length > 0) {
    lines.push('');
    for (const e of edges) {
      lines.push(`  ${e.from} --> ${e.to}`);
    }
  }

  // 应用边样式
  if (theme?.links?.default) {
    lines.push(`  linkStyle default ${theme.links.default}`);
  }

  return lines.join('\n');
}

/**
 * 解析节点信息
 *
 * 元编程：从Mermaid代码中提取节点ID和类型
 */
function parseNodeInfo(lines: string[]): NodeInfo[] {
  const info: NodeInfo[] = [];

  // 匹配节点行：  nodeID["label"] 或  nodeID(["label"]) 等
  const nodePattern =
    /^\s*([a-zA-Z0-9_]+)(?:\[|(?:\[\[)|(?:\()|(?:\[\()|(?:\{\{)(?:"[^"]*"|[^"]*)/;

  for (const line of lines) {
    const match = line.match(nodePattern);
    if (match) {
      const id = match[1];
      const type = inferTypeFromSyntax(line);
      info.push({ id, type });
    }
  }

  return info;
}

/**
 * 从语法推断节点类型
 */
function inferTypeFromSyntax(line: string): NodeType {
  if (line.includes('(["')) return 'entry'; // stadium
  if (line.includes('{') && line.includes('}')) return 'condition'; // diamond
  if (line.includes('{{')) return 'loop'; // hex
  if (line.includes('[[')) return 'class'; // double rect
  return 'function'; // default
}

/**
 * 从分析节点推断类型
 */
function inferNodeType(node: AnalyzedNode): NodeType {
  if (node.isEntry) return 'entry';
  if (node.shape === 'diamond') return 'condition';
  if (node.shape === 'hex') return 'loop';
  if (node.shape === 'stadium') return 'entry';
  if (node.shape === 'round') return 'function';
  return 'function';
}

/**
 * 获取形状语法
 */
function getShapeSyntax(shape: string): ShapeSyntax {
  const shapeMap: Record<string, ShapeSyntax> = {
    round: { open: '(', close: ')' },
    diamond: { open: '{', close: '}' },
    hex: { open: '{{', close: '}}' },
    stadium: { open: '[(', close: ')]' },
    rect: { open: '[', close: ']' },
  };
  return shapeMap[shape] || shapeMap.round;
}

/**
 * 验证主题配置
 */
export function validateTheme(theme: ThemeConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!theme.name) {
    errors.push('Theme must have a name');
  }

  if (theme.styles) {
    for (const [type, style] of Object.entries(theme.styles)) {
      if (!isValidStyleRule(style)) {
        errors.push(`Invalid style rule for '${type}': ${style}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * 验证样式规则语法
 */
function isValidStyleRule(rule: string): boolean {
  const validProperties = [
    'fill:',
    'stroke:',
    'stroke-width:',
    'stroke-dasharray:',
    'color:',
    'opacity:',
    'font-family:',
    'font-size:',
  ];

  const hasValidProperty = validProperties.some((prop) => rule.includes(prop));
  const hasInvalidChars = /[<>]/.test(rule);

  return hasValidProperty && !hasInvalidChars;
}

/**
 * 创建默认主题
 */
export function createDefaultTheme(): ThemeConfig {
  return {
    name: 'default',
    meta: {
      description: '默认主题',
      version: '1.0.0',
    },
    styles: {
      function: 'fill:#4a90e2,stroke:#357abd,stroke-width:2px,color:#fff',
      method: 'fill:#50e3c2,stroke:#3db8a0,stroke-width:2px,color:#fff',
      condition: 'fill:#f5a623,stroke:#d4881c,stroke-width:2px,color:#fff',
      loop: 'fill:#7ed321,stroke:#66a91a,stroke-width:2px,color:#fff',
      entry: 'fill:#bd10e0,stroke:#9010a8,stroke-width:4px,color:#fff',
      class: 'fill:#6c5ce7,stroke:#5541c5,stroke-width:2px,color:#fff',
    },
    links: {
      default: 'stroke:#9b9b9b,stroke-width:2px,color:#666666',
    },
    entryMarker: '', // 默认不使用入口点标记
  };
}

// 类型定义
type NodeType = 'function' | 'method' | 'condition' | 'loop' | 'entry' | 'class';

interface NodeInfo {
  id: string;
  type: NodeType;
}

interface ShapeSyntax {
  open: string;
  close: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
