from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


_SKILLS_FILE = Path(__file__).resolve().parent / "skills_data.txt"


class RAG:
    def __init__(self):

        with open(_SKILLS_FILE, "r", encoding="utf-8") as f:
            self.skills = f.readlines()

        self.vectorizer = TfidfVectorizer()
        self.skill_vectors = self.vectorizer.fit_transform(
            self.skills
        )

    def retrieve_skills(self, query, top_k=3):
        query_vector = self.vectorizer.transform([query])

        similarities = cosine_similarity(
            query_vector,
            self.skill_vectors
        ).flatten()

        top_indices = similarities.argsort()[-top_k:][::-1]
        return [self.skills[i] for i in top_indices]


rag = RAG()
