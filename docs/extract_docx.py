import zipfile
import re
import sys

def extract_docx(docx_path, txt_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
            # Extract text from w:t tags
            texts = re.findall(r'<w:t[^>]*>(.*?)</w:t>', xml_content)
            
            with open(txt_path, 'w', encoding='utf-8') as f:
                for text in texts:
                    f.write(text + '\n')
            print(f"Successfully extracted to {txt_path}")
    except Exception as e:
        print(f"Error: {e}")

extract_docx('d:/INMOBILIARIA/docs/AUDITORIA_INDEPENDIENTE_conmejoras.docx', 'd:/INMOBILIARIA/docs/auditoria_extracted.txt')
