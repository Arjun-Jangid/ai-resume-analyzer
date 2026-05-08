import requests

class AIModelClient:
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"

    def generate(self, model: str, prompt: str, stream: bool = False):
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream
        }
        try:
            response = requests.post(self.api_url, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print("Error calling AI model API:", e)
            return None