import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/match-job";

type SkillsData = {
  match_score: string;
  matched_skills?: string[];
  missing_skills?: string[];
  suggestions?: string[];
};

function App() {
  const [resumeText, setResumeText] = useState<any>("");
  const [jobDescription, setJobDescription] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillsData | null>(null);

  const resumeAnalyzer = async () => {
    if (!resumeText || !jobDescription) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      const data = await response.json();
      setSkills(data.resume_result);
      // alert(data.message);
    } catch (error) {
      console.error("Error", error);
      alert("An error occurred while submitting the application.");
    } finally {
      setLoading(false);
      setResumeText("");
      setJobDescription("");
    }
  };

  console.log("Skills in frontend:", skills);

  return (
    <>
      <div>
        <h1>AI Resume Analyzer</h1>
        <div className="input_container">
          <textarea
            value={resumeText}
            placeholder="Enter your resume in text"
            required
            onChange={(e) => setResumeText(e.target.value || null)}
          />
          <textarea
            value={jobDescription}
            placeholder="Enter your job description"
            required
            onChange={(e) => setJobDescription(e.target.value || null)}
          />
          <button
            className={`analyze_button ${loading ? "loading" : ""}`}
            disabled={!resumeText || !jobDescription || loading}
            onClick={resumeAnalyzer}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <div className="skills_container">
          {skills && (
            <div>
              <h2 className="subheading">Extracted Skills</h2>
              <div className="table_wrapper">
                <table className="skills_table">
                  <tbody>
                    <tr>
                      <th>Match Score</th>
                      <td>{skills.match_score}</td>
                    </tr>

                    {skills.matched_skills && (
                      <tr>
                        <th>Matched Skills</th>
                        <td>
                          <ul>
                            {skills.matched_skills.map(
                              (skill: string, index: number) => (
                                <li key={index}>{skill}</li>
                              ),
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}

                    {skills.missing_skills && (
                      <tr>
                        <th>Missing Skills</th>
                        <td>
                          <ul>
                            {skills.missing_skills.map(
                              (skill: string, index: number) => (
                                <li key={index}>{skill}</li>
                              ),
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}

                    {skills.suggestions && (
                      <tr>
                        <th>Suggestions</th>
                        <td>
                          <ul>
                            {skills.suggestions.map(
                              (suggestion: string, index: number) => (
                                <li key={index}>{suggestion}</li>
                              ),
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
