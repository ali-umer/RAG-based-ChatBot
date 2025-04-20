import faiss
import pickle
import numpy as np
import json
from sentence_transformers import SentenceTransformer
import requests

# Load FAISS index and chunks
index = faiss.read_index("output_data/faiss.index")
with open("output_data/chunks.pkl", "rb") as f:
    chunks = pickle.load(f)

model = SentenceTransformer("./all-MiniLM-L6-v2")

query = input("Ask a question about the university prospectus:\n> ")

# Encode the query
query_embedding = model.encode([query]).astype("float32")

# Search vector space for relevant chunks
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

# Stream response from Mistral (Ollama)
print("\n🧠 Mistral's Answer:\n")


response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "mistral",
        "prompt": prompt,
        "stream": True
    },
    stream=True
)

# Print each token as it arrives
for line in response.iter_lines():
    if line:
        try:
            data = json.loads(line.decode("utf-8"))
            if "response" in data:
                print(data["response"], end="", flush=True)
        except Exception as e:
            pass