# 主题系统测试指南

## 快速测试

### 一键测试
```bash
# 运行自动化测试脚本
./scripts/test-theme-system.sh
```

---

## 手动测试步骤

### 步骤1: 编译

```bash
cd /Users/mac/project/aicode2flow
npm run build
```

**预期输出**:
```
✓ Build success in XXXms
```

---

### 步骤2: 列出所有主题

```bash
node dist/cli.js --listThemes
```

**预期输出**:
```
📊 Available Themes:
──────────────────────────────────────────────────
dark
dracula - 流行的Dracula配色方案
github-dark - 匹配GitHub Dark的配色方案
github-dim - GitHub Dark的低调版本（半透明）
github-light - 匹配GitHub Light的清新配色
high-contrast - 高对比度主题，适合无障碍访问
modern
monokai - 经典Monokai配色方案
nord - Nord - 一眼心动的北极蓝调配色
pastel - 柔和的粉彩配色，适合轻松愉快的文档
print-friendly - 打印友好主题，节省墨水，适合黑白打印
professional
vscode-dark - VS Code Dark+ 默认主题配色
──────────────────────────────────────────────────
Total: 13 theme(s)
```

---

### 步骤3: 向后兼容性测试

**测试目标**: 确保不使用主题时，输出与原版本一致

```bash
node dist/cli.js examples/theme-demo.go
```

**预期输出** (标准Mermaid，无样式):
```
📊 Generated Flowchart
──────────────────────────────────────────────────

flowchart TD

  main(["⭐ main"])
  loadConfig("loadConfig")
  validate("validate")
  process("process")
  createItem("createItem")
  transform("transform")
  save("save")

  main --> loadConfig
  main --> validate
  main --> process
  process --> createItem
  process --> transform
  process --> save

Copy the above output into a ```mermaid code block in GitHub Markdown.

📦 7 nodes, 6 edges
```

---

### 步骤4: 主题应用测试

#### 测试4.1: github-dark 主题

```bash
node dist/cli.js examples/theme-demo.go --theme github-dark
```

**预期输出** (包含样式指令):
```
%%init: {'theme':'dark', 'themeVariables': { ... }}
flowchart TD

  main(["⭐ main"])
  style main fill:#c586c0,stroke:#a969a3,stroke-width:4px,color:#fff
  loadConfig("loadConfig")
  style loadConfig fill:#569cd6,stroke:#4a8acb,stroke-width:2px,color:#fff
  ...
  linkStyle default stroke:#808080,stroke-width:2px,color:#d4d4d4
```

**关键检查点**:
- ✅ 包含 `%%init:` 指令
- ✅ 每个节点有 `style` 指令
- ✅ 有 `linkStyle default` 指令

---

#### 测试4.2: dracula 主题

```bash
node dist/cli.js examples/theme-demo.go --theme dracula
```

**预期输出**:
```
%%init: {'theme':'base', 'themeVariables': { 'primaryColor': '#bd93f9', ... }}
style main fill:#ff5555,stroke:#ffb86c,stroke-width:4px,color:#282a36
style loadConfig fill:#bd93f9,stroke:#ff79c6,stroke-width:2px,color:#282a36
linkStyle default stroke:#6272a4,stroke-width:2px,color:#f8f8f2
```

**关键检查点**:
- ✅ 背景色: `#282a36` (Dracula深色)
- ✅ 主色调: `#bd93f9` (紫色)

---

#### 测试4.3: nord 主题

```bash
node dist/cli.js examples/theme-demo.go --theme nord
```

**预期输出**:
```
style loadConfig fill:#88c0d0,stroke:#81a1c1,stroke-width:2px,color:#2e3440
```

**关键检查点**:
- ✅ 冰蓝色调: `#88c0d0`
- ✅ 深色背景: `#2e3440`

---

### 步骤5: 主题继承测试

**测试目标**: 验证 github-dim 正确继承 github-dark

```bash
node dist/cli.js examples/theme-demo.go --theme github-dim
```

**预期输出**:
```
style loadConfig fill:#569cd6,stroke:#4a8acb,stroke-width:2px,color:#fff,opacity:0.7
linkStyle default stroke:#606060,stroke-width:1px,color:#a0a0a0,stroke-dasharray:5 5
```

**关键检查点**:
- ✅ 继承 github-dark 的基础配色
- ✅ 包含 `opacity:0.7` (半透明)
- ✅ 包含 `stroke-dasharray:5 5` (虚线)

---

### 步骤6: 输出到文件测试

```bash
# Markdown 输出
node dist/cli.js examples/theme-demo.go -o /tmp/test.md --theme github-dark
cat /tmp/test.md
```

**预期输出**:
```
```mermaid
%%init: {'theme':'dark', ...}
flowchart TD
  ...
```
```

---

```bash
# 纯 Mermaid 输出
node dist/cli.js examples/theme-demo.go -o /tmp/test.mmd --theme dracula
```

