import json

CHINESE_NAMES = {
    "antimage": "敌法师", "axe": "斧王", "bane": "祸乱之源", "bloodseeker": "血魔", "crystal_maiden": "水晶室女",
    "drow_ranger": "卓尔游侠", "earthshaker": "撼地者", "juggernaut": "主宰", "mirana": "米拉娜", "morphling": "变体精灵",
    "nevermore": "影魔", "phantom_lancer": "幻影长矛手", "puck": "帕克", "pudge": "帕吉", "razor": "剃刀",
    "sand_king": "沙王", "storm_spirit": "风暴之灵", "sven": "斯温", "tiny": "小小", "vengefulspirit": "复仇之魂",
    "windrunner": "风行者", "zuus": "宙斯", "kunkka": "昆卡", "lina": "莉娜", "lion": "莱恩",
    "shadow_shaman": "暗影萨满", "slardar": "斯拉达", "tidehunter": "潮汐猎人", "witch_doctor": "巫医", "lich": "巫妖",
    "riki": "力丸", "enigma": "谜团", "tinker": "修补匠", "sniper": "狙击手", "necrolyte": "瘟疫法师",
    "warlock": "术士", "beastmaster": "兽王", "queenofpain": "痛苦女王", "venomancer": "剧毒术士", "faceless_void": "虚空假面",
    "skeleton_king": "冥魂大帝", "death_prophet": "死亡先知", "phantom_assassin": "幻影刺客", "pugna": "帕格纳", "templar_assassin": "圣堂刺客",
    "viper": "冥界亚龙", "luna": "露娜", "dragon_knight": "龙骑士", "dazzle": "戴泽", "rattletrap": "发条技师",
    "leshrac": "拉席克", "furion": "先知", "life_stealer": "噬魂鬼", "dark_seer": "黑暗贤者", "clinkz": "克林克兹",
    "omniknight": "全能骑士", "enchantress": "魅惑魔女", "huskar": "哈斯卡", "night_stalker": "暗夜魔王", "broodmother": "育母蜘蛛",
    "bounty_hunter": "赏金猎人", "weaver": "编织者", "jakiro": "杰奇洛", "batrider": "蝙蝠骑士", "chen": "陈",
    "spectre": "幽鬼", "ancient_apparition": "远古冰魄", "doom_bringer": "末日使者", "ursa": "熊战士", "spirit_breaker": "裂魂人",
    "gyrocopter": "矮人直升机", "alchemist": "炼金术士", "invoker": "祈求者", "silencer": "沉默术士", "obsidian_destroyer": "殁境神蚀者",
    "lycan": "狼人", "brewmaster": "酒仙", "shadow_demon": "暗影恶魔", "lone_druid": "德鲁伊", "chaos_knight": "混沌骑士",
    "meepo": "米波", "treant": "树精卫士", "ogre_magi": "食人魔魔法师", "undying": "不朽尸王", "rubick": "拉比克",
    "disruptor": "干扰者", "nyx_assassin": "司夜刺客", "naga_siren": "娜迦海妖", "keeper_of_the_light": "光之守卫", "wisp": "艾欧",
    "visage": "维萨吉", "slark": "斯拉克", "medusa": "美杜莎", "troll_warlord": "巨魔战将", "centaur": "半人马战行者",
    "magnataur": "马格纳斯", "shredder": "伐木机", "bristleback": "刚背兽", "tusk": "巨牙海民", "skywrath_mage": "天怒法师",
    "abaddon": "亚巴顿", "elder_titan": "上古巨神", "legion_commander": "军团指挥官", "techies": "工程师", "earth_spirit": "大地之灵",
    "abyssal_underlord": "孽主", "terrorblade": "恐怖利刃", "phoenix": "凤凰", "oracle": "神谕者", "winter_wyvern": "寒冬飞龙",
    "arc_warden": "天穹守望者", "monkey_king": "齐天大圣", "dark_willow": "邪影芳灵", "pangolier": "石鳞剑士", "grimstroke": "天涯墨客",
    "hoodwink": "森海飞霞", "void_spirit": "虚空之灵", "snapfire": "电炎绝手", "mars": "玛尔斯", "dawnbreaker": "破晓辰星",
    "marci": "玛西", "primal_beast": "原始野兽", "muerta": "琼英碧灵", "ringmaster": "百戏大王", "ember_spirit": "灰烬之灵",
    "kez": "凯", "largo": "拉尔戈"
}

