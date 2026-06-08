#!/bin/bash
# 主题系统测试脚本

set -e

echo "🧪 aicode2flow 主题系统测试"
echo "=============================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试计数
PASS=0
FAIL=0

# 测试函数
test_case() {
    local name="$1"
    local cmd="$2"
    local expected="$3"

    echo -n "测试: $name ... "

    if eval "$cmd" > /tmp/test-output 2>&1; then
        if grep -q "$expected" /tmp/test-output; then
            echo -e "${GREEN}✓ PASS${NC}"
            PASS=$((PASS + 1))
        else
            echo -e "${RED}✗ FAIL${NC} (Expected: $expected)"
            cat /tmp/test-output
            FAIL=$((FAIL + 1))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Command failed)"
        cat /tmp/test-output
        FAIL=$((FAIL + 1))
    fi
}

# 编译
echo -e "${BLUE}步骤1: 编译代码${NC}"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 编译成功${NC}"
else
    echo -e "${RED}✗ 编译失败${NC}"
    exit 1
fi
echo ""

# 测试用例
echo -e "${BLUE}步骤2: 运行测试用例${NC}"
echo ""

# 测试1: 列出主题
test_case \
    "列出所有主题" \
    "node dist/cli.js --listThemes" \
    "Available Themes"

# 测试2: 不使用主题（向后兼容）
test_case \
    "向后兼容（无主题）" \
    "node dist/cli.js examples/theme-demo.go" \
    "flowchart TD"

# 测试3: 使用github-dark主题
test_case \
    "应用github-dark主题" \
    "node dist/cli.js examples/theme-demo.go --theme github-dark" \
    "fill:#c586c0"

# 测试4: 使用dracula主题
test_case \
    "应用dracula主题" \
    "node dist/cli.js examples/theme-demo.go --theme dracula" \
    "fill:#bd93f9"

# 测试5: 主题继承
test_case \
    "主题继承（github-dim）" \
    "node dist/cli.js examples/theme-demo.go --theme github-dim" \
    "opacity:0.7"

# 测试6: 输出到文件
test_case \
    "输出到文件" \
    "node dist/cli.js examples/theme-demo.go -o /tmp/test-theme.md --theme github-dark" \
    "Flowchart written"

# 测试7: 错误处理
test_case \
    "错误处理（无效主题）" \
    "node dist/cli.js examples/theme-demo.go --theme invalid-theme-xyz" \
    "Using default flowchart"

echo ""

# 测试总结
echo -e "${BLUE}步骤3: 测试总结${NC}"
echo "=============================="
echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo "总计: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $FAIL 个测试失败${NC}"
    exit 1
fi
