import { useState } from 'react';
import api from '../api';

const sectionOptions = [
  { value: 'Professional Summary', label: 'Résumé professionnel' },
  { value: 'Experience', label: 'Expérience' },
  { value: 'Skills', label: 'Compétences' },
  { value: 'Education', label: 'Formation' },
  { value: 'Projects', label: 'Projets' },
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
      const response = await api.post('/api/cv-tools/rewrite/', {
        section_name: sectionName,
        section_text: sectionText,
        target_role: targetRole,
        rewrite_style: 'professional',
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error rewriting CV section:', error);
      alert('Erreur lors de la reformulation. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.rewritten_text) return;

    try {
      await navigator.clipboard.writeText(result.rewritten_text);
      alert('Section reformulée copiée.');
    } catch (error) {
      console.error('Clipboard error:', error);
      alert('Impossible de copier la section reformulée.');
    }
  };

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">Reformulation CV</p>
        <h2>
          {isProfessional
            ? 'Reformuler une section du CV.'
            : 'Améliorez une section faible sans réécrire tout le CV.'}
        </h2>
        <p className="subtitle">
          {isProfessional
            ? 'Choisissez une section, collez la version actuelle et comparez le résultat.'
            : 'Sélectionnez la section à améliorer, ajoutez le poste cible, puis récupérez une version plus claire.'}
        </p>
      </div>

      <div className={`tool-grid ${isProfessional ? 'tool-grid--professional' : ''}`}>
        {!isProfessional && (
          <aside className="info-panel">
            <span className="panel-badge">Objectif</span>
            <h3>Clarifier sans déformer l’expérience.</h3>
            <p>L’assistant conserve le fond, mais améliore la formulation pour rendre la section plus lisible et ciblée.</p>
            <ul className="feature-list">
              <li>Choisissez une section du CV.</li>
              <li>Comparez la version avant et après.</li>
              <li>Copiez directement la version améliorée.</li>
            </ul>
          </aside>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>Section du CV</label>
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
                <label>Poste cible</label>
                <input
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="ex: Développeur Full Stack"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Section originale</label>
              <textarea
                value={sectionText}
                onChange={(event) => setSectionText(event.target.value)}
                placeholder="Collez ici la section du CV à améliorer..."
                rows="10"
                required
              />
            </div>

            <button type="submit" className="primary" disabled={loading}>
              {loading ? <span className="loading-dots">Reformulation en cours</span> : 'Reformuler cette section'}
            </button>
          </form>

          {result && (
            <div className="result-box">
              <div className="result-header">
                <div>
                  <p className="section-kicker">Avant / Après</p>
                  <h3>{result.section_name}</h3>
                </div>
                <div className="result-actions">
                  <button onClick={copyToClipboard} className="secondary-btn" type="button">
                    Copier la version reformulée
                  </button>
                </div>
              </div>

              <div className="before-after-grid">
                <div className="mini-panel">
                  <h4>Avant</h4>
                  <pre>{result.original_text}</pre>
                </div>
                <div className="mini-panel">
                  <h4>Après</h4>
                  <pre>{result.rewritten_text}</pre>
                </div>
              </div>

              <div className="mini-panel">
                <h4>Notes d’amélioration</h4>
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
