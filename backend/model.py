import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

class AIModelClient:
    def __init__(self):
        self.client = Groq(
            api_key=os.getenv("GROQ_API_KEY"),
        )

    def generate(self, prompt: str, expect_json: bool = False):
        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000,
            )

            content = response.choices[0].message.content

            if expect_json:
                return json.loads(content)
            
            return content

        except Exception as e:
            print("Error calling Groq API:", e)
            return None