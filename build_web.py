import json

with open('heroes_data.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Loaded {len(heroes)} heroes for web generation.")
