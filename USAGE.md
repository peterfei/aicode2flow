# aicode2flow Usage Guide

> Zero-install code to Mermaid flowchart — scan single files or entire projects across 8 languages.

---

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Output Formats](#output-formats)
4. [Language Support](#language-support)
5. [Exclude & Filter](#exclude--filter)
6. [GitHub Action Integration](#github-action-integration)
7. [Extending Languages](#extending-languages)
8. [FAQ](#faq)

---

## Installation

aicode2flow is designed for **zero-install** usage via `npx`:

```bash
npx aicode2flow ./file.go
```

For global installation:

```bash
npm install -g aicode2flow
aicode2flow ./file.go
```

> **Tip:** After global install, use `aicode2flow` directly without `npx`.

### Optional Dependency

SVG/PNG rendering requires `@mermaid-js/mermaid-cli`:

```bash
npm install -g @mermaid-js/mermaid-cli
```

Or add to your project:

```bash
npm install @mermaid-js/mermaid-cli --save-optional
```

---

## Basic Usage

### Single File

```bash
# Output Mermaid to stdout
npx aicode2flow ./src/main.go

# Save to file
npx aicode2flow ./app.py -o flowchart.mmd

# Save as Markdown (with ```mermaid block, renders directly on GitHub)
npx aicode2flow ./index.js -o FLOWCHART.md
```

### Scan Entire Project

```bash
# Recursively scan a directory
npx aicode2flow ./src/

# Scan root of a project
npx aicode2flow ./

# Output to file
npx aicode2flow ./ -o project-flowchart.md
```

Directory scanning automatically skips: `node_modules`, `.git`, `dist`, `build`, `target`, `__pycache__`, and hidden directories.

### Example Output

```
flowchart TD
  main(["⭐ main"])
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

## Output Formats

### Text Mode (default)

Outputs Mermaid text. Paste inside a ` ```mermaid ` block in GitHub Markdown to render.

| Extension | File Type | Content |
|-----------|-----------|---------|
| `.mmd` | Mermaid text | Raw `flowchart ...` definition |
| `.md` | Markdown | Wrapped in ` ```mermaid ` block |

### SVG / PNG Mode

Requires `@mermaid-js/mermaid-cli`. Two ways to specify format:

**Method 1: File extension auto-detection**

```bash
npx aicode2flow ./main.go -o diagram.svg
npx aicode2flow ./app.py -o diagram.png
```

**Method 2: Explicit `--format` flag**

```bash
npx aicode2flow ./main.go --format svg -o output.svg
npx aicode2flow ./app.py --format png -o output.png
```

### Layout Direction

```bash
# Top-down (default)
npx aicode2flow ./main.go --direction TD

# Left-to-right
npx aicode2flow ./main.go --direction LR
```

### Full Options Reference

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--output` | `-o` | Output file path | stdout |
| `--format` | `-f` | Output format: mermaid / svg / png | mermaid |
| `--direction` | | Flow direction: TD / LR | TD |
| `--language` | `-l` | Force language | auto-detect |
| `--exclude` | `-e` | Exclude pattern (regex) | — |
| `--theme` | | Mermaid theme | default |
| `--ai` | | AI semantic enhancement (requires API key) | false |
| `--version` | `-v` | Show version | |
| `--help` | | Show help | |

---

## Language Support

### Supported Languages (8)

| Language | Extensions | Entry Point |
|----------|------------|-------------|
| Go | `.go` | `main` |
| Python | `.py` | `main` / `if __name__` |
| JavaScript | `.js` `.jsx` `.mjs` `.cjs` | `main` |
| TypeScript | `.ts` | `main` |
| Rust | `.rs` | `main` |
| Java | `.java` | `main` |
| C | `.c` `.h` | `main` |
| C++ | `.cpp` `.cxx` `.cc` `.hpp` `.hxx` | `main` |

### Filter by Language

```bash
# Scan project, only analyze Python files
npx aicode2flow ./ --language python

# Force-parse a .txt file as Go
npx aicode2flow ./app.txt -l go
```

---

## Exclude & Filter

### Default Exclusions

When scanning directories, these are skipped automatically:

- `node_modules`
- `.git`, `.svn`, `.hg`
- `dist`, `build`, `target`
- `__pycache__`, `.venv`
- All hidden directories (`.` prefix)

### `--exclude` Pattern

Use a regular expression to exclude specific files:

```bash
# Exclude test files
npx aicode2flow ./ --exclude "_test|_spec"

# Exclude generated files
npx aicode2flow ./ --exclude "generated|pb\\."

# Exclude vendor directory
npx aicode2flow ./ --exclude "vendor/"
```

---

## GitHub Action Integration

aicode2flow ships with a composite GitHub Action that generates a flowchart and comments on Pull Requests.

### Setup

Create a workflow file in `.github/workflows/`:

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

### Action Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `path` | Source code file or directory path | Yes | — |
| `direction` | Flowchart direction (TD/LR) | No | TD |
| `github-token` | GitHub Token for PR comment | No | `${{ github.token }}` |

---

## Extending Languages

> Adding a new language requires **only two files** — zero TypeScript code changes.

### Steps

1. **Create language config** `config/languages/<name>.json`

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

2. **Create Tree-sitter query** `queries/<name>.scm`

```scm
; method definitions
(method
  name: (identifier) @name
  body: (body_statement) @body) @function

; method calls
(call
  method: (identifier) @callee) @call
```

3. **Install the grammar parser**

```bash
npm install tree-sitter-ruby
```

Done! No TypeScript source code changes needed.

### Capture Tags Reference

| Capture | Purpose | Required |
|---------|---------|----------|
| `@name` | Function/method name | Yes |
| `@function` | Function definition (tag name is arbitrary, must match nodeTypes key) | Yes |
| `@body` | Function body | No |
| `@call` | Function call expression | No |
| `@callee` | Called function name | No |
| `@cond` | Condition expression | No |

---

## FAQ

### Q: The flowchart is too complex?

Use `--direction LR` for left-to-right layout. Future versions will add module grouping and depth control.

### Q: How do I show only the call chain from entry to specific functions?

Current version does not support call-chain pruning. Use `--exclude` to filter unwanted files, or `--language` to narrow the scope.

### Q: Why are some function calls missing edges?

Only functions found within the analyzed scope (same file or directory) are connected. External library calls do not appear as connections.

### Q: Node.js version requirement?

Node.js >= 18.

### Q: SVG/PNG rendering fails?

Ensure `@mermaid-js/mermaid-cli` is installed:

```bash
npm install -g @mermaid-js/mermaid-cli
```

The first run will download Chromium automatically. For restricted networks, set `PUPPETEER_SKIP_DOWNLOAD` or configure Puppeteer to use an existing Chrome installation.

---

> Visit the [GitHub repository](https://github.com/peterfei/aicode2flow) for more information.
