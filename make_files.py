import json

with open('heroes_data.json', 'r', encoding='utf-8') as f:
    heroes_data = json.load(f)

# The 11 official Dark Carnival tickets from Liquipedia
tarot_cards = [
    {"id": "fool", "name": "愚者", "en": "The Fool", "icon": "🃏", "color": "#f59e0b", "desc": "新生与初始，无拘无束"},
    {"id": "magician", "name": "魔术师", "en": "The Magician", "icon": "🪄", "color": "#a855f7", "desc": "变化与戏法，创造掌控"},
    {"id": "priestess", "name": "女祭司", "en": "The High Priestess", "icon": "🔮", "color": "#38bdf8", "desc": "内在智慧，预言灵性"},
    {"id": "devil", "name": "恶魔", "en": "The Devil", "icon": "😈", "color": "#dc2626", "desc": "深渊欲望，狂野契约"},
    {"id": "emperor", "name": "皇帝", "en": "The Emperor", "icon": "🏛️", "color": "#ef4444", "desc": "王权统治，秩序威严"},
    {"id": "lovers", "name": "恋人", "en": "The Lovers", "icon": "❤️", "color": "#f43f5e", "desc": "协同羁绊，双生契约"},
    {"id": "strength", "name": "力量", "en": "Strength", "icon": "⚔️", "color": "#f97316", "desc": "刚猛坚韧，无畏战力"},
    {"id": "hermit", "name": "隐士", "en": "The Hermit", "icon": "🏮", "color": "#94a3b8", "desc": "沉思隐匿，迷雾探索"},
    {"id": "star", "name": "星星", "en": "The Star", "icon": "⭐", "color": "#0ea5e9", "desc": "璀璨希望，原初之光"},
    {"id": "wheel", "name": "命运之轮", "en": "Wheel of Fortune", "icon": "☸️", "color": "#14b8a6", "desc": "机缘时运，因果循环"},
    {"id": "death", "name": "死神", "en": "Death", "icon": "☠️", "color": "#c084fc", "desc": "旧日终结，灵界更替"}
]

with open('data.js', 'w', encoding='utf-8') as f:
    f.write('const HEROES_DATA = ' + json.dumps(heroes_data, ensure_ascii=False) + ';\n')
    f.write('const TAROT_CARDS = ' + json.dumps(tarot_cards, ensure_ascii=False) + ';\n')

print(f"Generated data.js with {len(heroes_data)} heroes and {len(tarot_cards)} tickets!")
