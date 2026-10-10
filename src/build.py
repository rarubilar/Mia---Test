#!/usr/bin/env python3
"""Builds dist/index.html from index.src.html + css/*.css + js/*.js (files joined in name order).
Usage: python3 build.py        -> dist/index.html (standalone page, opens in any browser)
The JS files share one scope (wrapped in a single function), so they can use each other's names."""
import pathlib
root = pathlib.Path(__file__).parent
read = lambda p: p.read_text(encoding='utf-8')
css = '\n'.join(f'/* --- {p.name} --- */\n' + read(p) for p in sorted((root / 'css').glob('*.css')))
js = '\n'.join(f'/* --- {p.name} --- */\n' + read(p) for p in sorted((root / 'js').glob('*.js')))
page = read(root / 'index.src.html').replace('/*CSS*/', css).replace('/*JS*/', js)
head = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
page = head + page.replace('<style>', '<style>', 1)
# close head before the first canvas (markup starts there)
page = page.replace('<canvas id="waves"', '</head>\n<body>\n<canvas id="waves"', 1) + '</body>\n</html>\n'
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist' / 'index.html').write_text(page, encoding='utf-8')
print('built dist/index.html', len(page), 'bytes')
