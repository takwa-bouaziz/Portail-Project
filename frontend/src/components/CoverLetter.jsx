import React, { useState } from 'react';
import axios from 'axios';

const CoverLetter = ({ uiVariant }) => {
    const [formData, setFormData] = useState({
        candidate_name: '',
        job_title: '',
        company_name: '',
        cv_text: '',
        job_description: ''
    });
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/cover-letter/generate/', formData);
            setGeneratedLetter(response.data.generated_letter);
        } catch (error) {
            console.error('Error generating cover letter:', error);
            alert('Error generating cover letter. Please check backend.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLetter);
        alert('Copied to clipboard!');
    };

    const downloadLetter = () => {
        const content = generatedLetter || '';
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeName = (formData.candidate_name || 'cover-letter')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-');

        link.href = url;
        link.download = `${safeName}-cover-letter.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const isProfessional = uiVariant === 'professional';

    return (
        <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
            <div className="section-heading">
                <p className="section-kicker">Cover Letter</p>
                <h2>
                    {isProfessional
                        ? 'Generate a clear and tailored cover letter.'
                        : 'Compose a personalized letter that sounds prepared, not generic.'}
                </h2>
                <p className="subtitle">
                    {isProfessional
                        ? 'Add the essentials, then generate a draft you can refine.'
                        : 'Fill in the role, your strengths, and the job description. The assistant will turn that into a more convincing first draft.'}
                </p>
            </div>

            <div className={`tool-grid ${isProfessional ? 'tool-grid--professional' : ''}`}>
                {!isProfessional && (
                    <aside className="info-panel">
                        <span className="panel-badge">How it works</span>
                        <h3>Build stronger context before you generate.</h3>
                        <p>Include concrete wins, tools you have used, and the employer's priorities. The more specific the input, the more believable the final letter will feel.</p>
                        <ul className="feature-list">
                            <li>Name the exact role and company.</li>
                            <li>Summarize your strongest experiences in the CV box.</li>
                            <li>Paste the mission and required skills from the offer.</li>
                        </ul>
                    </aside>
                )}

                <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>Nom complet</label>
                            <input name="candidate_name" placeholder="ex: Jean Dupont" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Poste visé</label>
                            <input name="job_title" placeholder="ex: Développeur Fullstack" onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label>Entreprise</label>
                        <input name="company_name" placeholder="Nom de l'entreprise" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Votre CV (Points clés ou résumé)</label>
                        <textarea 
                            name="cv_text" 
                            placeholder="Domaines d'expertise, technologies, expériences marquantes..." 
                            onChange={handleChange} 
                            rows="5" 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Description de l'offre d'emploi</label>
                        <textarea 
                            name="job_description" 
                            placeholder="Missions, pré-requis, compétences recherchées..." 
                            onChange={handleChange} 
                            rows="5" 
                            required 
                        />
                    </div>

                    <button type="submit" className="primary" disabled={loading}>
                        {loading ? <span className="loading-dots">Génération en cours</span> : '✨ Générer la lettre'}
                    </button>
                </form>

                {generatedLetter && (
                    <div className="result-box">
                        <div className="result-header">
                            <div>
                                <p className="section-kicker">{isProfessional ? 'Result' : 'Generated Draft'}</p>
                                <h3>Votre lettre de motivation</h3>
                            </div>
                            <div className="result-actions">
                                <button onClick={copyToClipboard} className="secondary-btn" type="button">
                                    📋 Copier
                                </button>
                                <button onClick={downloadLetter} className="secondary-btn" type="button">
                                    ⬇ Télécharger
                                </button>
                            </div>
                        </div>
                        <pre>{generatedLetter}</pre>
                    </div>
                )}
                </div>
            </div>
        </section>
    );
};

export default CoverLetter;
