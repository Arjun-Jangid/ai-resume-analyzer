import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/submit-application";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<any>(null);

  const fileAnalyzer = async () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response from backend:", data);
      setSkills(data.skills);
      alert(data.message);
    } catch (error) {
      console.error("Error", error);
      alert("An error occurred while submitting the application.");
    }
  };

  return (
    <>
      <div>
        <h1>AI Resume Analyzer</h1>
        <p>Please upload your resume</p>
        <input
          type="file"
          accept=".txt"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button disabled={!file} onClick={fileAnalyzer}>
          Analyze
        </button>
      </div>
      <div>
        {skills && (
          <div>
            <h2 className="skills_container">Extracted Skills</h2>
            {Object.entries(skills).map(([category, skillList]) => (
              <div className="skills_cat" key={category}>
                <h3>{category}</h3>
                <div className="skills_list">
                  {(skillList as string[]).map((skill, index) => (
                    <p key={index}>{skill}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
