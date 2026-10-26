import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open('src/services/quranLexicon.ts', encoding='utf-8') as f:
    text = f.read()

roots = re.findall(r'root:\s*[\'"](.*?)[\'"]', text)
print(f'Total roots found: {len(roots)}')
for r in set(roots):
    print('  ', repr(r))
