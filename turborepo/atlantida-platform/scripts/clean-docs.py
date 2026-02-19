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
        for file in files:
            if file.endswith('.md'):
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
                    print(f"Error reading {file}: {e}")

                # Rename file if it contains the old names
                new_filename = replace_in_string(file)
                if new_filename != file:
                    new_file_path = os.path.join(root, new_filename)
                    # Check if target exists
                    if os.path.exists(new_file_path):
                        print(f"Skipping rename {file} -> {new_filename} (target exists)")
                    else:
                        os.rename(file_path, new_file_path)
                        print(f"Renamed file: {file} -> {new_filename}")

# Target directory
docs_path = r'd:\INMOBILIARIA\docs'
print(f"Cleaning up documentation in {docs_path}...")
process_docs(docs_path)

# Also do a final pass on the entire turborepo to be extra sure
repo_path = r'd:\INMOBILIARIA\turborepo'
print(f"Final pass on {repo_path}...")
process_docs(repo_path)

print("Cleanup complete!")
