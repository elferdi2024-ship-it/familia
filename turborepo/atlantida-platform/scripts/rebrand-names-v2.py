import os
import re

def replace_in_file(file_path, replacements):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    original_content = content
    for pattern, replacement in replacements:
        content = re.compile(pattern, re.IGNORECASE).sub(replacement, content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {file_path}")

def walk_and_replace(directory, replacements):
    for root, dirs, files in os.walk(directory):
        if any(d in root for d in ['node_modules', '.next', '.git']):
            continue
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.json', '.md', '.css', '.html', '.mjs', '.js')):
                file_path = os.path.join(root, file)
                replace_in_file(file_path, replacements)

# Portal Replacements
portal_replacements = [
    (r'DominioTotal', 'Barrio.uy'),
    (r'dominiototal\.uy', 'barrio.uy'),
    (r'dominiototal', 'barrio'),
]

# Inmobiliaria Replacements
# We use MiBarrio.uy for the display name and mibarrio for internal slugs/ids
inmobiliaria_replacements = [
    (r'Atlantida Group', 'MiBarrio.uy'),
    (r'AtlantidaGroup', 'MiBarrio'),
    (r'atlantida_favorites', 'mibarrio_favorites'),
    (r'leads_atlantida_group', 'leads_mibarrio'),
    (r'flotantes-atlantida', 'flotantes-mibarrio'),
    (r'atlantida-logo', 'mibarrio-logo'),
    (r'atlantida-isotype', 'mibarrio-isotype'),
]

# Special case for "atlantida" when not followed by a location name, but let's be careful.
# Most "atlantida group" mentions should be MiBarrio.uy

print("Starting Global Rebranding (Refined)...")

portal_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\portal'
inmobiliaria_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\inmobiliaria'

walk_and_replace(portal_path, portal_replacements)
walk_and_replace(inmobiliaria_path, inmobiliaria_replacements)

# Additional generic atlantida group replacement
walk_and_replace(inmobiliaria_path, [(r'atlantida group', 'MiBarrio.uy')])

print("Rebranding complete!")
