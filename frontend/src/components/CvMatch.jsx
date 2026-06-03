import { useState } from 'react';
import api from '../api';

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
      alert('Impossible de lire ce fichier. Importez un fichier texte ou collez le CV.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/api/cv-tools/match/', {
        cv_text: cvText,
        job_description: jobDescription,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing CV match:', error);
      alert('Erreur lors de l’analyse. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">Matching CV / offre</p>
        <h2>
          {isProfessional
            ? 'Comparer un CV à une offre d’emploi.'
            : 'Vérifiez si votre CV correspond au poste avant de candidater.'}
        </h2>
        <p className="subtitle">
          {isProfessional
            ? 'Collez le CV et l’offre, puis consultez le score, les compétences manquantes et les suggestions.'
            : 'Importez ou collez un CV, comparez-le à l’offre, puis récupérez des conseils concrets.'}
        </p>
      </div>

      <div className={`tool-grid ${isProfessional ? 'tool-grid--professional' : ''}`}>
        {!isProfessional && (
          <aside className="info-panel accent-panel">
            <span className="panel-badge">Analyse</span>
            <h3>Utile avant chaque candidature.</h3>
            <p>L’analyse montre ce qui correspond déjà au poste et ce qui doit être rendu plus visible.</p>
            <ul className="feature-list">
              <li>Un score de correspondance sur 100.</li>
              <li>Les compétences manquantes ou peu visibles.</li>
              <li>Des suggestions de reformulation ciblées.</li>
            </ul>
          </aside>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Importer un CV texte</label>
              <input type="file" accept=".txt,.md,.rtf" onChange={handleFileUpload} />
              <p className="helper-text">Vous pouvez aussi coller le contenu manuellement.</p>
            </div>

            <div className="input-group">
              <label>Contenu du CV</label>
              <textarea
                value={cvText}
                onChange={(event) => setCvText(event.target.value)}
                placeholder="Collez le CV ici..."
                rows="9"
                required
              />
            </div>

            <div className="input-group">
              <label>Offre d’emploi</label>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Collez la description du poste ici..."
                rows="9"
                required
              />
            </div>

            <button type="submit" className="primary" disabled={loading}>
              {loading ? <span className="loading-dots">Analyse en cours</span> : 'Analyser le matching'}
            </button>
          </form>

          {result && (
            <div className="result-box">
              <div className="result-header result-header--stack">
                <div>
                  <p className="section-kicker">Résultat</p>
                  <h3>Matching CV / offre</h3>
                </div>
                <div className={`score-pill ${scoreTone(result.matching_score)}`}>
                  {result.matching_score}%
                </div>
              </div>

              <p className="summary-copy">{result.matching_summary}</p>

              <div className="result-columns">
                <div className="mini-panel">
                  <h4>Points forts</h4>
                  <ul className="feature-list compact-list">
                    {result.strengths?.map((item, index) => (
                      <li key={`strength-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mini-panel">
                  <h4>Compétences manquantes</h4>
                  <ul className="feature-list compact-list">
                    {result.missing_skills?.map((item, index) => (
                      <li key={`missing-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mini-panel">
                <h4>Suggestions pour améliorer le CV</h4>
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
