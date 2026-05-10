import type { SkillsData } from "../types/skills";

type Props = {
  skills: SkillsData;
};

export function SkillsResults({ skills }: Props) {
  return (
    <div className="skills_container">
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
    </div>
  );
}
