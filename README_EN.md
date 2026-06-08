# aicode2flow

> **Zero-install code to Mermaid flowchart.** `npx aicode2flow file.go` — 代码一键生成流程图。

[![npm version](https://img.shields.io/npm/v/aicode2flow)](https://www.npmjs.com/package/aicode2flow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/node/v/aicode2flow)](https://nodejs.org)

---

## Quick Start

```bash
# Single file
npx aicode2flow ./src/main.go

# Scan entire project directory
npx aicode2flow ./src/
```

Paste the output into any GitHub Markdown file inside a ` ```mermaid ` block. GitHub renders it automatically.

> Full usage guide: [USAGE.md](USAGE.md)

---

## Examples

### Go

```go
func greet(name string) string {
    return "Hello, " + name
}

func processUser(name string, email string) {
    greeting := greet(name)
    if validate(email) {
        saveUser(name, email)
    }
}

func main() {
    processUser("Alice", "alice@test.com")
}
```

`npx aicode2flow main.go` outputs:

```mermaid
flowchart TD
  main([main])
  greet("greet")
  validate("validate")
  processUser("processUser")
  saveUser("saveUser")
  processUser --> greet
  processUser --> validate
  processUser --> saveUser
  main --> processUser
```

### Python

```python
def process_user(name, email):
    greeting = greet(name)
    if validate(email):
        save_user(name, email)

def main():
    process_user("Alice", "alice@test.com")
```

`npx aicode2flow app.py` outputs:

```mermaid
flowchart TD
  main((["main"]))
  greet("greet")
  validate("validate")
  process_user("process_user")
  save_user("save_user")
  process_user --> greet
  process_user --> validate
  process_user --> save_user
  main --> process_user
```

### JavaScript

```javascript
function main() {
    processUser("Alice", "alice@test.com");
}
```

`npx aicode2flow index.js` outputs:

```mermaid
flowchart TD
  main([main])
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

## Theme System

aicode2flow comes with **13 beautiful built-in themes** to make your flowcharts more professional.

### Quick Start

```bash
# List all themes
aicode2flow --listThemes

# Use a theme
aicode2flow src.go --theme github-dark
aicode2flow src.py -o flow.md --theme dracula
```

### Theme Preview

#### github-dark (Recommended)
Perfect for dark technical documentation and developer blogs

```mermaid
%%init: {'theme':'dark', 'themeVariables': { 'primaryColor': '#569cd6' }}
flowchart TD
  main([main])
  loadConfig("loadConfig")
  validate("validate")
  main --> loadConfig
  main --> validate
```

#### dracula (Popular)
Popular Dracula color scheme

```mermaid
%%init: {'theme':'base', 'themeVariables': { 'primaryColor': '#bd93f9' }}
flowchart TD
  main([main])
  loadConfig("loadConfig")
  validate("validate")
  main --> loadConfig
  main --> validate
```

#### nord (Fresh)
Arctic blue color scheme

```mermaid
%%init: {'theme':'base', 'themeVariables': { 'primaryColor': '#88c0d0' }}
flowchart TD
  main([main])
  loadConfig("loadConfig")
  validate("validate")
  main --> loadConfig
  main --> validate
```

### More Themes

| Theme | Use Case |
|-------|----------|
| `github-dark` | Dark docs, developer blogs |
| `github-light` | Light docs, printing |
| `dracula` | Popular scheme, modern docs |
| `nord` | Clean, cool style |
| `monokai` | Classic editor style |
| `high-contrast` | Accessibility |
| `print-friendly` | B&W printing |

> 📖 See complete theme guide: [USAGE.md](USAGE.md)

---

## Usage

```bash
# Basic — output Mermaid to stdout
npx aicode2flow ./src/main.go

# Scan entire project (auto-detect all supported files)
npx aicode2flow ./

# Scan project, only analyze Go files
npx aicode2flow ./ --language go

# Save to file
npx aicode2flow ./app.py -o flowchart.mmd

# Save as Markdown (with ```mermaid block)
npx aicode2flow ./index.js -o FLOWCHART.md

# Render as SVG (requires @mermaid-js/mermaid-cli)
npx aicode2flow ./main.go -o diagram.svg
npx aicode2flow ./app.py --format svg -o diagram.svg

# Render as PNG
npx aicode2flow ./index.js --format png -o diagram.png

# Left-to-right layout
npx aicode2flow ./main.go --direction LR

# Exclude test files
npx aicode2flow ./ --exclude "_test|_spec"

# Force a specific language
npx aicode2flow ./app.py -l go
```

### Options

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--output` | `-o` | Output file path (.mmd / .md / .svg / .png) | stdout |
| `--format` | `-f` | Output format: mermaid / svg / png | mermaid |
| `--direction` | | Flow direction: TD (top-down), LR (left-right) | TD |
| `--language` | `-l` | Force language (go/python/javascript) | auto-detect |
| `--depth` | `-d` | Analysis depth | 0 |
| `--exclude` | `-e` | Exclude pattern | — |
| `--ai` | | AI semantic enhancement (requires API key) | false |
| `--theme` | | Mermaid theme | default |
| `--version` | `-v` | Show version | |
| `--help` | | Show help | |

---

## Supported Languages

| Language | Status | Extensions |
|----------|--------|------------|
| Go | ✅ | `.go` |
| Python | ✅ | `.py` |
| JavaScript | ✅ | `.js`, `.jsx`, `.mjs`, `.cjs` |
| TypeScript | ✅ | `.ts` |
| Rust | ✅ | `.rs` |
| Java | ✅ | `.java` |
| C | ✅ | `.c`, `.h` |
| C++ | ✅ | `.cpp`, `.cxx`, `.cc`, `.hpp`, `.hxx` |

Adding a new language requires only two files — no code changes:
1. `config/languages/<name>.json` — language configuration
2. `queries/<name>.scm` — Tree-sitter query patterns

---

## How It Works

```
Source Code → Tree-sitter AST → Config-driven Query Engine → Mermaid Flowchart
                                                                   ↓ (optional)
                                                             AI Semantic Labels
```

The architecture follows a **declarative, metaprogramming** approach:
- **Language differences = data**, not code (JSON configs + SCM queries)
- **Single analysis engine** reads config to support any language
- **Output = template rendering**, not imperative graph building

---

## Comparison

| Feature | aicode2flow | code2flow (PyPI) | js2flowchart |
|---------|-------------|------------------|--------------|
| Zero install (`npx`) | ✅ | ❌ `pip install` | ❌ `npm install` |
| Multi-language | ✅ Go/Python/JS | ✅ Python/JS | ❌ JS only |
| Mermaid output | ✅ GitHub-native | ❌ Graphviz | ❌ SVG only |
| Output to file | ✅ | ✅ | ❌ |
| AI enhancement | 🚧 | ❌ | ❌ |
| Maintained | ✅ Active | ⚠️ Last update 2023 | ⚠️ Last update 2022 |

---

## Architecture

```
config/languages/          ← JSON: language definitions (data)
  go.json / python.json / javascript.json
  typescript.json / rust.json / java.json
  c.json / cpp.json

queries/                   ← Tree-sitter SCM: AST patterns (data)
  go.scm / python.scm / javascript.scm
  typescript.scm / rust.scm / java.scm
  c.scm / cpp.scm

src/ engine/
  registry.ts              — Reads JSON configs → language registry
  analyzer.ts              — Generic Tree-sitter query engine
  template.ts              — Mermaid string builder

src/ cli.ts                — CLI entry point
```

Adding Rust? Create `config/languages/rust.json` + `queries/rust.scm` — **zero TypeScript changes**.

---

## Development

```bash
git clone https://github.com/peterfei/aicode2flow.git
cd aicode2flow
npm install
npm run build
npm test
```

---

## Roadmap

- [x] Go, Python, JavaScript support
- [x] TypeScript, Rust support
- [x] GitHub Action (auto-comment on PRs)
- [x] SVG/PNG output
- [x] Java, C, C++ support
- [ ] Online playground
- [ ] VSCode extension

---

## License

MIT
