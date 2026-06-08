# aicode2flow Theme System Guide

## Table of Contents

- [Quick Start](#quick-start)
- [Using Themes](#using-themes)
- [Creating Custom Themes](#creating-custom-themes)
- [Theme Inheritance](#theme-inheritance)
- [Style Reference](#style-reference)
- [Best Practices](#best-practices)
- [Preset Theme Library](#preset-theme-library)

---

## Quick Start

### Installation

```bash
# Global installation
npm install -g aicode2flow

# Or use npx (zero-install)
npx aicode2flow
```

### Basic Usage

```bash
# Use default theme
aicode2flow src/main.go -o flowchart.md

# Specify theme
aicode2flow src/main.go -o flowchart.md --theme github-dark

# List all available themes
aicode2flow --list-themes
```

---

## Using Themes

### Theme Parameter

```bash
# Full syntax
aicode2flow <input> -o <output> --theme <theme-name>

# Examples
aicode2flow src/app.py -o flow.md --theme dracula
aicode2flow src/main.ts -o flow.svg --theme nord
```

### Available Themes

| Theme Name | Description | Use Case |
|-------------|-------------|----------|
| `github-dark` | GitHub Dark colors | Dark docs, technical blogs |
| `github-light` | GitHub Light colors | Light docs, printing |
| `github-dim` | Semi-transparent Dark | Complex backgrounds |
| `dracula` | Dracula color scheme | Popular color scheme |
| `monokai` | Monokai colors | Classic editor style |
| `nord` | Nordic blues | Fresh, cool style |
| `vscode-dark` | VS Code Dark+ | Developer friendly |
| `pastel` | Soft pastels | Casual documents |
| `high-contrast` | High contrast | Accessibility |
| `print-friendly` | Print friendly | B&W printing |

---

## Creating Custom Themes

### Method 1: Copy Template

```bash
# Copy template file
cp config/themes/theme-template.json config/themes/my-theme.json

# Edit theme
vim config/themes/my-theme.json
```

### Method 2: Create from Scratch

Create `config/themes/my-theme.json`:

```json
{
  "name": "my-theme",
  "meta": {
    "description": "My custom theme",
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

### Using Custom Themes

```bash
# Use theme file directly
aicode2flow src/main.go -o flow.md --theme ./my-theme.json

# Install to global theme directory
mkdir -p ~/.aicode2flow/themes
cp my-theme.json ~/.aicode2flow/themes/
aicode2flow src/main.go -o flow.md --theme my-theme
```

---

## Theme Inheritance

### Inheritance Syntax

```json
{
  "name": "my-theme",
  "extends": "github-dark",

  "styles": {
    "function": "fill:#569cd6,stroke:#4a8acb,color:#fff,opacity:0.7"
  }
}
```

### Inheritance Rules

1. **Auto Merge**: Child theme overrides parent theme properties
2. **Partial Override**: Only specify properties to change
3. **Multi-level**: Supports inheritance chains (A extends B, B extends C)

### Example

```json
// Parent: github-dark.json
{
  "name": "github-dark",
  "styles": {
    "function": "fill:#569cd6,stroke:#4a8acb,color:#fff",
    "condition": "fill:#dcdcaa,stroke:#c4c295,color:#1e1e1e"
  }
}

// Child: github-dim.json
{
  "name": "github-dim",
  "extends": "github-dark",
  "styles": {
    // Only override function, condition inherits from parent
    "function": "fill:#569cd6,stroke:#4a8acb,color:#fff,opacity:0.7"
  }
}
```

---

## Style Reference

### Node Types

aicode2flow supports the following node types:

| Type | Description | Default Shape |
|------|-------------|----------------|
| `function` | Function | Rounded rect |
| `method` | Method | Rounded rect |
| `condition` | Conditional | Diamond |
| `loop` | Loop | Hexagon |
| `entry` | Entry point | Stadium |
| `class` | Class/Interface | Rectangle |

### Mermaid Style Syntax

#### Basic Style

```css
style nodeId fill:#color,stroke:#color,stroke-width:width,color:textColor
```

#### Available Properties

| Property | Description | Example |
|----------|-------------|---------|
| `fill` | Fill color | `fill:#4a90e2` |
| `stroke` | Border color | `stroke:#357abd` |
| `stroke-width` | Border width | `stroke-width:2px` |
| `stroke-dasharray` | Dashed line | `stroke-dasharray:5 5` |
| `color` | Text color | `color:#ffffff` |
| `opacity` | Transparency | `opacity:0.7` |
| `font-family` | Font family | `font-family:Arial` |
| `font-size` | Font size | `font-size:16px` |

#### Color Formats

```json
// Hexadecimal (recommended)
"fill:#4a90e2"

// RGB
"fill:rgb(74, 144, 226)"

// RGBA (with transparency)
"fill:rgba(74, 144, 226, 0.7)"

// Color name
"fill:blue"
```

### Edge Styles

```json
{
  "links": {
    "default": "stroke:#color,stroke-width:width,color:textColor",
    "call": "stroke:#color,stroke-width:width",
    "return": "stroke:#color,stroke-dasharray:5 5"
  }
}
```

### Global Directives

```json
{
  "directives": [
    "init: {'theme':'dark'}",
    "linkStyle default stroke:#808080"
  ]
}
```

---

## Best Practices

### Color Suggestions

#### Contrast

Ensure sufficient color contrast (WCAG AA: 4.5:1)

```json
// ✅ Good: High contrast
{
  "styles": {
    "function": "fill:#4a90e2,stroke:#357abd,color:#fff"
  }
}

// ❌ Bad: Low contrast
{
  "styles": {
    "function": "fill:#e0e0e0,stroke:#d0d0d0,color:#f0f0f0"
  }
}
```

#### Color Harmony

Use color tools for harmonious palettes:

- [Coolors](https://coolors.co/) - Color scheme generator
- [Adobe Color](https://color.adobe.com/) - Professional colors
- [Nippon Colors](https://nipponcolors.com/) - Japanese traditional colors

### Performance Optimization

```json
// ✅ Good: Simple styles
"function": "fill:#4a90e2,stroke:#357abd,color:#fff"

// ❌ Bad: Overly complex
"function": "fill:linear-gradient(135deg, #4a90e2 0%, #357abd 100%),stroke:#357abd,filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
```

### Accessibility

#### Provide High Contrast Version

```json
// high-contrast.json
{
  "styles": {
    "function": "fill:#000000,stroke:#ffffff,color:#ffff00"
  }
}
```

#### Color Blind Friendly

Avoid relying solely on color:

```json
// ✅ Good: Color + shape distinction
{
  "styles": {
    "condition": "fill:#f5a623,stroke:#d4881c,stroke-width:3px"
  }
}
```

### Theme Naming

```json
// ✅ Good: Descriptive naming
"name": "github-dark-compact"

// ❌ Bad: Vague naming
"name": "theme1"
```

---

## Preset Theme Library

### GitHub Series

#### github-dark
```bash
aicode2flow src.go -o flow.md --theme github-dark
```

#### github-light
```bash
aicode2flow src.go -o flow.md --theme github-light
```

#### github-dim (inheritance example)
```bash
aicode2flow src.go -o flow.md --theme github-dim
```

### Popular Color Schemes

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

### Editor Themes

#### vscode-dark
```bash
aicode2flow src.go -o flow.md --theme vscode-dark
```

### Special Purpose

#### high-contrast (accessibility)
```bash
aicode2flow src.go -o flow.md --theme high-contrast
```

#### print-friendly (printing)
```bash
aicode2flow src.go -o flow.md --theme print-friendly
```

---

## Advanced Features

### Complexity Visualization (Planned)

Auto-annotate based on code complexity:

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

### Auto Grouping (Planned)

Group by package/module:

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

## Troubleshooting

### Theme Not Applied

```bash
# Check if theme file exists
aicode2flow --list-themes

# Validate JSON syntax
cat my-theme.json | jq .

# Test theme
aicode2flow test.go -o test.md --theme my-theme
```

### Color Display Issues

```bash
# Ensure output format supports styling
aicode2flow src.go -o flow.md --theme github-dark  # ✅ Markdown
aicode2flow src.go -o flow.svg --theme github-dark  # ✅ SVG
aicode2flow src.go -o flow.mmd --theme github-dark  # ✅ Mermaid
```

### Mermaid Rendering Issues

Verify generated syntax at [Mermaid Live Editor](https://mermaid.live):

```bash
# View generated Mermaid code
aicode2flow src.go -o flow.md --theme github-dark
cat flow.md
```

---

## Contributing Themes

### Submit Theme

1. Fork the repository
2. Create theme file in `config/themes/`
3. Add theme documentation and preview
4. Submit Pull Request

### Theme Checklist

- [ ] Valid JSON syntax
- [ ] Passes `jq` validation
- [ ] Provide preview example
- [ ] Ensure accessibility
- [ ] Add documentation

---

## References

- [Mermaid Official Docs](https://mermaid.js.org/)
- [Mermaid Style Syntax](https://mermaid.js.org/syntax/flowchart.html#styling)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Accessibility Checker](https://webaim.org/resources/contrastchecker/)

---

## Changelog

### v1.0.0 (2025-01-08)

- ✅ Initial theme system
- ✅ 10 preset themes
- ✅ Theme inheritance support
- ✅ Zero-dependency implementation
