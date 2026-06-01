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
