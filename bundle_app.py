import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

with open(os.path.join(BASE_DIR, 'data.js'), 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(os.path.join(BASE_DIR, 'app.js'), 'r', encoding='utf-8') as f:
    app_js = f.read()

# Inline the scripts
bundle = html.replace(
    '<script src="data.js"></script>',
    f'<script>\n{data_js}\n</script>'
).replace(
    '<script src="app.js"></script>',
    f'<script>\n{app_js}\n</script>'
)

# Write to workspace
out_workspace = os.path.join(BASE_DIR, 'dark_carnival_helper.html')
with open(out_workspace, 'w', encoding='utf-8') as f:
    f.write(bundle)

print(f"Successfully generated single-file bundle: {out_workspace} ({len(bundle)} bytes)")
