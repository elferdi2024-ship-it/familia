import os
import re

def replace_in_file(file_path, replacements):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        # Skip binary files or reading errors
        return

    original_content = content
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {file_path}")

def walk_and_replace(directory, replacements):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.json', '.md', '.css', '.html', '.mjs', '.js')):
                file_path = os.path.join(root, file)
                replace_in_file(file_path, replacements)

# Portal Replacements
portal_replacements = [
    (r'DominioTotal', 'Barrio.uy'),
    (r'dominiototal\.uy', 'barrio.uy'),
    (r'dominiototal\.com', 'barrio.uy'),
    (r'dominiototal', 'barrio'),
]

# Inmobiliaria Replacements
inmobiliaria_replacements = [
    (r'Atlantida Group', 'MiBarrio.uy'),
    (r'ATLANTIDA GROUP', 'MIBARRIO.UY'),
    (r'atlantidagroup\.uy', 'mibarrio.uy'),
    (r'atlantidagroup', 'mibarrio'),
    (r'atlantida-group', 'mibarrio'),
    (r'atlantida-logo', 'mibarrio-logo'), # For logo filenames in references
    (r'atlantida-isotype', 'mibarrio-isotype'),
]

print("Starting Global Rebranding...")

portal_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\portal'
inmobiliaria_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\inmobiliaria'

print(f"Processing Portal at {portal_path}...")
walk_and_replace(portal_path, portal_replacements)

print(f"Processing Inmobiliaria at {inmobiliaria_path}...")
walk_and_replace(inmobiliaria_path, inmobiliaria_replacements)

# Also check packages/ui for any hardcoded strings
ui_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\packages\ui'
print(f"Processing UI Package at {ui_path}...")
walk_and_replace(ui_path, portal_replacements) # Use portal as fallback for generic strings
walk_and_replace(ui_path, inmobiliaria_replacements)

print("Rebranding complete!")
