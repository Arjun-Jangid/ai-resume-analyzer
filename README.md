# AI Resume Analyzer

Simple full-stack app: **FastAPI** backend + **React / TypeScript / Vite** frontend, with **Ollama** and a small **RAG** skills list.

## Folder layout

```
backend/
  main.py          # FastAPI app + CORS
  routes.py        # HTTP endpoints (/match-job, /chat)
  prompts.py       # Long LLM prompt strings (easier to read than inline)
  pdf_parser.py    # PDF → text
  rag.py           # Skill embeddings + lookup
  model.py         # Ollama HTTP client
  skills_data.txt
  requirements.txt

frontend/
  src/
    App.tsx              # Page layout + analyze flow
    components/
      Chat.tsx           # Chat UI
      Chat.css
      SkillsResults.tsx # Match score table
    types/
      skills.ts          # Shared TypeScript types
    utils/
      constants.ts       # API URLs (one place to edit)
    assets/
    ...
```

## Run backend

From the `backend` folder (so imports like `routes` resolve):

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Use **PDF** uploads and keep **Ollama** running (default client URL is in `model.py`).
