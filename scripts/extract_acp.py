# -*- coding: utf-8 -*-
import zipfile, re

path = r"C:\Users\Usuario\Downloads\ACP_Vasquez_Augusto_Reyes_Renato.docx"
out_path = r"C:\Users\Usuario\Sinapsistencia\scripts\acp_text.txt"

with zipfile.ZipFile(path) as z:
    with z.open("word/document.xml") as f:
        xml = f.read().decode("utf-8")

text = re.sub(r'<w:br[^/]*/>', '\n', xml)
text = re.sub(r'</w:p>', '\n', text)
text = re.sub(r'<[^>]+>', '', text)
text = re.sub(r'\n{3,}', '\n\n', text).strip()

with open(out_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Done. Lines:", text.count('\n'), "Chars:", len(text))
