#!/bin/bash
# 主题预览生成脚本
# 为所有预设主题生成预览图

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
EXAMPLES_DIR="$PROJECT_ROOT/examples"
OUTPUT_DIR="$PROJECT_ROOT/docs/theme-previews"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 示例文件
EXAMPLE_FILE="$EXAMPLES_DIR/theme-demo.go"

if [ ! -f "$EXAMPLE_FILE" ]; then
    echo "示例文件不存在: $EXAMPLE_FILE"
    exit 1
fi

# 主题列表
THEMES=(
    "github-dark"
    "github-light"
    "github-dim"
    "dracula"
    "monokai"
    "nord"
    "vscode-dark"
    "pastel"
    "high-contrast"
    "print-friendly"
)

echo "🎨 生成主题预览..."
echo "=================="

# 为每个主题生成预览
for theme in "${THEMES[@]}"; do
    echo "生成 $theme 预览..."

    # 生成 Markdown
    aicode2flow "$EXAMPLE_FILE" \
        -o "$OUTPUT_DIR/$theme.md" \
        --theme "$theme" \
        2>/dev/null || echo "  ⚠️  跳过 $theme"

    # 生成 SVG
    aicode2flow "$EXAMPLE_FILE" \
        -o "$OUTPUT_DIR/$theme.svg" \
        --theme "$theme" \
        2>/dev/null || echo "  ⚠️  SVG生成失败: $theme"
done

echo ""
echo "✅ 预览生成完成！"
echo "📁 输出目录: $OUTPUT_DIR"
echo ""
echo "查看预览:"
for theme in "${THEMES[@]}"; do
    if [ -f "$OUTPUT_DIR/$theme.svg" ]; then
        echo "  - $theme: $OUTPUT_DIR/$theme.svg"
    fi
done