# Explicit curated anchors
ANCHORS = {
    "muerta": ["死神", "审判", "女祭司"],
    "chaos_knight": ["命运之轮", "战车", "恶魔"],
    "keeper_of_the_light": ["星星", "太阳", "教皇"],
    "abaddon": ["隐士", "死神", "倒吊人"],
    "sven": ["力量", "正义", "战车"],
    "jakiro": ["恋人", "节制", "世界"],
    "skeleton_king": ["皇帝", "死神", "力量"],
    "doom_bringer": ["恶魔", "审判", "皇帝"],
    "oracle": ["女祭司", "命运之轮", "审判"],
    "wisp": ["愚者", "星星", "世界"],
    "rubick": ["魔术师", "愚者", "世界"],
    "ringmaster": ["魔术师", "恶魔", "命运之轮"],
    "hoodwink": ["愚者", "恋人", "星星"],
    "legion_commander": ["战车", "正义", "力量"],
    "invoker": ["魔术师", "世界", "皇帝"],
    "axe": ["力量", "战车", "皇帝"],
    "antimage": ["节制", "正义", "力量"],
    "nevermore": ["恶魔", "死神", "倒吊人"],
    "phantom_assassin": ["死神", "隐士", "命运之轮"],
    "pudge": ["恶魔", "倒吊人", "力量"],
    "crystal_maiden": ["月亮", "隐士", "女祭司"],
    "lina": ["太阳", "战车", "女皇"],
    "zuus": ["皇帝", "太阳", "审判"],
    "tidehunter": ["力量", "倒吊人", "隐士"],
    "lion": ["恶魔", "倒吊人", "魔术师"],
    "witch_doctor": ["死神", "女祭司", "隐士"],
    "lich": ["死神", "倒吊人", "恶魔"],
    "drow_ranger": ["隐士", "月亮", "节制"],
    "morphling": ["节制", "魔术师", "恋人"],
    "spectre": ["月亮", "倒吊人", "死神"],
    "templar_assassin": ["女祭司", "隐士", "审判"],
    "ursa": ["力量", "战车", "审判"],
    "viper": ["恶魔", "节制", "死神"],
    "slark": ["隐士", "愚者", "倒吊人"],
    "medusa": ["高塔", "女皇", "倒吊人"],
    "terrorblade": ["恶魔", "倒吊人", "力量"],
    "puck": ["愚者", "星星", "魔术师"],
    "storm_spirit": ["愚者", "战车", "太阳"],
    "tinker": ["世界", "魔术师", "命运之轮"],
    "silencer": ["节制", "女祭司", "正义"],
    "death_prophet": ["死神", "女皇", "倒吊人"],
    "necrolyte": ["死神", "皇帝", "倒吊人"],
    "warlock": ["恶魔", "教皇", "隐士"],
    "enigma": ["世界", "高塔", "隐士"],
    "marci": ["力量", "节制", "恋人"],
    "mirana": ["月亮", "女祭司", "星星"],
    "phoenix": ["太阳", "世界", "审判"],
    "techies": ["高塔", "愚者", "命运之轮"],
    "shredder": ["高塔", "战车", "倒吊人"],
    "vengefulspirit": ["正义", "月亮", "倒吊人"],
    "windrunner": ["星星", "恋人", "战车"],
    "winter_wyvern": ["女祭司", "节制", "月亮"],
    "lycan": ["月亮", "皇帝", "力量"],
    "magnataur": ["战车", "力量", "审判"],
    "void_spirit": ["隐士", "世界", "正义"],
    "visage": ["死神", "审判", "高塔"],
    "bane": ["倒吊人", "恶魔", "月亮"],
    "brewmaster": ["节制", "恋人", "力量"],
    "kez": ["正义", "愚者", "战车"],
    "juggernaut": ["正义", "力量", "隐士"],
    "earthshaker": ["高塔", "力量", "正义"],
    "tiny": ["力量", "高塔", "战车"],
    "kunkka": ["战车", "命运之轮", "皇帝"],
    "shadow_shaman": ["教皇", "女祭司", "倒吊人"],
    "slardar": ["战车", "力量", "审判"],
    "riki": ["隐士", "愚者", "死神"],
    "sniper": ["正义", "隐士", "高塔"],
    "beastmaster": ["力量", "皇帝", "恋人"],
    "queenofpain": ["恶魔", "女皇", "恋人"],
    "venomancer": ["恶魔", "节制", "隐士"],
    "faceless_void": ["世界", "命运之轮", "隐士"],
    "pugna": ["死神", "恶魔", "倒吊人"],
    "luna": ["月亮", "战车", "女皇"],
    "dragon_knight": ["力量", "战车", "皇帝"],
    "dazzle": ["教皇", "死神", "女祭司"],
    "rattletrap": ["战车", "高塔", "世界"],
    "leshrac": ["高塔", "恶魔", "审判"],
    "furion": ["世界", "皇帝", "节制"],
    "life_stealer": ["恶魔", "力量", "倒吊人"],
    "dark_seer": ["魔术师", "隐士", "正义"],
    "clinkz": ["死神", "战车", "隐士"],
    "omniknight": ["教皇", "正义", "力量"],
    "enchantress": ["女皇", "恋人", "节制"],
    "huskar": ["倒吊人", "力量", "死神"],
    "night_stalker": ["月亮", "恶魔", "力量"],
    "broodmother": ["女皇", "隐士", "高塔"],
    "bounty_hunter": ["命运之轮", "隐士", "正义"],
    "weaver": ["命运之轮", "世界", "愚者"],
    "batrider": ["太阳", "战车", "恶魔"],
    "chen": ["教皇", "皇帝", "正义"],
    "ancient_apparition": ["死神", "隐士", "节制"],
    "spirit_breaker": ["战车", "命运之轮", "力量"],
    "gyrocopter": ["战车", "高塔", "愚者"],
    "alchemist": ["命运之轮", "节制", "力量"],
    "obsidian_destroyer": ["高塔", "审判", "世界"],
    "shadow_demon": ["恶魔", "倒吊人", "教皇"],
    "lone_druid": ["恋人", "皇帝", "隐士"],
    "meepo": ["恋人", "愚者", "高塔"],
    "treant": ["世界", "节制", "力量"],
    "ogre_magi": ["命运之轮", "愚者", "力量"],
    "undying": ["死神", "高塔", "力量"],
    "disruptor": ["审判", "战车", "正义"],
    "nyx_assassin": ["恶魔", "隐士", "正义"],
    "naga_siren": ["女皇", "恋人", "月亮"],
    "centaur": ["力量", "战车", "正义"],
    "bristleback": ["力量", "战车", "倒吊人"],
    "tusk": ["力量", "愚者", "战车"],
    "skywrath_mage": ["恋人", "星星", "审判"],
    "elder_titan": ["世界", "教皇", "力量"],
    "earth_spirit": ["节制", "力量", "隐士"],
    "abyssal_underlord": ["高塔", "恶魔", "力量"],
    "arc_warden": ["世界", "恋人", "审判"],
    "monkey_king": ["愚者", "战车", "魔术师"],
    "dark_willow": ["月亮", "魔术师", "恋人"],
    "pangolier": ["战车", "恋人", "魔术师"],
    "grimstroke": ["魔术师", "死神", "倒吊人"],
    "snapfire": ["太阳", "恋人", "战车"],
    "mars": ["战车", "皇帝", "力量"],
    "dawnbreaker": ["太阳", "正义", "力量"],
    "primal_beast": ["力量", "高塔", "恶魔"],
    "ember_spirit": ["节制", "战车", "太阳"],
    "largo": ["力量", "愚者", "战车"]
}

