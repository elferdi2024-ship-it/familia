import os
import re

def replace_in_string(text):
    # Order matters: replace longer/more specific strings first
    text = re.compile(r'DominioTotal', re.IGNORECASE).sub('Barrio.uy', text)
    text = re.compile(r'dominiototal\.uy', re.IGNORECASE).sub('barrio.uy', text)
    text = re.compile(r'dominiototal', re.IGNORECASE).sub('barrio', text)
    
    text = re.compile(r'Atlantida Group', re.IGNORECASE).sub('MiBarrio.uy', text)
    text = re.compile(r'atlantidagroup\.uy', re.IGNORECASE).sub('mibarrio.uy', text)
    text = re.compile(r'atlantidagroup', re.IGNORECASE).sub('mibarrio', text)
    text = re.compile(r'atlantida-group', re.IGNORECASE).sub('mibarrio', text)
    return text

def process_docs(directory):
    for root, dirs, files in os.walk(directory):
        if any(d in root for d in ['node_modules', '.next', '.git']):
            continue
        for file in files:
            # Case insensitive extension check
            if file.lower().endswith(('.md', '.sh', '.ts', '.tsx', '.json', '.html')):
                file_path = os.path.join(root, file)
                
                # Replace content
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = replace_in_string(content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated content: {file}")
                except Exception as e:
                    # Could be encoding issue, skip
                    pass

                # Rename file if it contains the old names (only for MD files to be safe)
                if file.lower().endswith('.md'):
                    new_filename = replace_in_string(file)
                    if new_filename != file:
                        new_file_path = os.path.join(root, new_filename)
                        if not os.path.exists(new_file_path):
                            os.rename(file_path, new_file_path)
                            print(f"Renamed file: {file} -> {new_filename}")

# Target directories
paths = [r'd:\INMOBILIARIA\docs', r'd:\INMOBILIARIA\turborepo']
for p in paths:
    print(f"Cleaning up {p}...")
    process_docs(p)

print("Cleanup complete!")
