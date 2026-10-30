# 🎪 DOTA2 暗黑狂欢 · 票券图鉴与智能推荐助手

**中文说明**

[![Online Demo](https://img.shields.io/badge/GitHub%20Pages-在线使用-success?logo=github&style=for-the-badge)](https://admin05.github.io/dota2-dark-carnival-helper/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](https://github.com/islanddddddd/dota2-dark-carnival-helper)

> 🌐 **在线网页入口**：**[https://admin05.github.io/dota2-dark-carnival-helper/](https://admin05.github.io/dota2-dark-carnival-helper/)**

基于 Liquipedia 官方票券映射与「单局获胜 3 抽 2」掉落机制打造的 DOTA 2 暗黑狂欢专列通关助手。

---

## 🌟 核心亮点

- **📖 127 位全英雄图鉴**：收录 11 种塔罗票券，按四大属性分类展示；支持按中英文名、拼音缩写（如 `am`、`sf`、`pa`）及票券快捷检索。
- **🎯 缺口计算与智能推荐**：自由设置票券拥有量与目标需求，系统根据实际掉落组合的期望有效收益自动推荐英雄。
- **🌓 双主题与多语言**：支持深色/浅色日夜模式及中英文即时切换，偏好自动保存。

---

## 🧮 票券计算与推荐规则

每个英雄固定对应 3 个票券位置。每场获胜后，从这 3 个位置中随机抽取 2 个；`[1, 2]`、`[1, 3]`、`[2, 3]` 三种组合的概率各为 1/3。因此实际掉落总是 2 张票券，但能填补当前缺口的数量可能是 0、1 或 2 张。

推荐算法先计算每种票券的净缺口：

```text
净缺口 = max(目标需求 - 已拥有数量, 0)
```

对每个英雄，系统分别计算三种抽取组合能填补的有效票券数量，再取平均值作为“期望有效收益”。重复票券仍会影响抽取结果，但在判断“匹配了几种缺口”和排序优先级时只按不同票券类型计算，避免把“恶魔、恶魔、恶魔”误判成三个独立缺口。

推荐分为三档：

- **第 1 档**：三种抽取组合都能获得 2 张所需票券，期望收益为 2.0 张/胜场。
- **第 2 档**：三种抽取组合都至少能获得 1 张所需票券，部分组合可以获得 2 张。
- **第 3 档**：部分抽取组合可能获得 0 张所需票券。

同一档内按期望有效收益从高到低排序。例如缺少 1 张“恶魔”和 1 张“星星”时，炼金术士、树精卫士的期望收益为 1.33 张/胜场；末日使者、光之守卫虽然分别有 3 个相同票券，但每场最多只能填补 1 张缺口，期望收益为 1.00 张/胜场。

页面中的“预计胜场”指预计需要赢下的对局数量，不包含输掉的比赛；票券库存和目标需求只保存在当前浏览器中。

---

## 🚀 快速启动

- **在线使用**：浏览器直接打开 [GitHub Pages](https://admin05.github.io/dota2-dark-carnival-helper/)。
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
