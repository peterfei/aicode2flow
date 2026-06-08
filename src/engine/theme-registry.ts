/**
 * 主题注册表
 *
 * 元编程设计：
 * - 数据驱动的主题加载
 * - 纯函数式的主题解析
 * - 支持主题继承和合并
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ThemeConfig, ResolvedTheme } from '../types.js';

// 获取项目根目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// 在开发环境和打包后环境中都能正确找到主题目录
const PROJECT_ROOT = process.cwd();


/**
 * 主题注册表类
 *
 * 职责：
 * 1. 从目录加载主题配置（数据）
 * 2. 解析主题继承关系（元编程：递归合并）
 * 3. 提供主题查询接口
 */
export class ThemeRegistry {
  private themes = new Map<string, ThemeConfig>();
  private cache = new Map<string, ResolvedTheme>();
  private loaded = false;

  /**
   * 从目录加载所有主题
   *
   * 元编程：遍历文件系统，自动加载配置
   */
  loadFrom(dir: string): void {
    if (!existsSync(dir)) {
      console.warn(`Theme directory not found: ${dir}`);
      return;
    }

    const files = readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      if (file === 'theme-template.json') continue;

      const themePath = join(dir, file);
      try {
        const content = readFileSync(themePath, 'utf-8');
        const theme: ThemeConfig = JSON.parse(content);
        this.register(theme);
      } catch (error) {
        console.warn(`Failed to load theme ${file}:`, error);
      }
    }
    this.loaded = true;
  }

  /**
   * 自动加载（从内置主题目录）
   */
  autoLoad(): void {
    if (this.loaded) return;

    const themesDir = join(PROJECT_ROOT, 'config/themes');
    this.loadFrom(themesDir);
  }

  /**
   * 注册主题
   */
  register(theme: ThemeConfig): void {
    if (!theme.name) {
      throw new Error('Theme must have a name');
    }
    this.themes.set(theme.name, theme);
    // 清除缓存
    this.cache.delete(theme.name);
  }

  /**
   * 获取主题
   */
  get(name: string): ThemeConfig | undefined {
    return this.themes.get(name);
  }

  /**
   * 解析主题（处理继承）
   *
   * 元编程：递归合并配置对象
   * - 纯函数：无副作用
   * - 递归：支持多级继承
   * - 缓存：避免重复解析
   */
  resolve(name: string): ResolvedTheme {
    // 检查缓存
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const theme = this.get(name);
    if (!theme) {
      throw new Error(`Theme not found: ${name}`);
    }

    // 处理继承
    let resolved: ResolvedTheme;
    if (theme.extends) {
      const parent = this.resolve(theme.extends);
      resolved = this.merge(parent, theme);
    } else {
      resolved = theme as ResolvedTheme;
    }

    // 缓存结果
    this.cache.set(name, resolved);
    return resolved;
  }

  /**
   * 合并主题（纯函数）
   *
   * 元编程：对象合并算法
   * - 深度合并 styles 和 classes
   * - 覆盖 directives 和 variables
   * - 覆盖 entryMarker
   * - 保留 meta 信息
   */
  private merge(base: ResolvedTheme, override: ThemeConfig): ResolvedTheme {
    return {
      ...base,
      ...override,
      // 保留父主题的 meta（除非子主题提供）
      meta: { ...base.meta, ...override.meta },
      // 深度合并样式
      styles: { ...base.styles, ...override.styles },
      classes: { ...base.classes, ...override.classes },
      links: { ...base.links, ...override.links },
      // 覆盖变量和指令
      variables: { ...base.variables, ...override.variables },
      directives: override.directives || base.directives,
      // 覆盖入口点标记
      entryMarker: override.entryMarker !== undefined ? override.entryMarker : base.entryMarker,
    };
  }

  /**
   * 列出所有主题
   */
  list(): ThemeConfig[] {
    return Array.from(this.themes.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /**
   * 获取主题名称列表
   */
  names(): string[] {
    return Array.from(this.themes.keys()).sort();
  }

  /**
   * 检查主题是否存在
   */
  has(name: string): boolean {
    return this.themes.has(name);
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取统计信息
   */
  getStats(): RegistryStats {
    return {
      total: this.themes.size,
      cached: this.cache.size,
      loaded: this.loaded,
    };
  }
}

/**
 * 全局单例
 */
export const globalRegistry = new ThemeRegistry();

// 自动加载内置主题
try {
  globalRegistry.autoLoad();
} catch (error) {
  console.warn('Failed to auto-load themes:', error);
}

interface RegistryStats {
  total: number;
  cached: number;
  loaded: boolean;
}
