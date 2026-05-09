import { useState } from "react";
import "./App.css";
import Chat from "./Chat";
import uploadImg from "./assets/upload.png";

const API_URL = "http://127.0.0.1:8000/match-job";

type SkillsData = {
  match_score: string;
  matched_skills?: string[];
  missing_skills?: string[];
  suggestions?: string[];
};

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillsData | null>(null);

  const resumeAnalyzer = async () => {
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
    } catch (error) {
      console.error("Error", error);
      alert("An error occurred while submitting the application.");
    } finally {
      setLoading(false);
      setJobDescription("");
    }
  };

  console.log("Skills in response: ", skills);

  return (
    <>
      <h1 className="title">AI Career Assistant</h1>
      <div className="form_container">
        <div className="left_container">
          <textarea
            value={jobDescription}
            placeholder="Enter your job description"
            required
            onChange={(e) => setJobDescription(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                jobDescription?.trim().length > 0 &&
                resumeFile
              ) {
                resumeAnalyzer();
              }
            }}
          />
        </div>
        <div className="right_container">
          <label className="upload_box">
            <input
              type="file"
              hidden
              onChange={(e) => setResumeFile(e.target.files?.[0])}
            />

            <div className="upload_content">
              <img src={uploadImg} alt="upload" className="upload_icon" />

              <p>
                {resumeFile
                  ? resumeFile.name.slice(0, 10) + "..."
                  : "Upload your resume"}
              </p>

              <span>PDF only</span>
            </div>
          </label>
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
                          {skills.matched_skills.length > 0
                            ? skills.matched_skills.map(
                                (skill: string, index: number) => (
                                  <li key={index}>{skill}</li>
                                ),
                              )
                            : "No skills found"}
                        </ul>
                      </td>
                    </tr>
                  )}

                  {skills.missing_skills && (
                    <tr>
                      <th>Missing Skills</th>
                      <td>
                        <ul>
                          {skills.missing_skills.length > 0
                            ? skills.missing_skills.map(
                                (skill: string, index: number) => (
                                  <li key={index}>{skill}</li>
                                ),
                              )
                            : "No skills found"}
                        </ul>
                      </td>
                    </tr>
                  )}

                  {skills.suggestions && (
                    <tr>
                      <th>Suggestions</th>
                      <td>
                        <ul>
                          {skills.suggestions.length > 0
                            ? skills.suggestions.map(
                                (suggestion: string, index: number) => (
                                  <li key={index}>{suggestion}</li>
                                ),
                              )
                            : "No suggestion found"}
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
      {skills && <Chat />}
    </>
  );
}

export default App;
