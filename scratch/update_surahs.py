import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update 001.json
p1 = os.path.join('public', 'data', 'surahs', '001.json')
with open(p1, 'r', encoding='utf-8') as f:
    d1 = json.load(f)

for s in d1['sections']:
    if s['id'] == '1-1-4':
        s['translation'] = (
            "In the name of Allah, the [Rahman] (All-Beneficent), the [Rahim] (All-Merciful). ۝ "
            "All praise belongs exclusively to Allah, the [Rabb] (Lord and Cherisher) of all the worlds. ۝ "
            "The All-Beneficent, the All-Merciful. ۝ "
            "Master and Sovereign Ruler of the Day of Recompense. ۝"
        )
    elif s['id'] == '1-5-7':
        s['translation'] = (
            "You alone do we worship ('[Ibadah]'), and from You alone do we solicit help ([Isti'anah]). ۝ "
            "Guide us to the [Sirat al-Mustaqim] (the Straight and Level Path). ۝ "
            "The path of those upon whom You have bestowed Your favor, not of those who have evoked Your wrath ([Maghdub]), "
            "nor of those who have strayed into errancy ([Dallin]). ۝"
        )

with open(p1, 'w', encoding='utf-8') as f:
    json.dump(d1, f, ensure_ascii=False, indent=2)

# 2. Update 112.json
p112 = os.path.join('public', 'data', 'surahs', '112.json')
with open(p112, 'r', encoding='utf-8') as f:
    d112 = json.load(f)

for s in d112['sections']:
    if s['id'] == '112-1-4':
        s['translation'] = (
            "Say: 'He is Allah, the [Ahad] (The Absolutely One and Indivisible). ۝ "
            "Allah, [As-Samad] (The Eternal, Self-Sufficient Refuge upon whom all depend). ۝ "
            "He neither begets nor is He begotten. ۝ "
            "And there is none comparable or equal unto Him.' ۝"
        )

with open(p112, 'w', encoding='utf-8') as f:
    json.dump(d112, f, ensure_ascii=False, indent=2)

# 3. Update 114.json
p114 = os.path.join('public', 'data', 'surahs', '114.json')
with open(p114, 'r', encoding='utf-8') as f:
    d114 = json.load(f)

for s in d114['sections']:
    if s['id'] == '114-1-6':
        s['translation'] = (
            "Say: 'I seek refuge with the [Rabb] (Lord and Cherisher) of mankind. ۝ "
            "The Sovereign King of mankind. ۝ "
            "The True God and Object of Worship of mankind. ۝ "
            "From the malice of the retreating whisperer ([Al-Waswas Al-Khannas]), ۝ "
            "who casts insidious suggestions into the hearts of mankind— ۝ "
            "from among jinn and men.' ۝"
        )

with open(p114, 'w', encoding='utf-8') as f:
    json.dump(d114, f, ensure_ascii=False, indent=2)

print("Successfully updated 001.json, 112.json, and 114.json!")
