# 🎪 DOTA2 暗黑狂欢 · 票券图鉴与智能英雄推荐助手

**[English](README.md) | [中文说明](README.zh-CN.md)**

[![Online Demo](https://img.shields.io/badge/GitHub%20Pages-点击在线使用-success?logo=github&style=for-the-badge)](https://islanddddddd.github.io/dota2-dark-carnival-helper/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](https://github.com/1207446924/dota2-dark-carnival-helper)

> 🌐 **在线体验入口**：👉 **[https://islanddddddd.github.io/dota2-dark-carnival-helper/](https://islanddddddd.github.io/dota2-dark-carnival-helper/)**

基于 Liquipedia 官方暗黑狂欢票券映射数据（`Dark Carnival/Ticket Mapping`）与「单场获胜 3 抽 2」核心掉落机制打造的 DOTA 2 专列通关助手。

---

## 🌟 核心功能

1. **📖 全英雄票券图鉴 (Codex)**
   - **127 位 DOTA2 全英雄完整收录**：严格按力量 (36)、敏捷 (35)、智力 (34)、全才 (22) 四大属性分区展示。
   - **11 种官方主题塔罗票券**：完整呈现愚者、魔术师、女祭司、恶魔、皇帝、恋人、力量、隐士、星星、命运之轮、死神。
   - **智能多维搜索**：支持英雄中文名、英文名、常见简称/别名（如 `ck`、`sf`、`pa`、`水人`、`冰女`、`卡尔` 等）以及票券名称快速反查。
   - **精致高密度卡片**：纯净卡片布局，一屏阅览更多英雄，点击票券即可查看详细出处与产出英雄。

2. **🎯 缺口配置与智能推荐 (Recommendation)**
   - **极简紧凑的库存与需求面板**：自由微调 11 种票券的「当前拥有量」与「目标需求量」，自动计算实时净缺口，轻巧美观不占空间。
   - **数学期望分档排序**：
     - **🥇 第 1 档（完美契合）**：3/3 票券全部命中净缺口，单局期望 2.0 张，100% 双收无浪费。
     - **🥈 第 2 档（高效精选）**：2/3 票券命中净缺口，保底 100% 获得至少 1 张，单局期望 1.33 张。
     - **🥉 第 3 档（备选补充）**：1/3 票券命中净缺口，单局期望 0.67 张。
   - **发光票券视觉指示**：急需的票券自带金色高光发光背景，非急需票券优雅暗化，一目了然。
   - **🎲 模拟实战获胜**：点击【模拟获胜抽2张】，按真随机 3 抽 2 机制实时掉落票券并动态累加库存。

3. **🌓 日夜模式 & 🌐 中英文双语支持**
   - **日间 / 夜间主题切换**：支持深色狂欢赛博夜间与清爽高质感浅色日间两种主题，随心切换。
   - **中英文无缝切换**：全界面文本、英雄名称、票券信息均支持中英文即时切换并保存用户偏好。

---

## 🚀 快速启动

### 方式 1：GitHub Pages 在线访问（推荐，免安装）
随时通过公网链接免安装直接使用：
👉 **[https://islanddddddd.github.io/dota2-dark-carnival-helper/](https://islanddddddd.github.io/dota2-dark-carnival-helper/)**

### 方式 2：本地双击即开（单文件离线版）
直接双击打开 [`dark_carnival_helper.html`](./dark_carnival_helper.html) 即可在任何现代浏览器中运行（零依赖、无需安装任何环境）。

### 方式 3：启动本地服务器
```bash
# 赋予权限并启动
chmod +x start.sh
./start.sh

# 或通过 Python 启动
python3 -m http.server 8080
```
启动后在浏览器打开：`http://localhost:8080/index.html`。

---

## 📂 项目结构

```text
├── index.html                  # 现代化响应式 Web 主页面
├── app.js                      # 核心业务逻辑、期望计算、国际化与 DOM 渲染
├── data.js                     # 127 位英雄及 11 种塔罗票券浏览器数据集
├── dark_carnival_helper.html   # 全内嵌单文件一体化 HTML (方便随时分享/离线使用)
├── start.sh                    # 本地快速启动脚本
├── data/                       # 结构化原始与整合数据集
│   ├── heroes_data.json        # 127 位英雄票券核心映射数据集
│   ├── heroes_raw.json         # Dota 官方接口原始英雄数据
│   ├── liquipedia_extracted.json # Liquipedia 官方票券映射数据
│   └── official_dota2_heroes.json # 官方全量英雄定义
├── scripts/                    # 构建、打包与数据处理工具集
│   ├── bundle_app.py           # 单文件一键打包脚本
│   ├── make_files.py           # 基于 data/ 生成 data.js 的构建脚本
│   ├── apply_liquipedia.py     # 同步 Liquipedia 票券数据至主库
│   ├── enrich_aliases.py       # 拼音缩写及别名搜索增强脚本
│   ├── generate_dataset.py     # 英雄数据集初始构建流程
│   ├── build_web.py            # 数据读取验证检查脚本
│   └── test_names.py           # 英雄命名覆盖度测试
├── README.md                   # 默认英文文档 (Default English)
└── README.zh-CN.md             # 简体中文说明文档
```

---

## 📜 数据来源与许可
- 英雄与票券对应关系来源于 [Liquipedia Dota 2: Dark Carnival Ticket Mapping](https://liquipedia.net/dota2/Dark_Carnival/Ticket_Mapping)。
- 英雄肖像资源来源于 Valve Dota 2 官方 CDN。
