import os
import re

# Project root is the parent directory of scripts/
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(ROOT_DIR, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

with open(os.path.join(ROOT_DIR, 'data.js'), 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(os.path.join(ROOT_DIR, 'app.js'), 'r', encoding='utf-8') as f:
    app_js = f.read()

# Inline the scripts into a standalone distribution bundle.
# Use callable replacements so backslashes in JavaScript strings (for example
# `\\n`) are copied literally instead of being interpreted by re.sub.
bundle = re.sub(
    r'<script src="data\.js[^"]*"></script>',
    lambda _: f'<script>\n{data_js}\n</script>',
    html
)
bundle = re.sub(
    r'<script src="app\.js[^"]*"></script>',
    lambda _: f'<script>\n{app_js}\n</script>',
    bundle
)

# Write to project root
out_workspace = os.path.join(ROOT_DIR, 'dark_carnival_helper.html')
with open(out_workspace, 'w', encoding='utf-8') as f:
    f.write(bundle)

print(f"Successfully generated single-file bundle: {out_workspace} ({len(bundle)} bytes)")
