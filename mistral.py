import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
import requests

# Load FAISS index and chunks
index = faiss.read_index("faiss.index")
with open("chunks.pkl", "rb") as f:
    chunks = pickle.load(f)

# Load sentence transformer model (offline)
model = SentenceTransformer("./all-MiniLM-L6-v2")

# Get user question
query = input("Ask a question about the university prospectus:\n> ")

# Encode the query
query_embedding = model.encode([query]).astype("float32")

# Search FAISS for relevant chunks
k = 3
_, indices = index.search(query_embedding, k)
top_chunks = [chunks[i] for i in indices[0]]

# Combine retrieved chunks into a single context
context = "\n\n".join(top_chunks)

# Construct prompt for Mistral
prompt = f"""You are a helpful assistant answering questions based on the university prospectus. Use the context to answer the question.

Context:
{context}

Question:
{query}

Answer:"""

# Send prompt to Mistral (Ollama)
response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }
)

# Show the response
print("\n🧠 Mistral's Answer:\n")
print(response.json()["response"])