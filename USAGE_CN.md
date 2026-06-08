# aicode2flow 使用手册

> 代码一键生成 Mermaid 流程图 —— 零安装、多语言、全项目扫描。

---

## 目录

1. [安装](#安装)
2. [基本用法](#基本用法)
3. [输出格式](#输出格式)
4. [语言支持](#语言支持)
5. [排除与过滤](#排除与过滤)
6. [GitHub Action 集成](#github-action-集成)
7. [扩展新语言](#扩展新语言)
8. [常见问题](#常见问题)

---

## 安装

aicode2flow 设计为**零安装**使用，只需 `npx`：

```bash
npx aicode2flow ./file.go
```

如果你希望全局安装：

```bash
npm install -g aicode2flow
aicode2flow ./file.go
```

> **提示：** 全局安装后可省略 `npx`，直接使用 `aicode2flow` 命令。

### 可选依赖

SVG/PNG 渲染需要安装 `@mermaid-js/mermaid-cli`（自动处理 Puppeteer）：

```bash
npm install -g @mermaid-js/mermaid-cli
```

或与项目一起安装：

```bash
npm install @mermaid-js/mermaid-cli --save-optional
```

---

## 基本用法

### 单个文件

```bash
# 输出 Mermaid 到终端
npx aicode2flow ./src/main.go

# 保存到文件
npx aicode2flow ./app.py -o flowchart.mmd

# 保存为 Markdown（带 ```mermaid 代码块，GitHub 直接渲染）
npx aicode2flow ./index.js -o FLOWCHART.md
```

### 扫描整个项目

```bash
# 递归扫描目录，自动识别所有支持的文件
npx aicode2flow ./src/

# 扫描整个项目
npx aicode2flow ./

# 指定输出文件
npx aicode2flow ./ -o project-flowchart.md
```

项目扫描会自动跳过以下目录：`node_modules`、`.git`、`dist`、`build`、`target`、`__pycache__` 等。

### 输出示意图

```
flowchart TD
  main((["main"]))
  greet("greet")
  validate("validate")
  processUser("processUser")
  saveUser("saveUser")
  processUser --> greet
  processUser --> validate
  processUser --> saveUser
  main --> processUser
```

---

## 输出格式

### 文本模式（默认）

输出 Mermaid 流程图文本，粘贴到 GitHub Markdown 的 ` ```mermaid ` 块中即可渲染。

| 扩展名 | 文件类型 | 内容 |
|--------|----------|------|
| `.mmd` | Mermaid 纯文本 | 仅有 `flowchart ...` 定义 |
| `.md`  | Markdown | 包含 ` ```mermaid ` 包裹的完整代码块 |

### SVG / PNG 模式

需要安装 `@mermaid-js/mermaid-cli`。支持两种方式指定格式：

**方式一：文件扩展名自动识别**

```bash
npx aicode2flow ./main.go -o diagram.svg
npx aicode2flow ./app.py -o diagram.png
```

**方式二：`--format` 显式指定**

```bash
npx aicode2flow ./main.go --format svg -o output.svg
npx aicode2flow ./app.py --format png -o output.png
```

### 布局方向

```bash
# 从上到下（默认）
npx aicode2flow ./main.go --direction TD

# 从左到右
npx aicode2flow ./main.go --direction LR
```

### 完整参数列表

| 参数 | 别名 | 说明 | 默认值 |
|------|------|------|--------|
| `--output` | `-o` | 输出文件路径 | 终端输出 |
| `--format` | `-f` | 输出格式: mermaid / svg / png | mermaid |
| `--direction` | | 流程图方向: TD / LR | TD |
| `--language` | `-l` | 强制指定语言 | 自动检测 |
| `--exclude` | `-e` | 排除模式（正则） | — |
| `--theme` | | Mermaid 主题 | default |
| `--ai` | | AI 语义增强（需要 API Key） | false |
| `--version` | `-v` | 显示版本 | |
| `--help` | `-h` | 显示帮助 | |

---

## 语言支持

### 已支持的语言（8 种）

| 语言 | 扩展名 | 入口点 |
|------|--------|--------|
| Go | `.go` | `main` |
| Python | `.py` | `main` / `if __name__` |
| JavaScript | `.js` `.jsx` `.mjs` `.cjs` | `main` |
| TypeScript | `.ts` | `main` |
| Rust | `.rs` | `main` |
| Java | `.java` | `main` |
| C | `.c` `.h` | `main` |
| C++ | `.cpp` `.cxx` `.cc` `.hpp` `.hxx` | `main` |

### 指定语言分析

```bash
# 扫描项目，只分析 Python 文件
npx aicode2flow ./ --language python

# 强制将 .txt 文件当作 Go 分析
npx aicode2flow ./app.txt -l go
```

---

## 排除与过滤

### 默认排除

扫描目录时，以下目录会被自动跳过：

- `node_modules`
- `.git`, `.svn`, `.hg`
- `dist`, `build`, `target`
- `__pycache__`, `.venv`
- 所有 `.` 开头的隐藏目录

### `--exclude` 排除模式

使用正则表达式排除特定文件：

```bash
# 排除测试文件
npx aicode2flow ./ --exclude "_test|_spec"

# 排除生成的文件
npx aicode2flow ./ --exclude "generated|pb\."

# 排除 vendor 目录
npx aicode2flow ./ --exclude "vendor/"
```

---

## GitHub Action 集成

aicode2flow 提供 GitHub Action，在 Pull Request 时自动生成流程图并评论。

### 使用方式

在你的仓库 `.github/workflows/` 下创建 workflow 文件：

```yaml
name: Generate Flowchart
on:
  pull_request:
    paths:
      - 'src/**/*.go'
      - 'src/**/*.py'
      - 'src/**/*.js'
jobs:
  flowchart:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate flowchart
        uses: peterfei/aicode2flow/.github/actions/aicode2flow@main
        with:
          path: './src/'
          direction: 'TD'
```

### Action 参数

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `path` | 源码文件或目录路径 | 是 | — |
| `direction` | 流程图方向 (TD/LR) | 否 | TD |
| `github-token` | GitHub Token（用于 PR 评论） | 否 | `${{ github.token }}` |

---

## 扩展新语言

> 添加新语言只需 **两个文件**，零 TypeScript 代码修改。

### 步骤

1. **创建语言配置** `config/languages/<name>.json`

```json
{
  "name": "ruby",
  "extensions": [".rb"],
  "grammar": "tree-sitter-ruby",
  "entryPoints": [{ "pattern": "main", "match": "full" }],
  "nodeTypes": {
    "function": { "query": "method", "shape": "round" },
    "condition": { "query": "condition", "shape": "diamond" }
  }
}
```

2. **创建 Tree-sitter 查询** `queries/<name>.scm`

```scm
; method definitions
(method
  name: (identifier) @name
  body: (body_statement) @body) @function

; method calls
(call
  method: (identifier) @callee) @call
```

3. **安装语法解析器**

```bash
npm install tree-sitter-ruby
```

完成！无需修改任何 TypeScript 源代码。

### 关于 Tree-sitter 语法

每个语言配置中的 `"grammar"` 字段对应 npm 包名，例如 `"tree-sitter-go"` 对应 `npm install tree-sitter-go`。SCM 查询文件的捕获标签支持：

| 捕获名 | 作用 | 必填 |
|--------|------|------|
| `@name` | 函数/方法名 | 是 |
| `@function` | 函数定义（标签名自定，需在 nodeTypes 中匹配） | 是 |
| `@body` | 函数体 | 否 |
| `@call` | 函数调用 | 否 |
| `@callee` | 被调用函数名 | 否 |
| `@cond` | 条件表达式 | 否 |

---

## 常见问题

### Q: 流程图太复杂怎么办？

目前支持 `--direction LR` 从左到右布局以缓解复杂图的宽度问题。后续版本会加入按模块分组、深度控制等功能。

### Q: 如何只显示入口函数到特定函数的调用链？

当前版本暂不支持调用链裁剪。可先用 `--exclude` 排除不需要的文件，或通过 `--language` 限定语言范围。

### Q: 为什么有的函数调用没有连线？

只有被调函数在当前分析范围内（同一文件/目录）才会连线。调用外部库的函数不会出现在图中。

### Q: 支持 Node.js 版本？

Node.js >= 18。

### Q: SVG/PNG 渲染失败？

确保已安装 `@mermaid-js/mermaid-cli`：

```bash
npm install -g @mermaid-js/mermaid-cli
```

首次运行会自动下载 Chromium。如果网络环境受限，可设置 `PUPPETEER_SKIP_DOWNLOAD` 或配置 Puppeteer 使用已有 Chrome。

---

> 更多信息请访问 [GitHub 仓库](https://github.com/peterfei/aicode2flow)
