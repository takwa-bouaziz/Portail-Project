import React, { useState } from 'react';
import api from '../api';

const Interview = ({ uiVariant }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [cvText, setCvText] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answerText, setAnswerText] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [summary, setSummary] = useState(null);
    const isProfessional = uiVariant === 'professional';

    const startInterview = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/interview/start/', {
                job_title: jobTitle,
                cv_text: cvText
            });
            setSessionId(response.data.session_id);
            setQuestions(response.data.questions);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error starting interview:', error);
            alert('Erreur lors du démarrage. Vérifiez que le backend est lancé.');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        setLoading(true);
        try {
            const currentQuestion = questions[currentIndex];
            const response = await api.post('/api/interview/answer/', {
                question_id: currentQuestion.id,
                answer_text: answerText
            });
            setFeedback(response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Erreur lors de l’analyse de la réponse.');
        } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        setAnswerText('');
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            fetchSummary();
        }
    };

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/interview/summary/${sessionId}/`);
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    if (summary) {
        return (
            <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
                <div className="section-heading">
                    <p className="section-kicker">Bilan d’entretien</p>
                    <h2>Session terminée pour {summary.job_title}.</h2>
                    <p className="subtitle">
                        Analysez le score global et les retours question par question pour préparer une meilleure version.
                    </p>
                </div>

                <div className="card">
                    <div className="score-block">
                        <div className={`score-value ${summary.final_score > 70 ? 'score-good' : 'score-warn'}`}>
                            {summary.final_score}%
                        </div>
                        <label>Score global</label>
                    </div>

                    <div className="stack-list">
                        {summary.details.map((detail, index) => (
                            <div key={index} className="result-box">
                                <p className="result-question"><strong>Question {index + 1}:</strong> {detail.question}</p>
                                <p className="result-answer"><em>Votre réponse: {detail.answer}</em></p>
                                <div className={`feedback-card ${detail.score > 7 ? 'feedback-strong' : 'feedback-mid'}`}>
                                    <strong>Score: {detail.score}/10</strong>
                                    <p>{detail.feedback}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="primary reset-btn" onClick={() => { setSummary(null); setQuestions([]); setSessionId(null); }}>
                        Recommencer une session
                    </button>
                </div>
            </section>
        );
    }

    if (questions.length > 0) {
        const currentQuestion = questions[currentIndex];
        const progress = ((currentIndex + (feedback ? 1 : 0)) / questions.length) * 100;

        return (
            <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
                <div className="section-heading">
                    <p className="section-kicker">Session en cours</p>
                    <h2>Répondez à la question, puis consultez le retour.</h2>
                    <p className="subtitle">
                        L’objectif est d’obtenir un feedback exploitable, pas seulement un score.
                    </p>
                </div>

                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="card">
                    <div className="question-block">
                        <label>Question {currentIndex + 1} sur {questions.length}</label>
                        <h3>{currentQuestion.text}</h3>
                    </div>

                    {!feedback ? (
                        <>
                            <div className="input-group">
                                <textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Décrivez votre expérience, vos compétences ou votre approche..."
                                    rows="6"
                                />
                            </div>
                            <button className="primary" onClick={submitAnswer} disabled={loading || !answerText}>
                                {loading ? <span className="loading-dots">Analyse de votre réponse</span> : 'Évaluer ma réponse'}
                            </button>
                        </>
                    ) : (
                        <div className="feedback-card">
                            <h3>Analyse IA - Score: {feedback.score}/10</h3>
                            <pre className="feedback-copy">{feedback.feedback}</pre>
                            <button className="primary next-btn" onClick={nextQuestion}>
                                {currentIndex + 1 < questions.length ? 'Question suivante' : 'Terminer l’entretien'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
            <div className="section-heading">
                <p className="section-kicker">Simulation d’entretien</p>
                <h2>Lancer une session adaptée au poste visé.</h2>
                <p className="subtitle">
                    Collez votre CV, indiquez le poste cible et entraînez-vous avec des questions personnalisées.
                </p>
            </div>

            <div className={`tool-grid ${isProfessional ? 'tool-grid--professional' : ''}`}>
                {!isProfessional && (
                    <aside className="info-panel accent-panel">
                        <span className="panel-badge">Conseil</span>
                        <h3>Préparez des réponses concrètes.</h3>
                        <p>Appuyez-vous sur des situations réelles, des résultats mesurables et votre rôle exact dans les projets.</p>
                    </aside>
                )}

                <div className="card">
                    <form onSubmit={startInterview}>
                        <div className="input-group">
                            <label>Poste visé</label>
                            <input
                                placeholder="ex: Chef de projet, Développeur..."
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu de votre CV</label>
                            <textarea
                                placeholder="Copiez ici le texte de votre CV pour adapter les questions à votre parcours..."
                                value={cvText}
                                onChange={(e) => setCvText(e.target.value)}
                                rows="8"
                                required
                            />
                        </div>
                        <button type="submit" className="primary" disabled={loading}>
                            {loading ? <span className="loading-dots">Préparation de la session</span> : 'Démarrer la simulation'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Interview;