with open('heroes_raw.json') as f:
    raw_heroes = json.load(f)

heroes_list = []
for h in raw_heroes.values():
    sname = h['name'].replace('npc_dota_hero_', '')
    cn_name = CHINESE_NAMES.get(sname, h['localized_name'])
    en_name = h['localized_name']
    attr = h['primary_attr']
    
    # Get tickets
    if sname in ANCHORS:
        tickets = ANCHORS[sname]
    else:
        # Fallback pool based on attr
        if attr == 'str':
            tickets = ["力量", "战车", "正义"]
        elif attr == 'agi':
            tickets = ["隐士", "战车", "节制"]
        elif attr == 'int':
            tickets = ["魔术师", "女祭司", "世界"]
        else:
            tickets = ["世界", "恋人", "命运之轮"]
            
    img_url = f"https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{sname}.png"
    
    heroes_list.append({
        "id": h['id'],
        "key": sname,
        "name": cn_name,
        "en_name": en_name,
        "attr": attr,
        "tickets": tickets,
        "img": img_url,
        "roles": h.get('roles', [])
    })

print(f"Total processed heroes: {len(heroes_list)}")

# Verify all tickets are from valid 22 tarot cards
ALL_CARDS = set([
    "愚者", "魔术师", "女祭司", "女皇", "皇帝", "教皇", "恋人", "战车", "力量", "隐士",
    "命运之轮", "正义", "倒吊人", "死神", "节制", "恶魔", "高塔", "星星", "月亮", "太阳",
    "审判", "世界"
])

used_cards = set()
for h in heroes_list:
    assert len(h['tickets']) == 3, f"{h['name']} does not have 3 tickets"
    for t in h['tickets']:
        assert t in ALL_CARDS, f"Invalid ticket {t} in {h['name']}"
        used_cards.add(t)

print(f"Cards used: {len(used_cards)}/22 -> {sorted(list(used_cards))}")

with open('heroes_data.json', 'w', encoding='utf-8') as f:
    json.dump(heroes_list, f, ensure_ascii=False, indent=2)

print("Saved heroes_data.json successfully!")
