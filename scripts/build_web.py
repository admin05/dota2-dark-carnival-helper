import os
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(ROOT_DIR, 'data', 'heroes_data.json')

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Loaded {len(heroes)} heroes from {DATA_FILE} successfully.")
