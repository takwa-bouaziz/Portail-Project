import { useState } from 'react';
import axios from 'axios';

const scoreTone = (score) => {
  if (score >= 75) return 'score-good';
  if (score >= 50) return 'score-mid';
  return 'score-warn';
};

function CvMatch({ uiVariant }) {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const isProfessional = uiVariant === 'professional';

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      setCvText(content);
    } catch (error) {
      console.error('Error reading CV file:', error);
      alert('Unable to read this file. Please upload a text-based file or paste the CV.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/cv-tools/match/', {
        cv_text: cvText,
        job_description: jobDescription,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing CV match:', error);
      alert('Error analyzing the CV match. Please check the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">CV Matching</p>
        <h2>
          {isProfessional
            ? 'Compare a CV against a job offer.'
            : 'Check how closely your CV matches the role before you apply.'}
        </h2>
        <p className="subtitle">
          {isProfessional
            ? 'Paste the CV and offer, then review the score, missing skills, and improvement suggestions.'
            : 'Use a pasted CV or a text upload, compare it to the offer, and get concrete advice to strengthen the application.'}
        </p>
      </div>

      <div className={`tool-grid ${isProfessional ? 'tool-grid--professional' : ''}`}>
        {!isProfessional && (
          <aside className="info-panel accent-panel">
            <span className="panel-badge">What you get</span>
            <h3>Useful before every application.</h3>
            <p>The analysis highlights where your CV already aligns with the role and what should be made more visible to recruiters.</p>
            <ul className="feature-list">
              <li>A matching score from 0 to 100.</li>
              <li>Missing skills or weak signals in the CV.</li>
              <li>Specific suggestions to improve wording and relevance.</li>
            </ul>
          </aside>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Upload CV text file</label>
              <input type="file" accept=".txt,.md,.rtf" onChange={handleFileUpload} />
              <p className="helper-text">You can also paste the CV manually below.</p>
            </div>

            <div className="input-group">
              <label>CV content</label>
              <textarea
                value={cvText}
                onChange={(event) => setCvText(event.target.value)}
                placeholder="Paste the CV here..."
                rows="9"
                required
              />
            </div>

            <div className="input-group">
              <label>Job offer</label>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
                rows="9"
                required
              />
            </div>

            <button type="submit" className="primary" disabled={loading}>
              {loading ? <span className="loading-dots">Analyzing match</span> : 'Analyze CV matching'}
            </button>
          </form>

          {result && (
            <div className="result-box">
              <div className="result-header result-header--stack">
                <div>
                  <p className="section-kicker">Analysis Result</p>
                  <h3>CV / job offer matching</h3>
                </div>
                <div className={`score-pill ${scoreTone(result.matching_score)}`}>
                  {result.matching_score}%
                </div>
              </div>

              <p className="summary-copy">{result.matching_summary}</p>

              <div className="result-columns">
                <div className="mini-panel">
                  <h4>Strengths</h4>
                  <ul className="feature-list compact-list">
                    {result.strengths?.map((item, index) => (
                      <li key={`strength-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mini-panel">
                  <h4>Missing skills</h4>
                  <ul className="feature-list compact-list">
                    {result.missing_skills?.map((item, index) => (
                      <li key={`missing-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mini-panel">
                <h4>Suggestions to improve the CV</h4>
                <ul className="feature-list compact-list">
                  {result.improvement_suggestions?.map((item, index) => (
                    <li key={`suggestion-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CvMatch;
