#!/usr/bin/env python3
"""Verify Vortex Digital's 18 portfolio images using the local asset manifest."""
from pathlib import Path
import hashlib,json,sys
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'PORTFOLIO_ASSET_MANIFEST.json').read_text(encoding='utf-8'))
assert len(m['projects']) == 6 and m['imageCount'] == 18
paths=[]; errors=[]
for p in m['projects']:
    assert len(p['media'])==3, p['slug']
    for a in p['media']:
        path=root/'public'/a['public_url'].lstrip('/')
        paths.append(str(path))
        if not path.is_file(): errors.append(f'MISSING: {path}')
        elif hashlib.sha256(path.read_bytes()).hexdigest()!=a['sha256']: errors.append(f'HASH MISMATCH: {path}')
if len(set(paths)) != 18: errors.append('Image paths are not unique')
if errors:
    print('\n'.join(errors),file=sys.stderr)
    sys.exit(1)
print('PASS: 6 projects, 18 distinct image paths, 18 files found, hashes matched.')
