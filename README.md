# 🎪 Dota 2 Dark Carnival · Ticket Codex & Helper

**[English](README.md) | [中文说明](README.zh-CN.md)**

[![Online Demo](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success?logo=github&style=for-the-badge)](https://islanddddddd.github.io/dota2-dark-carnival-helper/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](https://github.com/1207446924/dota2-dark-carnival-helper)

> 🌐 **Live Web App**: **[https://islanddddddd.github.io/dota2-dark-carnival-helper/](https://islanddddddd.github.io/dota2-dark-carnival-helper/)**

A lightweight helper for the Dota 2 Dark Carnival event, calculating optimal heroes based on official ticket mappings and the **pick-2-of-3** drop odds.

---

## 🌟 Highlights

- **📖 127 Hero Codex**: Complete 11 Tarot ticket mappings categorized by 4 attributes (Strength, Agility, Intelligence, Universal). Instant search by name, abbreviation (e.g. `am`, `sf`, `pa`), or ticket.
- **🎯 Smart Recommender**: Set your owned and needed tickets to get instant hero recommendations ranked by expected yield (Tier 1: 2.0/win, Tier 2: 1.33/win, Tier 3: 0.67/win).
- **🌓 Themes & i18n**: Dark/Light mode and English/Chinese bilingual support with persistent settings.

---

## 🚀 Quick Start

- **Online**: Open [GitHub Pages](https://islanddddddd.github.io/dota2-dark-carnival-helper/) directly in any browser.
- **Offline**: Double-click [`dark_carnival_helper.html`](./dark_carnival_helper.html) (standalone single-file bundle).
- **Local Server**:
  ```bash
  python3 -m http.server 8080
  # open http://localhost:8080/index.html
  ```

---

## 📂 Project Structure

```text
├── index.html                  # Main web application
├── app.js                      # Core logic & solver
├── data.js                     # Browser dataset
├── dark_carnival_helper.html   # Standalone offline bundle
├── start.sh                    # Local launcher
├── data/                       # Hero & ticket datasets
└── scripts/                    # Build & packaging tools
```

---

## 📜 Credits
- Data sourced from [Liquipedia Dota 2: Dark Carnival Ticket Mapping](https://liquipedia.net/dota2/Dark_Carnival/Ticket_Mapping).
- Hero assets from Valve Dota 2 official CDN.
