import React, { useState } from 'react';
import axios from 'axios';

const Interview = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [cvText, setCvText] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answerText, setAnswerText] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [summary, setSummary] = useState(null);

    const startInterview = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/interview/start/', {
                job_title: jobTitle,
                cv_text: cvText
            });
            setSessionId(response.data.session_id);
            setQuestions(response.data.questions);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error starting interview:', error);
            alert('Error starting interview. Please check backend.');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        setLoading(true);
        try {
            const currentQuestion = questions[currentIndex];
            const response = await axios.post('http://localhost:8000/api/interview/answer/', {
                question_id: currentQuestion.id,
                answer_text: answerText
            });
            setFeedback(response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Error submitting answer.');
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
            const response = await axios.get(`http://localhost:8000/api/interview/summary/${sessionId}/`);
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    if (summary) {
        return (
            <div className="fade-in">
                <h1>🏆 <span className="gradient-text">Entretien Terminé</span></h1>
                <p className="subtitle">Analyse globale de votre performance pour le poste de <strong>{summary.job_title}</strong>.</p>
                
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: summary.final_score > 70 ? '#10b981' : '#f59e0b' }}>
                            {summary.final_score}%
                        </div>
                        <label>Score d'aptitude global</label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {summary.details.map((detail, index) => (
                            <div key={index} className="result-box">
                                <p style={{ marginBottom: '0.5rem' }}><strong>Question {index + 1}:</strong> {detail.question}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}><em>Votre réponse: {detail.answer}</em></p>
                                <div className="feedback-card" style={{ borderLeftColor: detail.score > 7 ? '#10b981' : '#f59e0b' }}>
                                    <strong>Score: {detail.score}/10</strong>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{detail.feedback}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="primary" onClick={() => { setSummary(null); setQuestions([]); setSessionId(null); }} style={{ marginTop: '2rem' }}>
                        🔄 Recommencer une session
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length > 0) {
        const currentQuestion = questions[currentIndex];
        const progress = ((currentIndex + (feedback ? 1 : 0)) / questions.length) * 100;

        return (
            <div className="fade-in">
                <h1>🎤 <span className="gradient-text">Session d'Entretien</span></h1>
                <p className="subtitle">Répondez aux questions comme si vous étiez face à un recruteur.</p>

                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="card">
                    <div style={{ marginBottom: '2rem' }}>
                        <label>Question {currentIndex + 1} sur {questions.length}</label>
                        <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{currentQuestion.text}</h2>
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
                            <h3 className="gradient-text">Analyse de l'IA (Score: {feedback.score}/10)</h3>
                            <pre style={{ marginTop: '1rem', fontStyle: 'italic' }}>{feedback.feedback}</pre>
                            <button className="primary" onClick={nextQuestion} style={{ marginTop: '1.5rem' }}>
                                {currentIndex + 1 < questions.length ? 'Question Suivante →' : 'Terminer l\'entretien'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h1>🤝 <span className="gradient-text">Coach d'Entretien IA</span></h1>
            <p className="subtitle">Simulez un entretien d'embauche réaliste et recevez des conseils personnalisés.</p>
            
            <div className="card">
                <form onSubmit={startInterview}>
                    <div className="input-group">
                        <label>Poste visé</label>
                        <input 
                            placeholder="ex: Chef de Projet, Développeur..." 
                            value={jobTitle} 
                            onChange={(e) => setJobTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Contenu de votre CV</label>
                        <textarea 
                            placeholder="Copiez ici le texte de votre CV pour que les questions soient adaptées à votre parcours..." 
                            value={cvText} 
                            onChange={(e) => setCvText(e.target.value)} 
                            rows="8" 
                            required 
                        />
                    </div>
                    <button type="submit" className="primary" disabled={loading}>
                        {loading ? <span className="loading-dots">Préparation de la session</span> : '🚀 Démarrer la simulation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Interview;
