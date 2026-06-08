# 主题系统预览 | Theme Previews

本文档展示所有预设主题的效果预览。

---

## 生成预览

运行预览生成脚本：

```bash
./scripts/generate-theme-previews.sh
```

## 预览文件

预览将生成在 `docs/theme-previews/` 目录：

```bash
docs/theme-previews/
├── github-dark.md      # GitHub Dark 主题
├── github-dark.svg     # SVG 渲染
├── github-light.md
├── github-light.svg
├── dracula.md
├── dracula.svg
└── ... (其他主题)
```

## 查看预览

### 在浏览器中查看

```bash
# 使用 VS Code Live Server 或类似工具
cd docs/theme-previews
python -m http.server 8000
# 访问 http://localhost:8000
```

### 在 GitHub 上查看

将 `.md` 文件推送到 GitHub，GitHub 会自动渲染 Mermaid 图表。

### 使用 Mermaid Live Editor

复制 `.md` 文件内容到 [Mermaid Live Editor](https://mermaid.live) 查看效果。

---

## 示例代码

所有主题使用以下示例代码生成：

```go
// examples/theme-demo.go
package main

func main() {
    config := loadConfig()
    validate(config)
    process(config)
}

func loadConfig() Config {
    return Config{Name: "demo", Limit: 100}
}

func validate(cfg Config) {
    if cfg.Name == "" {
        panic("empty name")
    }
}

func process(cfg Config) {
    for i := 0; i < cfg.Limit; i++ {
        item := createItem(i)
        transform(item)
        save(item)
    }
}
```

---

## 主题对比

| 主题 | 预览 | 特点 |
|------|------|------|
| github-dark | [预览](theme-previews/github-dark.md) | 深色，GitHub 配色 |
| github-light | [预览](theme-previews/github-light.md) | 浅色，清新 |
| github-dim | [预览](theme-previews/github-dim.md) | 半透明，继承 |
| dracula | [预览](theme-previews/dracula.md) | 流行配色 |
| monokai | [预览](theme-previews/monokai.md) | 经典编辑器 |
| nord | [预览](theme-previews/nord.md) | 北欧风格 |
| vscode-dark | [预览](theme-previews/vscode-dark.md) | VS Code 风格 |
| high-contrast | [预览](theme-previews/high-contrast.md) | 高对比度 |
| print-friendly | [预览](theme-previews/print-friendly.md) | 打印友好 |
| pastel | [预览](theme-previews/pastel.md) | 柔和粉彩 |

---

## 自定义主题预览

```bash
# 为自定义主题生成预览
aicode2flow examples/theme-demo.go \
  -o my-theme-preview.md \
  --theme ./my-theme.json
```

---

## 技术说明

预览生成过程：

1. **加载示例代码** → `examples/theme-demo.go`
2. **分析代码结构** → 提取函数和调用关系
3. **生成 Mermaid** → 应用主题样式
4. **输出 Markdown** → 包含 ```mermaid 代码块
5. **渲染 SVG** → 使用 mermaid-cli

---

## 故障排除

### SVG 渲染失败

确保安装了 `@mermaid-js/mermaid-cli`：

```bash
npm install -g @mermaid-js/mermaid-cli
```

### 主题未生效

检查主题配置是否有效：

```bash
./scripts/test-themes.sh
```

### GitHub 未渲染 Mermaid

确保：
- Markdown 文件使用 ```` ```mermaid ` 代码块
- 语法符合 Mermaid 规范
- GitHub 支持 Mermaid（公共仓库）

---

## 贡献

添加你的主题预览：

1. 创建主题配置文件
2. 运行预览生成脚本
3. 提交 PR

详见：[贡献指南](../CONTRIBUTING.md)
