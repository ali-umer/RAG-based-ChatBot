import fitz  # New name for PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

INDEX_FILE = "faiss.index"
CHUNKS_FILE = "chunks.pkl"
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

# This saves the model locally and runs it offline
# Uncomment the following two lines and comment the next line when running for the first time
# model = SentenceTransformer("all-MiniLM-L6-v2")  # Lightweight and popular
# model.save("./all-MiniLM-L6-v2")
model = SentenceTransformer("./all-MiniLM-L6-v2")
embeddings = model.encode(chunks)

embedding_matrix = np.array(embeddings).astype("float32")

dimension = embedding_matrix.shape[1]
index = faiss.IndexFlatL2(dimension)

# Add embeddings
index.add(embedding_matrix)

faiss.write_index(index, INDEX_FILE)
with open(CHUNKS_FILE, "wb") as f:
    pickle.dump(chunks, f)
