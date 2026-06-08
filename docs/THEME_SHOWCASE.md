# 主题展示 | Theme Showcase

本页面展示所有预设主题的效果。

---

## 预览示例代码

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

## 主题库

### GitHub 系列

#### github-dark
匹配 GitHub Dark Mode 的配色方案

```bash
aicode2flow src.go -o flow.md --theme github-dark
```

**配色方案**:
- 函数: `#569cd6` (VS Code 蓝)
- 方法: `#4ec9b0` (青绿)
- 条件: `#dcdcaa` (黄)
- 循环: `#ce9178` (橙红)
- 入口: `#c586c0` (紫)

**适用场景**: 深色技术文档、开发者博客、GitHub README

---

#### github-light
匹配 GitHub Light Mode 的清新配色

```bash
aicode2flow src.go -o flow.md --theme github-light
```

**配色方案**:
- 函数: `#0969da` (GitHub 蓝)
- 方法: `#1a7f37` (绿)
- 条件: `#9a6700` (黄褐)
- 循环: `#8250df` (紫)
- 入口: `#cf222e` (红)

**适用场景**: 浅色文档、打印输出、正式报告

---

#### github-dim
GitHub Dark 的半透明版本（继承示例）

```bash
aicode2flow src.go -o flow.md --theme github-dim
```

**特点**:
- 继承 `github-dark` 基础配色
- 添加 `opacity: 0.7` 半透明效果
- 虚线边框 (`stroke-dasharray: 5 5`)

**适用场景**: 复杂背景、叠加显示、水印效果

---

### 流行配色方案

#### dracula
流行的 Dracula 配色方案

```bash
aicode2flow src.go -o flow.md --theme dracula
```

**配色方案**:
- 背景: `#282a36` (深紫)
- 函数: `#bd93f9` (紫)
- 条件: `#ff79c6` (粉)
- 循环: `#ffb86c` (橙)
- 入口: `#ff5555` (红)

**适用场景**: 流行配色、现代文档、演示文稿

**官网**: https://draculatheme.com

---

#### monokai
经典 Monokai 编辑器配色

```bash
aicode2flow src.go -o flow.md --theme monokai
```

**配色方案**:
- 背景: `#272822` (深绿灰)
- 函数: `#66d9ef` (青)
- 方法: `#a6e22e` (绿)
- 条件: `#fd971f` (橙)
- 循环: `#f92672` (粉红)

**适用场景**: 代码编辑器风格、复古主题

---

#### nord
一眼心动的北极蓝调配色

```bash
aicode2flow src.go -o flow.md --theme nord
```

**配色方案**:
- 背景: `#2e3440` (北极夜)
- 函数: `#88c0d0` (冰蓝)
- 方法: `#a3be8c` (极光绿)
- 条件: `#ebcb8b` (雪顶黄)
- 循环: `#bf616a` (极光红)

**适用场景**: 清新冷淡风格、Nordic 设计

**官网**: https://www.nordtheme.com

---

### 编辑器主题

#### vscode-dark
VS Code Dark+ 默认主题配色

```bash
aicode2flow src.go -o flow.md --theme vscode-dark
```

**配色方案**:
- 背景: `#1e1e1e` (VS Code 深色)
- 函数: `#dcdcaa` (黄)
- 方法: `#569cd6` (蓝)
- 条件: `#c586c0` (紫)
- 循环: `#ce9178` (橙红)

**适用场景**: 开发者文档、技术博客、IDE 集成

---

### 特殊用途主题

#### high-contrast
高对比度主题（无障碍友好）

```bash
aicode2flow src.go -o flow.md --theme high-contrast
```

**配色方案**:
- 背景: `#000000` (纯黑)
- 文字: `#ffff00` (黄)
- 边框: `#ffffff` (纯白)

**特点**:
- WCAG AAA 级别对比度
- 黑白黄三色设计
- 5px 粗边框

**适用场景**: 无障碍访问、投影演示、打印输出

---

#### print-friendly
打印友好主题（节省墨水）

```bash
aicode2flow src.go -o flow.md --theme print-friendly
```

**配色方案**:
- 背景: `#ffffff` (纯白)
- 元素: `#000000` (纯黑) + 灰度

**特点**:
- 黑白灰配色
- 细线条 (1.5px)
- 无彩色墨水

**适用场景**: 黑白打印、节省成本、文档归档

---

#### pastel
柔和粉彩配色

```bash
aicode2flow src.go -o flow.md --theme pastel
```

**配色方案**:
- 函数: `#a7c5eb` (粉蓝)
- 方法: `#b5d8b5` (粉绿)
- 条件: `#f7d794` (粉黄)
- 循环: `#f4a6a6` (粉红)
- 背景: `#fafbfc` (淡灰)

**适用场景**: 轻松文档、儿童教育、休闲风格

---

## 对比表

| 主题 | 背景色 | 主色调 | 风格 | 最佳用途 |
|------|--------|--------|------|----------|
| github-dark | `#1e1e1e` | 蓝/绿 | 深色 | 技术文档 |
| github-light | `#ffffff` | 蓝/绿 | 浅色 | 正式文档 |
| github-dim | `#1e1e1e` | 半透明 | 深色 | 复杂背景 |
| dracula | `#282a36` | 紫/粉 | 流行 | 现代文档 |
| monokai | `#272822` | 青/绿 | 复古 | 编辑器风格 |
| nord | `#2e3440` | 冰蓝/绿 | 冷色调 | Nordic 设计 |
| vscode-dark | `#1e1e1e` | 黄/蓝 | 开发者 | IDE 集成 |
| high-contrast | `#000000` | 黑白黄 | 无障碍 | 投影/打印 |
| print-friendly | `#ffffff` | 黑白 | 打印 | 黑白打印 |
| pastel | `#fafbfc` | 粉彩 | 轻松 | 休闲文档 |

---

## 生成预览

### 安装 aicode2flow

```bash
npm install -g aicode2flow
```

### 生成所有主题预览

```bash
cd /path/to/aicode2flow
./scripts/generate-theme-previews.sh
```

预览将生成在 `docs/theme-previews/` 目录。

### 测试主题配置

```bash
./scripts/test-themes.sh
```

---

## 贡献你的主题

1. 创建 `config/themes/your-theme.json`
2. 参考现有主题配置
3. 运行测试脚本验证
4. 提交 Pull Request

详见：[主题创建指南](THEME_GUIDE.md)

---

## 许可

所有主题配置采用 MIT 许可证。
