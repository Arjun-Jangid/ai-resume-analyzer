from pathlib import Path
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

_SKILLS_FILE = Path(__file__).resolve().parent / "skills_data.txt"


class RAG:
    def __init__(self):
        # Load embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Read skills data (path works no matter which folder you run uvicorn from)
        with open(_SKILLS_FILE, "r", encoding="utf-8") as f:
            self.skills = f.readlines()

        self.skills = [skill.strip() for skill in self.skills]

        # Convert skills to embeddings
        self.embeddings = self.model.encode(self.skills)

        # Create FAISS index
        dimension = self.embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(self.embeddings, dtype=np.float32))

    def retrieve_skills(self, query, top_k=3):
        # User query (Job Description)
        query_embedding = self.model.encode([query])

        # Search top k similar skills
        D, I = self.index.search(
            np.array(query_embedding, dtype=np.float32),
            k=top_k,
        )

        retrived_skills = [self.skills[i] for i in I[0]]
        return retrived_skills


# One shared instance for the API (same idea as before)
rag = RAG()
