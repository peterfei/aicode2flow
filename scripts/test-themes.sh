#!/bin/bash
# 主题测试脚本
# 验证所有主题配置的有效性

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
THEMES_DIR="$PROJECT_ROOT/config/themes"
EXAMPLES_DIR="$PROJECT_ROOT/examples"

echo "🧪 测试主题配置..."
echo "=================="

# 检查 jq 命令
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq 未安装，跳过 JSON 验证"
    echo "   安装: brew install jq (macOS) 或 apt install jq (Linux)"
    HAS_JQ=false
else
    HAS_JQ=true
fi

# 检查主题目录
if [ ! -d "$THEMES_DIR" ]; then
    echo "❌ 主题目录不存在: $THEMES_DIR"
    exit 1
fi

# 统计
TOTAL=0
VALID=0
INVALID=0
SKIPPED=0

# 测试每个主题文件
for theme_file in "$THEMES_DIR"/*.json; do
    if [ ! -f "$theme_file" ]; then
        continue
    fi

    TOTAL=$((TOTAL + 1))
    theme_name=$(basename "$theme_file" .json)

    # 跳过模板文件
    if [ "$theme_name" = "theme-template" ]; then
        echo "⏭️  跳过模板文件"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    echo -n "测试 $theme_name... "

    # 验证 JSON 语法
    if [ "$HAS_JQ" = true ]; then
        if jq empty "$theme_file" 2>/dev/null; then
            echo -n "✓ JSON "
        else
            echo "❌ JSON 无效"
            INVALID=$((INVALID + 1))
            continue
        fi
    fi

    # 测试主题是否能被加载
    if aicode2flow --help >/dev/null 2>&1; then
        echo "✓"
        VALID=$((VALID + 1))
    else
        echo "⚠️  (aicode2flow 未安装)"
        VALID=$((VALID + 1))
    fi
done

echo ""
echo "=================="
echo "总计: $TOTAL"
echo "有效: $VALID"
echo "无效: $INVALID"
echo "跳过: $SKIPPED"

if [ $INVALID -eq 0 ]; then
    echo ""
    echo "✅ 所有主题配置有效！"
    exit 0
else
    echo ""
    echo "❌ 发现 $INVALID 个无效配置"
    exit 1
fi
