# aicode2flow 主题系统使用指南

## 目录

- [快速开始](#快速开始)
- [使用主题](#使用主题)
- [创建自定义主题](#创建自定义主题)
- [主题继承](#主题继承)
- [样式参考](#样式参考)
- [最佳实践](#最佳实践)
- [预设主题库](#预设主题库)

---

## 快速开始

### 安装

```bash
# 全局安装
npm install -g aicode2flow

# 或使用 npx（零安装）
npx aicode2flow
```

### 基础用法

```bash
# 使用默认主题
aicode2flow src/main.go -o flowchart.md

# 指定主题
aicode2flow src/main.go -o flowchart.md --theme github-dark

# 列出所有可用主题
aicode2flow --list-themes
```

---

## 使用主题

### 主题参数

```bash
# 完整参数
aicode2flow <input> -o <output> --theme <theme-name>

# 示例
aicode2flow src/app.py -o flow.md --theme dracula
aicode2flow src/main.ts -o flow.svg --theme nord
```

### 可用主题

| 主题名 | 描述 | 适用场景 |
|--------|------|----------|
| `github-dark` | GitHub Dark配色 | 深色文档、技术博客 |
| `github-light` | GitHub Light配色 | 浅色文档、打印 |
| `github-dim` | 半透明Dark | 背景复杂的环境 |
| `dracula` | Dracula配色 | 流行配色方案 |
| `monokai` | Monokai配色 | 经典编辑器风格 |
| `nord` | 北极蓝调 | 清新冷淡风格 |
| `vscode-dark` | VS Code Dark+ | 开发者习惯 |
| `pastel` | 柔和粉彩 | 轻松文档 |
| `high-contrast` | 高对比度 | 无障碍访问 |
| `print-friendly` | 打印友好 | 黑白打印 |

---

## 创建自定义主题

### 方法1: 复制模板

```bash
# 复制模板文件
cp config/themes/theme-template.json config/themes/my-theme.json

# 编辑主题
vim config/themes/my-theme.json
```

### 方法2: 从零创建

创建 `config/themes/my-theme.json`:

```json
{
  "name": "my-theme",
  "meta": {
    "description": "我的自定义主题",
    "author": "Your Name",
    "version": "1.0.0"
  },
  "styles": {
    "function": "fill:#4a90e2,stroke:#357abd,stroke-width:2px,color:#fff",
    "method": "fill:#50e3c2,stroke:#3db8a0,stroke-width:2px,color:#fff",
    "condition": "fill:#f5a623,stroke:#d4881c,stroke-width:2px,color:#fff",
    "loop": "fill:#7ed321,stroke:#66a91a,stroke-width:2px,color:#fff",
    "entry": "fill:#bd10e0,stroke:#9010a8,stroke-width:4px,color:#fff"
  },
  "links": {
    "default": "stroke:#9b9b9b,stroke-width:2px,color:#666666"
  }
}
```

### 使用自定义主题

```bash
# 将主题文件放到项目目录
aicode2flow src/main.go -o flow.md --theme ./my-theme.json

# 或安装到全局主题目录
mkdir -p ~/.aicode2flow/themes
cp my-theme.json ~/.aicode2flow/themes/
aicode2flow src/main.go -o flow.md --theme my-theme
```

---

## 主题继承

### 继承语法

```json
{
  "name": "my-theme",
  "extends": "github-dark",

  "styles": {
    "function": "fill:#569cd6,stroke:#4a8acb,color:#fff,opacity:0.7"
  }
}
```

### 继承规则

1. **自动合并**: 子主题会覆盖父主题的同名属性
2. **部分覆盖**: 只需指定要修改的属性
3. **多级继承**: 支持继承链（A extends B, B extends C）

### 示例

```json
// 父主题: github-dark.json
{
  "name": "github-dark",
  "styles": {
    "function": "fill:#569cd6,stroke:#4a8acb,color:#fff",
    "condition": "fill:#dcdcaa,stroke:#c4c295,color:#1e1e1e"
  }
}

// 子主题: github-dim.json
{
  "name": "github-dim",
  "extends": "github-dark",
  "styles": {
    // 只修改 function 样式，condition 继承父主题
    "function": "fill:#569cd6,stroke:#4a8acb,color:#fff,opacity:0.7"
  }
}
```

---

## 样式参考

### 节点类型

aicode2flow 支持以下节点类型：

| 类型 | 说明 | 默认形状 |
|------|------|----------|
| `function` | 函数 | 圆角矩形 |
| `method` | 方法 | 圆角矩形 |
| `condition` | 条件判断 | 菱形 |
| `loop` | 循环 | 六边形 |
| `entry` | 入口点 | 体育场形 |
| `class` | 类/接口 | 矩形 |

### Mermaid 样式语法

#### 基础样式

```css
style nodeId fill:#颜色,stroke:#颜色,stroke-width:宽度,color:文字颜色
```

#### 可用属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `fill` | 填充颜色 | `fill:#4a90e2` |
| `stroke` | 边框颜色 | `stroke:#357abd` |
| `stroke-width` | 边框宽度 | `stroke-width:2px` |
| `stroke-dasharray` | 虚线样式 | `stroke-dasharray:5 5` |
| `color` | 文字颜色 | `color:#ffffff` |
| `opacity` | 透明度 | `opacity:0.7` |
| `font-family` | 字体 | `font-family:Arial` |
| `font-size` | 字号 | `font-size:16px` |

#### 颜色格式

```json
// 十六进制（推荐）
"fill:#4a90e2"

// RGB
"fill:rgb(74, 144, 226)"

// RGBA（带透明度）
"fill:rgba(74, 144, 226, 0.7)"

// 颜色名称
"fill:blue"
```

### 边样式

```json
{
  "links": {
    "default": "stroke:#颜色,stroke-width:宽度,color:文字颜色",
    "call": "stroke:#颜色,stroke-width:宽度",
    "return": "stroke:#颜色,stroke-dasharray:5 5"
  }
}
```

### 全局指令

```json
{
  "directives": [
    "init: {'theme':'dark'}",
    "linkStyle default stroke:#808080"
  ]
}
```

---

## 最佳实践

### 配色建议

#### 对比度

确保足够的颜色对比度（WCAG AA 标准：4.5:1）

```json
// ✅ 好：高对比度
{
  "styles": {
    "function": "fill:#4a90e2,stroke:#357abd,color:#fff"
  }
}

// ❌ 差：低对比度
{
  "styles": {
    "function": "fill:#e0e0e0,stroke:#d0d0d0,color:#f0f0f0"
  }
}
```

#### 色彩和谐

使用配色工具确保颜色和谐：

- [Coolors](https://coolors.co/) - 配色方案生成
- [Adobe Color](https://color.adobe.com/) - 专业配色
- [Nippon Colors](https://nipponcolors.com/) - 日本传统色

### 性能优化

```json
// ✅ 好：简单样式
"function": "fill:#4a90e2,stroke:#357abd,color:#fff"

// ❌ 差：过度复杂
"function": "fill:linear-gradient(135deg, #4a90e2 0%, #357abd 100%),stroke:#357abd,filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
```

### 可访问性

#### 提供高对比度版本

```json
// high-contrast.json
{
  "styles": {
    "function": "fill:#000000,stroke:#ffffff,color:#ffff00"
  }
}
```

#### 色盲友好

避免仅依赖颜色区分：

```json
// ✅ 好：颜色 + 形状区分
{
  "styles": {
    "condition": "fill:#f5a623,stroke:#d4881c,stroke-width:3px"
  }
}
```

### 主题命名

```json
// ✅ 好：描述性命名
"name": "github-dark-compact"

// ❌ 差：模糊命名
"name": "theme1"
```

---

## 预设主题库

### GitHub 系列

#### github-dark
```bash
aicode2flow src.go -o flow.md --theme github-dark
```

#### github-light
```bash
aicode2flow src.go -o flow.md --theme github-light
```

#### github-dim（继承示例）
```bash
aicode2flow src.go -o flow.md --theme github-dim
```

### 流行配色

#### dracula
```bash
aicode2flow src.go -o flow.md --theme dracula
```

#### monokai
```bash
aicode2flow src.go -o flow.md --theme monokai
```

#### nord
```bash
aicode2flow src.go -o flow.md --theme nord
```

### 编辑器主题

#### vscode-dark
```bash
aicode2flow src.go -o flow.md --theme vscode-dark
```

### 特殊用途

#### high-contrast（无障碍）
```bash
aicode2flow src.go -o flow.md --theme high-contrast
```

#### print-friendly（打印）
```bash
aicode2flow src.go -o flow.md --theme print-friendly
```

---

## 高级功能

### 复杂度可视化（计划中）

基于代码复杂度自动标注：

```json
{
  "name": "complexity-aware",
  "complexityStyles": {
    "low": "opacity:0.9",
    "medium": "fill:#f5a623",
    "high": "fill:#ff5555,stroke:#ffb86c"
  }
}
```

### 自动分组（计划中）

按包/模块自动分组：

```json
{
  "name": "grouped",
  "groupBy": "package",
  "groupStyles": {
    "subgraph": "fill:#f6f8fa,stroke:#e1e4e8,stroke-dasharray:5 5"
  }
}
```

---

## 故障排除

### 主题未生效

```bash
# 检查主题文件是否存在
aicode2flow --list-themes

# 验证JSON语法
cat my-theme.json | jq .

# 测试主题
aicode2flow test.go -o test.md --theme my-theme
```

### 颜色显示错误

```bash
# 确保输出格式支持样式
aicode2flow src.go -o flow.md --theme github-dark  # ✅ Markdown
aicode2flow src.go -o flow.svg --theme github-dark  # ✅ SVG
aicode2flow src.go -o flow.mmd --theme github-dark  # ✅ Mermaid
```

### Mermaid 渲染问题

访问 [Mermaid Live Editor](https://mermaid.live) 验证生成的语法：

```bash
# 查看生成的 Mermaid 代码
aicode2flow src.go -o flow.md --theme github-dark
cat flow.md
```

---

## 贡献主题

### 提交主题

1. Fork 项目仓库
2. 在 `config/themes/` 创建主题文件
3. 添加主题文档和预览
4. 提交 Pull Request

### 主题检查清单

- [ ] JSON 语法正确
- [ ] 通过 `jq` 验证
- [ ] 提供预览示例
- [ ] 确保无障碍访问
- [ ] 添加文档说明

---

## 参考资源

- [Mermaid 官方文档](https://mermaid.js.org/)
- [Mermaid 样式语法](https://mermaid.js.org/syntax/flowchart.html#styling)
- [WCAG 对比度指南](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [色彩无障碍检查](https://webaim.org/resources/contrastchecker/)

---

## 更新日志

### v1.0.0 (2025-01-08)

- ✅ 初始主题系统
- ✅ 10个预设主题
- ✅ 主题继承支持
- ✅ 零依赖实现
