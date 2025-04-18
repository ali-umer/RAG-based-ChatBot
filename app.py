import fitz  # New name for PyMuPDF

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

text = extract_text_from_pdf("Ali's part.pdf")

print(text)