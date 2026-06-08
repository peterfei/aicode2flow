# 快速测试主题系统

## 🚀 一键测试

```bash
# 运行自动化测试
./scripts/test-theme-system.sh
```

**预期结果**: 所有7个测试通过 ✅

---

## 🧪 手动测试

### 1️⃣ 编译
```bash
npm run build
```

### 2️⃣ 列出所有主题
```bash
node dist/cli.js --listThemes
```

### 3️⃣ 使用主题
```bash
# 使用github-dark主题
node dist/cli.js examples/theme-demo.go --theme github-dark

# 使用dracula主题
node dist/cli.js examples/theme-demo.go --theme dracula

# 测试主题继承（github-dim继承github-dark）
node dist/cli.js examples/theme-demo.go --theme github-dim
```

### 4️⃣ 输出到文件
```bash
# Markdown输出
node dist/cli.js examples/theme-demo.go -o /tmp/test.md --theme github-dark
cat /tmp/test.md
```

### 5️⃣ 错误处理
```bash
# 无效主题应降级到默认
node dist/cli.js examples/theme-demo.go --theme invalid-theme
```

---

## ✅ 测试检查清单

- [ ] 编译成功
- [ ] 列出13个主题
- [ ] 向后兼容（无主题时正常）
- [ ] github-dark主题应用正确
- [ ] dracula主题应用正确
- [ ] 主题继承工作
- [ ] 输出到文件正确
- [ ] 错误处理正确

---

## 📊 可用主题

```
github-dark      - GitHub Dark配色
github-light     - GitHub Light配色
github-dim       - 半透明Dark（继承示例）
dracula          - Dracula配色
monokai          - Monokai配色
nord             - 北极蓝调配色
vscode-dark      - VS Code Dark+配色
high-contrast    - 高对比度（无障碍）
print-friendly   - 打印友好
pastel           - 柔和粉彩
```

---

## 🔍 查看详细测试指南

[完整测试指南](./TESTING_GUIDE.md)
