import fitz  # New name for PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# def chunk_text(text, chunk_size, overlap):# Function to chunk text into smaller pieces
#     words = text.split()# Split text into words based on whitespace
#     chunks = []

#     for i in range(0, len(words), chunk_size - overlap): # Iterate over words with a step size of chunk_size - overlap
#         chunk = ' '.join(words[i:i + chunk_size]) # Join the words in the current chunk
#         chunks.append(chunk) # Append the chunk to a list
    
#     return chunks
#chunks = chunk_text(text, 300, 50) #example usage of the chunk_text function

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
text = extract_text_from_pdf("Ali's part.pdf") # Store the extracted text in a variable
chunks = text_splitter.split_text(text)


print(f"Total chunks created: {len(chunks)}")

for i in chunks:
    print(i)
    print("\n-------------------------------------------------------\n")

