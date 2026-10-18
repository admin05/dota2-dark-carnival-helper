import os

WORKSPACE_DIR = "/Users/a120744/Documents/dota2 暗黑狂欢"
ARTIFACT_DIR = "/Users/a120744/.gemini/antigravity/brain/87fc0547-71ec-49ae-8e21-0695cb6f0507"

with open(os.path.join(WORKSPACE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

with open(os.path.join(WORKSPACE_DIR, 'data.js'), 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(os.path.join(WORKSPACE_DIR, 'app.js'), 'r', encoding='utf-8') as f:
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
out_workspace = os.path.join(WORKSPACE_DIR, 'dark_carnival_helper.html')
with open(out_workspace, 'w', encoding='utf-8') as f:
    f.write(bundle)

# Write to artifacts
out_artifact = os.path.join(ARTIFACT_DIR, 'dark_carnival_helper.html')
os.makedirs(ARTIFACT_DIR, exist_ok=True)
with open(out_artifact, 'w', encoding='utf-8') as f:
    f.write(bundle)

print(f"Successfully generated single-file bundle! Size: {len(bundle)} bytes")
