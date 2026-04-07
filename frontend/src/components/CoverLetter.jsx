import React, { useState } from 'react';
import axios from 'axios';

const CoverLetter = () => {
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

    return (
        <div className="fade-in">
            <h1><span className="gradient-text">Générateur de Lettre de Motivation</span></h1>
            <p className="subtitle">Créez une lettre percutante et personnalisée en quelques secondes grâce à l'IA.</p>
            
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="gradient-text">Votre lettre de motivation</h3>
                            <button onClick={copyToClipboard} style={{ padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                                📋 Copier
                            </button>
                        </div>
                        <pre>{generatedLetter}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoverLetter;
