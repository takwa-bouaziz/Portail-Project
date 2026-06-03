import { useState } from 'react';
import api from '../api';

function HrInterviewGuide({ uiVariant }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const isProfessional = uiVariant === 'professional';

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setQuestions([]);

    try {
      const response = await api.post('/api/cv-tools/hr/interview-guide/', {
        job_title: jobTitle,
        job_description: jobDescription,
      });
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error generating HR interview guide:', error);
      alert('Erreur lors de la génération du guide entretien.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">Conseiller RH</p>
        <h2>Préparer les questions à poser aux candidats.</h2>
        <p className="subtitle">
          Indiquez le poste et l’offre pour obtenir des questions, des idées de réponses et des critères d’évaluation.
        </p>
      </div>

      <div className="card">
        <form onSubmit={submit}>
          <div className="input-group">
            <label>Poste à pourvoir</label>
            <input
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="ex: Développeur Full Stack"
              required
            />
          </div>
          <div className="input-group">
            <label>Description du poste</label>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Missions, compétences attendues, expérience souhaitée..."
              rows="9"
              required
            />
          </div>
          <button className="primary" type="submit" disabled={loading}>
            {loading ? <span className="loading-dots">Préparation du guide</span> : 'Générer les questions'}
          </button>
        </form>

        {questions.length > 0 && (
          <div className="result-box">
            <div className="result-header">
              <div>
                <p className="section-kicker">Guide entretien</p>
                <h3>Questions recommandées</h3>
              </div>
            </div>
            <div className="stack-list">
              {questions.map((item, index) => (
                <article className="mini-panel" key={`${item.question}-${index}`}>
                  <h4>Question {index + 1}</h4>
                  <p className="result-question">{item.question}</p>
                  <p className="summary-copy"><strong>Idée de bonne réponse:</strong> {item.ideal_answer}</p>
                  <ul className="feature-list compact-list">
                    {item.evaluation_points?.map((point, pointIndex) => (
                      <li key={`${point}-${pointIndex}`}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HrInterviewGuide;
