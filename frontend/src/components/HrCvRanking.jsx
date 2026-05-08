import { useState } from 'react';
import api from '../api';

const separator = '\n\n--- CV SUIVANT ---\n\n';

function splitBulkCvs(rawText) {
  return rawText
    .split(/---\s*CV SUIVANT\s*---/i)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      const firstLine = lines[0] || `Candidat ${index + 1}`;
      const nameMatch = firstLine.match(/^(nom|name|candidat)\s*:\s*(.+)$/i);
      const name = nameMatch ? nameMatch[2].trim() : `Candidat ${index + 1}`;

      return {
        name,
        cv_text: block,
      };
    });
}

function HrCvRanking({ uiVariant }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [bulkCvs, setBulkCvs] = useState('');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const isProfessional = uiVariant === 'professional';

  const importCvFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const importedBlocks = await Promise.all(
        files.map(async (file) => {
          const cvText = await file.text();
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          return `Nom: ${fileName}\n${cvText}`;
        })
      );

      setBulkCvs((current) => {
        const prefix = current.trim() ? `${current.trim()}${separator}` : '';
        return `${prefix}${importedBlocks.join(separator)}`;
      });
      event.target.value = '';
    } catch (error) {
      console.error('Error importing CV files:', error);
      alert('Impossible de lire un ou plusieurs fichiers. Utilisez des fichiers texte.');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const candidates = splitBulkCvs(bulkCvs);

    if (candidates.length < 2) {
      alert('Ajoutez au moins deux CV séparés par "--- CV SUIVANT ---".');
      return;
    }

    setLoading(true);
    setRanking([]);

    try {
      const response = await api.post('/api/cv-tools/hr/rank-cvs/', {
        job_title: jobTitle,
        job_description: jobDescription,
        candidates,
      });
      setRanking(response.data.ranking || []);
    } catch (error) {
      console.error('Error ranking CVs:', error);
      alert('Erreur lors du classement des CV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">Sélection RH</p>
        <h2>Classer plusieurs CV dans un seul champ.</h2>
        <p className="subtitle">
          Collez tous les CV dans la même zone, séparés par "--- CV SUIVANT ---", ou importez plusieurs fichiers.
        </p>
      </div>

      <div className="card">
        <form onSubmit={submit}>
          <div className="input-group">
            <label>Poste à pourvoir</label>
            <input
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="ex: Ingénieur DevOps"
              required
            />
          </div>

          <div className="input-group">
            <label>Description du poste</label>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Missions, compétences, niveau attendu..."
              rows="7"
              required
            />
          </div>

          <div className="input-group">
            <label>Importer plusieurs CV</label>
            <input type="file" accept=".txt,.md,.rtf" multiple onChange={importCvFiles} />
            <p className="helper-text">
              Chaque fichier importé sera ajouté dans le champ unique ci-dessous.
            </p>
          </div>

          <div className="input-group">
            <label>Tous les CV</label>
            <textarea
              value={bulkCvs}
              onChange={(event) => setBulkCvs(event.target.value)}
              placeholder={`Nom: Candidat 1\nCollez le premier CV ici...\n${separator}Nom: Candidat 2\nCollez le deuxième CV ici...`}
              rows="18"
              required
            />
            <p className="helper-text">
              Séparez chaque candidat avec: --- CV SUIVANT ---
            </p>
          </div>

          <button className="primary" type="submit" disabled={loading}>
            {loading ? <span className="loading-dots">Classement en cours</span> : 'Classer les CV'}
          </button>
        </form>

        {ranking.length > 0 && (
          <div className="result-box">
            <div className="result-header">
              <div>
                <p className="section-kicker">Résultat</p>
                <h3>CV gagnants</h3>
              </div>
            </div>
            <div className="stack-list">
              {ranking.map((item, index) => (
                <article className="ranking-item" key={`${item.candidate_name}-${index}`}>
                  <div className="ranking-rank">#{index + 1}</div>
                  <div>
                    <h3>{item.candidate_name}</h3>
                    <p>{item.reason}</p>
                    <div className="result-columns">
                      <div className="mini-panel">
                        <h4>Forces</h4>
                        <ul className="feature-list compact-list">
                          {item.strengths?.map((strength, strengthIndex) => (
                            <li key={`${strength}-${strengthIndex}`}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mini-panel">
                        <h4>Risques</h4>
                        <ul className="feature-list compact-list">
                          {item.risks?.map((risk, riskIndex) => (
                            <li key={`${risk}-${riskIndex}`}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="history-meta">
                    <strong>{item.score}%</strong>
                    <span>{item.decision}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HrCvRanking;
