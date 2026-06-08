export type LanguageName = 'go' | 'python' | 'javascript' | 'typescript' | 'rust' | 'java' | 'c' | 'cpp';

export interface LanguageConfig {
  name: string;
  extensions: string[];
  grammar: string;
  entryPoints: EntryPointDef[];
  nodeTypes: Record<string, NodeTypeDef>;
}

export interface EntryPointDef {
  pattern: string;
  match: 'full' | 'contains';
}

export interface NodeTypeDef {
  query: string;
  shape: NodeShape;
}

export type NodeShape = 'round' | 'diamond' | 'hex' | 'stadium';

export interface AnalyzedNode {
  id: string;
  name: string;
  type: string;
  shape: NodeShape;
  startLine: number;
  isEntry: boolean;
  calls: string[];
  subNodes?: AnalyzedNode[];
}

export interface AnalysisResult {
  nodes: AnalyzedNode[];
  edges: { from: string; to: string }[];
  errors: string[];
}

/**
 * 主题配置
 *
 * 元编程设计：
 * - 纯声明式配置
 * - 支持继承
 * - 数据驱动样式
 */
export interface ThemeConfig {
  /** 主题名称（必需） */
  name: string;

  /** 继承的父主题名称 */
  extends?: string;

  /** 主题元数据 */
  meta?: ThemeMeta;

  /** 节点样式映射（节点类型 → Mermaid样式规则） */
  styles?: Record<NodeType, StyleRule>;

  /** 自定义类样式 */
  classes?: Record<string, StyleRule>;

  /** 边样式映射 */
  links?: Record<string, StyleRule>;

  /** Mermaid 全局指令 */
  directives?: string[];

  /** 主题变量 */
  variables?: Record<string, string>;

  /** 入口点标记（可选，默认为空字符串） */
  entryMarker?: string;
}

/**
 * 解析后的主题（继承已解析）
 */
export interface ResolvedTheme extends ThemeConfig {
  extends?: never; // 继承已解析
}

/**
 * 主题元数据
 */
export interface ThemeMeta {
  description?: string;
  author?: string;
  version?: string;
  url?: string;
  accessibility?: string;
}

/**
 * 节点类型
 */
export type NodeType = 'function' | 'method' | 'condition' | 'loop' | 'entry' | 'class';

/**
 * Mermaid 样式规则（纯字符串）
 *
 * 语法：fill:#color,stroke:#color,color:#text,...
 * 详见：https://mermaid.js.org/syntax/flowchart.html#styling
 */
export type StyleRule = string;
