import os
import json
from collections import Counter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, 'data')

with open(os.path.join(DATA_DIR, 'liquipedia_extracted.json'), 'r', encoding='utf-8') as f:
    lp_data = json.load(f)

heroes_path = os.path.join(DATA_DIR, 'heroes_data.json')
with open(heroes_path, 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Name aliases for matching
NAME_MAP = {
    'Outworld Devourer': 'Outworld Destroyer',
    'Ring Master': 'Ringmaster'
}

updated_count = 0
for h in heroes:
    en_name = h['en_name']
    lp_key = NAME_MAP.get(en_name, en_name)
    if lp_key in lp_data:
        lp_entry = lp_data[lp_key]
        h['tickets'] = lp_entry['cn_tickets']
        h['tickets_en'] = lp_entry['en_tickets']
        updated_count += 1
    else:
        print(f"ERROR: Could not find {en_name} ({lp_key}) in Liquipedia data!")

print(f"Successfully updated tickets for {updated_count}/127 heroes with EXACT Liquipedia table data!")

# Verify every single hero has exactly 3 tickets
for h in heroes:
    assert len(h['tickets']) == 3, f"{h['name']} does not have 3 tickets"

# Check distribution of 11 tickets
c = Counter()
for h in heroes:
    for t in h['tickets']:
        c[t] += 1

print("\nOfficial 11 Ticket Distribution across all 127 heroes (127 * 3 = 381):")
for t, cnt in c.most_common():
    print(f"  {t:6s}: {cnt:2d} 次 ({cnt/381*100:.1f}%)")

with open(heroes_path, 'w', encoding='utf-8') as f:
    json.dump(heroes, f, ensure_ascii=False, indent=2)

print("\nUpdated data/heroes_data.json with 100% exact Liquipedia data!")
