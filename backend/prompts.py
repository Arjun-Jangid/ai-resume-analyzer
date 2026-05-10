def build_match_job_prompt(resume_text: str, job_description: str, retrieved_skills) -> str:
    return f"""
        You are an AI hiring assistant.

        Compare the resume and job description.

        Return ONLY valid JSON:
        - Use double quotes for all keys and strings
        - No trailing commas
        - No explanation or extra text

        Format:

        {{
        "match_score": 0-100,
        "matched_skills": ["..."],
        "missing_skills": ["..."],
        "suggestions": ["..."]
        }}

        IMPORTANT MATCHING RULES:
        - If a skill exists in BOTH resume and job description, it MUST be added to matched_skills.
        - Do NOT include matched skills inside missing_skills.
        - Match exact technologies carefully.
        - Use retrieved skills while identifying missing skills.
        - Prefer specific technical skills over generic terms.
        - Do not use broad phrases like "cloud platforms".

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Relevant Market Skills:
        {retrieved_skills}
        """


def build_chat_prompt(resume_text: str, query: str) -> str:
    return f"""
    You are an AI career assistant.

    Analyze the user's resume carefully.

    Resume:
    {resume_text}

    Question:
    {query}
    """
