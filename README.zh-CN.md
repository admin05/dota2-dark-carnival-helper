# 🎪 DOTA2 暗黑狂欢 · 票券图鉴与智能推荐助手

**[English](README.md) | [中文说明](README.zh-CN.md)**

[![Online Demo](https://img.shields.io/badge/GitHub%20Pages-在线使用-success?logo=github&style=for-the-badge)](https://islanddddddd.github.io/dota2-dark-carnival-helper/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](https://github.com/1207446924/dota2-dark-carnival-helper)

> 🌐 **在线网页入口**：**[https://islanddddddd.github.io/dota2-dark-carnival-helper/](https://islanddddddd.github.io/dota2-dark-carnival-helper/)**

基于 Liquipedia 官方票券映射与「单局获胜 3 抽 2」掉落机制打造的 DOTA 2 暗黑狂欢专列通关助手。

---

## 🌟 核心亮点

- **📖 127 位全英雄图鉴**：收录 11 种塔罗票券，按四大属性分类展示；支持按中英文名、拼音缩写（如 `am`、`sf`、`pa`）及票券快捷检索。
- **🎯 缺口计算与智能推荐**：自由微调票券拥有量与需求量，按单局期望收益自动推荐英雄（第 1 档期望 2.0 张、第 2 档 1.33 张、第 3 档 0.67 张）。
- **🎲 实战模拟**：支持模拟获胜 3 抽 2 随机掉落并动态累加库存。
- **🌓 双主题与多语言**：支持深色/浅色日夜模式及中英文即时切换，偏好自动保存。

---

## 🚀 快速启动

- **在线使用**：浏览器直接打开 [GitHub Pages](https://islanddddddd.github.io/dota2-dark-carnival-helper/)。
- **离线使用**：双击直接运行 [`dark_carnival_helper.html`](./dark_carnival_helper.html)（单文件免安装版）。
- **本地服务**：
  ```bash
  python3 -m http.server 8080
  # 访问 http://localhost:8080/index.html
  ```

---

## 📂 项目结构

```text
├── index.html                  # 核心 Web 主页面
├── app.js                      # 推荐算法、国际化与业务逻辑
├── data.js                     # 浏览器端英雄与票券数据
├── dark_carnival_helper.html   # 全内嵌单文件一体化 HTML
├── start.sh                    # 本地启动脚本
├── data/                       # 原始与格式化数据集
└── scripts/                    # 构建、打包与维护工具集
```

---

## 📜 鸣谢与数据来源
- 票券数据来源于 [Liquipedia Dota 2: Dark Carnival Ticket Mapping](https://liquipedia.net/dota2/Dark_Carnival/Ticket_Mapping)。
- 英雄肖像资源来源于 Valve Dota 2 官方 CDN。
