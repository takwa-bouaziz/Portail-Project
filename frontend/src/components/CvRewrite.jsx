import { useState } from 'react';
import axios from 'axios';

const sectionOptions = [
  { value: 'Professional Summary', label: 'Professional Summary' },
  { value: 'Experience', label: 'Experience' },
  { value: 'Skills', label: 'Skills' },
  { value: 'Education', label: 'Education' },
  { value: 'Projects', label: 'Projects' },
];

function CvRewrite({ uiVariant }) {
  const [sectionName, setSectionName] = useState(sectionOptions[0].value);
  const [targetRole, setTargetRole] = useState('');
  const [sectionText, setSectionText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const isProfessional = uiVariant === 'professional';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/cv-tools/rewrite/', {
        section_name: sectionName,
        section_text: sectionText,
        target_role: targetRole,
        rewrite_style: 'professional',
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error rewriting CV section:', error);
      alert('Error rewriting the CV section. Please check the backend.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.rewritten_text) return;

    try {
      await navigator.clipboard.writeText(result.rewritten_text);
      alert('Rewritten section copied to clipboard.');
    } catch (error) {
      console.error('Clipboard error:', error);
      alert('Unable to copy the rewritten section.');
    }
  };

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">CV Rewriting</p>
        <h2>
          {isProfessional
            ? 'Rewrite one CV section at a time.'
            : 'Improve a weak section without rewriting the whole CV from scratch.'}
        </h2>
        <p className="subtitle">
          {isProfessional
            ? 'Choose a section, paste the original version, and compare the before/after result.'
            : 'Select the section you want to improve, add the target role if you have one, and review a cleaner rewritten version.'}
        </p>
      </div>

      <div className={`tool-grid ${isProfessional ? 'tool-grid--professional' : ''}`}>
        {!isProfessional && (
          <aside className="info-panel">
            <span className="panel-badge">Best use</span>
            <h3>Improve clarity without changing the truth.</h3>
            <p>The assistant keeps your real experience, but rewrites the wording so the section sounds clearer and more targeted.</p>
            <ul className="feature-list">
              <li>Choose a CV section to improve.</li>
              <li>Compare original and rewritten versions side by side.</li>
              <li>Copy the improved version directly into your CV.</li>
            </ul>
          </aside>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>CV section</label>
                <select
                  className="select-input"
                  value={sectionName}
                  onChange={(event) => setSectionName(event.target.value)}
                >
                  {sectionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Target role</label>
                <input
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="ex: Full Stack Developer"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Original section</label>
              <textarea
                value={sectionText}
                onChange={(event) => setSectionText(event.target.value)}
                placeholder="Paste the selected CV section here..."
                rows="10"
                required
              />
            </div>

            <button type="submit" className="primary" disabled={loading}>
              {loading ? <span className="loading-dots">Rewriting section</span> : 'Rewrite this section'}
            </button>
          </form>

          {result && (
            <div className="result-box">
              <div className="result-header">
                <div>
                  <p className="section-kicker">Before / After</p>
                  <h3>{result.section_name}</h3>
                </div>
                <div className="result-actions">
                  <button onClick={copyToClipboard} className="secondary-btn" type="button">
                    Copy rewritten version
                  </button>
                </div>
              </div>

              <div className="before-after-grid">
                <div className="mini-panel">
                  <h4>Before</h4>
                  <pre>{result.original_text}</pre>
                </div>
                <div className="mini-panel">
                  <h4>After</h4>
                  <pre>{result.rewritten_text}</pre>
                </div>
              </div>

              <div className="mini-panel">
                <h4>Improvement notes</h4>
                <ul className="feature-list compact-list">
                  {result.improvement_notes?.map((item, index) => (
                    <li key={`note-${index}`}>{item}</li>
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

export default CvRewrite;
