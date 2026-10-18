# 🎪 Dota 2 Dark Carnival · Ticket Codex & Smart Recommender

**[English](README.md) | [中文说明](README.zh-CN.md)**

[![Online Demo](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success?logo=github&style=for-the-badge)](https://islanddddddd.github.io/dota2-dark-carnival-helper/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](https://github.com/1207446924/dota2-dark-carnival-helper)

> 🌐 **Live Web App**: 👉 **[https://islanddddddd.github.io/dota2-dark-carnival-helper/](https://islanddddddd.github.io/dota2-dark-carnival-helper/)**

A modern, responsive helper built for the Dota 2 Dark Carnival event, powered by official Liquipedia ticket mappings (`Dark Carnival/Ticket Mapping`) and mathematical modeling of the "Pick 2 out of 3 on victory" drop mechanics.

---

## 🌟 Key Features

1. **📖 All-Hero Ticket Codex**
   - **All 127 Dota 2 Heroes Included**: Partitioned into Strength (36), Agility (35), Intelligence (34), and Universal (22).
   - **11 Themed Tarot Tickets**: Full representation of The Fool, The Magician, The High Priestess, The Devil, The Emperor, The Lovers, Strength, The Hermit, The Star, Wheel of Fortune, and Death.
   - **Multi-Dimensional Instant Search**: Search by hero English name, Chinese name, abbreviations/acronyms (e.g., `am`, `sf`, `pa`, `ck`, `qop`), and ticket names.
   - **High-Density Clean Cards**: Clean and compact card design showing avatar, attributes, and 3 fixed tickets with instant modal details.

2. **🎯 Real-Time Deficit Solver & Smart Recommendations**
   - **Streamlined Inventory & Demand Setup**: Effortlessly increment/decrement owned and target ticket counts with compact micro-steppers. Real-time net deficit calculation.
   - **Mathematical Expected Value Tiers**:
     - **🥇 Tier 1 (Perfect Match)**: All 3 tickets match active deficits. 100% useful yield regardless of drop (Expected 2.0 tickets/win, 0% waste).
     - **🥈 Tier 2 (High Efficiency)**: 2 of 3 tickets match active deficits. Guaranteed at least 1 needed ticket, 33.3% double hit (Expected 1.33 tickets/win).
     - **🥉 Tier 3 (Alternative Pick)**: 1 of 3 tickets match active deficits (Expected 0.67 tickets/win).
   - **Glow & Dim Visual Feedback**: Urgently needed tickets feature gold glowing borders and badges; fulfilled tickets are gracefully dimmed.
   - **🎲 Drop Simulation**: Test true 2-out-of-3 random drops on victory and dynamically update your inventory.

3. **🌓 Day / Night Mode & 🌐 Bilingual (EN / 中文) Support**
   - **Day & Night Themes**: Toggle seamlessly between dark carnival cyber aesthetics and ultra-clean light mode.
   - **Instant Internationalization**: Switch between English and Simplified Chinese with persistent preference storage in `localStorage`.

---

## 🚀 Quick Start

### Method 1: Online GitHub Pages (Recommended, No Installation)
Open the web app directly in any modern desktop or mobile browser:
👉 **[https://islanddddddd.github.io/dota2-dark-carnival-helper/](https://islanddddddd.github.io/dota2-dark-carnival-helper/)**

### Method 2: Standalone Single-File HTML (Zero Dependencies)
Double-click [`dark_carnival_helper.html`](./dark_carnival_helper.html) to run fully offline without any server or build step.

### Method 3: Local Development Server
```bash
# Give executable permissions and run
chmod +x start.sh
./start.sh

# Or start directly using Python
python3 -m http.server 8080
```
Open `http://localhost:8080/index.html` in your browser.

---

## 📂 Project Structure

```text
├── index.html                  # Responsive modern Web application entry point
├── app.js                      # Core business logic, solver, i18n & DOM rendering
├── data.js                     # Browser dataset for 127 heroes and 11 Tarot cards
├── dark_carnival_helper.html   # Standalone all-in-one HTML bundle for offline/portable use
├── start.sh                    # Quick local launcher script
├── data/                       # Structured JSON datasets & metadata
│   ├── heroes_data.json        # Unified 127 hero dataset with Tarot mappings
│   ├── heroes_raw.json         # Raw API hero metadata dump
│   ├── liquipedia_extracted.json # Extracted ticket mapping from Liquipedia
│   └── official_dota2_heroes.json # Official Valve hero definitions
├── scripts/                    # Build, bundle & data pipeline tools
│   ├── bundle_app.py           # Single-file HTML bundle generation tool
│   ├── make_files.py           # Generates data.js from data/heroes_data.json
│   ├── apply_liquipedia.py     # Synchronizes Liquipedia mappings into dataset
│   ├── enrich_aliases.py       # Pinyin & acronym search enricher
│   ├── generate_dataset.py     # Hero dataset builder
│   ├── build_web.py            # Quick dataset verification check
│   └── test_names.py           # Hero name coverage test
├── README.md                   # English documentation (Default)
└── README.zh-CN.md             # Chinese documentation (中文说明)
```

---

## 📜 Data Sources & Attribution
- Hero ticket mapping data sourced from [Liquipedia Dota 2: Dark Carnival Ticket Mapping](https://liquipedia.net/dota2/Dark_Carnival/Ticket_Mapping).
- Hero portrait assets served directly via Valve Dota 2 official CDN.
