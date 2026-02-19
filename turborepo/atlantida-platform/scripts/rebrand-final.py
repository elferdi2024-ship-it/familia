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

# PORTAL (Barrio.uy)
portal_replacements = [
    (r'DominioTotal', 'Barrio.uy'),
    (r'Atlantida Group', 'Barrio.uy'),
    (r'atlantidagroup\.uy', 'barrio.uy'),
    (r'atlantidagroup', 'barrio'),
    (r'atlantida-group', 'barrio'),
    (r'dominiototal\.uy', 'barrio.uy'),
    (r'dominiototal', 'barrio'),
    (r'atlantida_favorites', 'barrio_favorites'),
    (r'leads_atlantida_group', 'leads_barrio'),
    (r'atlantida-logo', 'barrio-logo'),
    (r'flotantes-atlantida', 'flotantes-barrio'),
]

# INMOBILIARIA (MiBarrio.uy)
inmobiliaria_replacements = [
    (r'DominioTotal', 'MiBarrio.uy'),
    (r'Atlantida Group', 'MiBarrio.uy'),
    (r'AtlantidaGroup', 'MiBarrio'),
    (r'atlantidagroup\.uy', 'mibarrio.uy'),
    (r'atlantidagroup', 'mibarrio'),
    (r'atlantida-group', 'mibarrio'),
    (r'dominiototal\.uy', 'mibarrio.uy'),
    (r'dominiototal', 'mibarrio'),
    (r'atlantida_favorites', 'mibarrio_favorites'),
    (r'leads_atlantida_group', 'leads_mibarrio'),
    (r'atlantida-logo', 'mibarrio-logo'),
    (r'flotantes-atlantida', 'mibarrio-flotantes'),
]

portal_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\portal'
inmobiliaria_path = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\inmobiliaria'

print("Final Comprehensive Rebranding...")
walk_and_replace(portal_path, portal_replacements)
walk_and_replace(inmobiliaria_path, inmobiliaria_replacements)
print("Complete!")