**预期输出**: 纯 Mermaid 代码，无 ``` 代码块包裹

---

### 步骤7: 错误处理测试

**测试目标**: 验证无效主题时的降级处理

```bash
node dist/cli.js examples/theme-demo.go --theme invalid-theme-xyz
```

**预期输出**:
```
⚠ Failed to load theme 'invalid-theme-xyz': Theme not found: invalid-theme-xyz
⚠ Using default flowchart instead

📊 Generated Flowchart
...
```

**关键检查点**:
- ✅ 显示警告信息
- ✅ 降级到默认流程图
- ✅ 不中断程序执行

---

### 步骤8: 全局安装测试

```bash
# 安装到全局
npm link

# 使用全局命令
aicode2flow --listThemes
aicode2flow examples/theme-demo.go --theme github-dark
```

---

## 视觉验证

### 方法1: GitHub渲染

1. 将输出的Markdown代码保存到文件
2. 推送到GitHub仓库
3. 查看渲染效果

### 方法2: Mermaid Live Editor

1. 复制Mermaid代码（不含```）
2. 访问 https://mermaid.live
3. 粘贴代码查看效果

### 方法3: 本地SVG渲染

```bash
# 需要安装 puppeteer
npm install puppeteer

# 生成SVG
node dist/cli.js examples/theme-demo.go -o /tmp/test.svg --theme github-dark

# 在浏览器中打开
open /tmp/test.svg
```

---

## 性能测试

### 测试大量节点

```bash
# 测试较大文件
time node dist/cli.js test/fixtures/sample.ts --theme github-dark
```

**预期**: 处理时间 < 1秒

---

## 边界情况测试

### 测试1: 空文件

```bash
echo "" > /tmp/empty.go
node dist/cli.js /tmp/empty.go --theme github-dark
```

**预期**: 显示 "No functions found"

---

### 测试2: 不存在的文件

```bash
node dist/cli.js /tmp/non-existent.go --theme github-dark
```

**预期**: 显示 "File not found"

---

### 测试3: 无效的JSON主题

```bash
echo '{"invalid": json}' > /tmp/bad-theme.json
node dist/cli.js examples/theme-demo.go --theme /tmp/bad-theme.json
```

**预期**: 降级到默认主题

---

## 测试检查清单

### 功能测试
- [x] 列出所有主题
- [x] 向后兼容性（无主题）
- [x] 应用单个主题
- [x] 主题继承
- [x] 输出到文件
- [x] 错误处理

### 主题测试
- [x] github-dark
- [x] github-light
- [x] github-dim（继承）
- [x] dracula
- [x] monokai
- [x] nord
- [x] vscode-dark
- [x] high-contrast
- [x] print-friendly
- [x] pastel

### 输出格式测试
- [x] Markdown (.md)
- [x] Mermaid (.mmd)
- [x] SVG (.svg)
- [x] PNG (.png)

### 边界测试
- [x] 空文件
- [x] 不存在的文件
- [x] 无效主题
- [x] 损坏的主题JSON

---

## 常见问题排查

### 问题1: 主题未生效

**检查**:
```bash
# 确认主题存在
node dist/cli.js --listThemes

# 查看详细输出
node dist/cli.js examples/theme-demo.go --theme github-dark 2>&1 | tee /tmp/debug.log
```

---

### 问题2: 编译失败

**解决**:
```bash
# 清理并重新编译
rm -rf dist node_modules/.cache
npm run build
```

---

### 问题3: SVG渲染失败

**解决**:
```bash
# 安装puppeteer
npm install puppeteer --save-optional
```

---

## 测试报告模板

```markdown
## 主题系统测试报告

**日期**: YYYY-MM-DD
**测试人**: Your Name
**版本**: 0.1.1

### 测试结果
- 编译: ✓/✗
- 列出主题: ✓/✗
- 向后兼容: ✓/✗
- 主题应用: ✓/✗
- 主题继承: ✓/✗
- 错误处理: ✓/✗

### 发现的问题
1. ...
2. ...

### 备注
...
```

---

## 自动化测试

### 运行完整测试套件
```bash
./scripts/test-theme-system.sh
```

### 测试所有主题
```bash
#!/bin/bash
themes=("github-dark" "dracula" "monokai" "nord" "vscode-dark" "pastel" "high-contrast" "print-friendly")
for theme in "${themes[@]}"; do
    echo "Testing: $theme"
    node dist/cli.js examples/theme-demo.go --theme "$theme" > "/tmp/$theme.md"
done
```

### 验证所有主题
```bash
./scripts/test-themes.sh
```

---

## 下一步

测试通过后，你可以：

1. **创建自定义主题**
   ```bash
   cp config/themes/theme-template.json config/themes/my-theme.json
   # 编辑 my-theme.json
   node dist/cli.js examples/theme-demo.go --theme my-theme
   ```

2. **贡献主题**
   - 提交主题配置文件
   - 添加主题预览
   - 更新文档

3. **集成到项目**
   ```bash
   npm link
   aicode2flow src/ -o docs/flow.md --theme github-dark
   ```

---

## 获取帮助

- 查看主题指南: `docs/THEME_GUIDE.md`
- 查看主题展示: `docs/THEME_SHOWCASE.md`
- 提交问题: GitHub Issues
