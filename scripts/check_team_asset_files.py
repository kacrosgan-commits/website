#!/usr/bin/env python3
"""Run from your website project root: python scripts/check_team_asset_files.py"""
from pathlib import Path
import json
import sys
root=Path.cwd()
manifest=root/'ASSET_MANIFEST.json'
if not manifest.exists():
    sys.exit('ERROR: ASSET_MANIFEST.json missing from project root. Extract ZIP at the actual app root.')
data=json.loads(manifest.read_text(encoding='utf-8'))
paths=[]
for m in data['members']:
    paths.append((m['role'], m['portrait']['path']))
    paths.extend((m['role'], w['path']) for w in m['workImages'])
seen=set()
fail=[]
for role,path in paths:
    file=root/'public'/path.lstrip('/')
    if path in seen:
        fail.append((role,path,'DUPLICATE PATH'))
    seen.add(path)
    if not file.is_file():
        fail.append((role,path,'MISSING'))
    elif file.stat().st_size<128 or file.open('rb').read(4)!=b'RIFF':
        fail.append((role,path,'EMPTY/INVALID WEBP'))
print(f'Expected: 27; listed: {len(paths)}; unique: {len(seen)}; file checks passed: {len(paths)-len(fail)}')
if fail:
    for x in fail: print('ERROR:', *x)
    sys.exit(1)
if len(paths)!=27 or len(seen)!=27:
    sys.exit('ERROR: Exactly 27 image paths required.')
print('PASS: all 27 individual WebP files are physically present. Browser visibility must still be verified.')
