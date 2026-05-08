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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // const [resumeText, setResumeText] = useState<any>("");
  const [jobDescription, setJobDescription] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillsData | null>(null);

  const resumeAnalyzer = async () => {
    // if (!resumeText || !jobDescription) {
    //   alert("Please fill in all fields!");
    //   return;
    // }

    if (!resumeFile || !jobDescription) {
      alert("Please upload your resume file and enter the job description!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("job_description", jobDescription);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSkills(data.resume_result);
      // alert(data.message);
    } catch (error) {
      console.error("Error", error);
      alert("An error occurred while submitting the application.");
    } finally {
      setLoading(false);
      // setResumeText("");
      setJobDescription("");
    }
  };

  return (
    <>
      <div>
        <h1>AI Resume Analyzer</h1>
        <div className="input_container">
          {/* <textarea
            value={resumeText}
            placeholder="Enter your resume in text"
            required
            onChange={(e) => setResumeText(e.target.value || null)}
          /> */}

          <textarea
            value={jobDescription}
            placeholder="Enter your job description"
            required
            onChange={(e) => setJobDescription(e.target.value || null)}
          />
          <div className="form_bottom">
            <input
              type="file"
              className="file_input"
              required
              accept=".pdf"
              onChange={(e) =>
                setResumeFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <button
              className={`analyze_button ${loading ? "loading" : ""}`}
              disabled={!resumeFile || !jobDescription || loading}
              onClick={resumeAnalyzer}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
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
                            {skills.matched_skills
                              ? skills.matched_skills.map(
                                  (skill: string, index: number) => (
                                    <li key={index}>{skill}</li>
                                  ),
                                )
                              : "-"}
                          </ul>
                        </td>
                      </tr>
                    )}

                    {skills.missing_skills && (
                      <tr>
                        <th>Missing Skills</th>
                        <td>
                          <ul>
                            {skills.missing_skills
                              ? skills.missing_skills.map(
                                  (skill: string, index: number) => (
                                    <li key={index}>{skill}</li>
                                  ),
                                )
                              : "-"}
                          </ul>
                        </td>
                      </tr>
                    )}

                    {skills.suggestions && (
                      <tr>
                        <th>Suggestions</th>
                        <td>
                          <ul>
                            {skills.suggestions
                              ? skills.suggestions.map(
                                  (suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                  ),
                                )
                              : "-"}
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
