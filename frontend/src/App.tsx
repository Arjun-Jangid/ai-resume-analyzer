import { useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import { SkillsResults } from "./components/SkillsResults";
import uploadImg from "./assets/upload.png";
import type { SkillsData } from "./types/skills";
import { MATCH_JOB_URL } from "./utils/constants";

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
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

      const response = await fetch(MATCH_JOB_URL, {
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
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
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

      {skills && <SkillsResults skills={skills} />}
      {skills && <Chat />}
    </>
  );
}

export default App;
