import { useState } from 'react'
import './App.css'
import CoverLetter from './components/CoverLetter'
import Interview from './components/Interview'
import CvMatch from './components/CvMatch'
import CvRewrite from './components/CvRewrite'
import { UI_VARIANT, isProfessionalUI } from './uiVariant'

function App() {
  const [activeTab, setActiveTab] = useState('coverLetter');
  const activeMode = activeTab === 'coverLetter'
    ? {
        eyebrow: 'Writing Studio',
        title: 'Shape sharper applications with less guesswork.',
        description: 'Switch between a tailored cover-letter generator and an interview coach built to help you rehearse with confidence.',
        statLabel: 'Focus',
        statValue: 'Application quality',
      }
    : activeTab === 'interview'
    ? {
        eyebrow: 'Interview Lab',
        title: 'Train your answers before the recruiter asks.',
        description: 'Practice realistic questions, get structured feedback, and refine your pitch for the role you want.',
        statLabel: 'Focus',
        statValue: 'Interview readiness',
      }
    : activeTab === 'cvMatch'
    ? {
        eyebrow: 'Match Scanner',
        title: 'Measure how well the CV fits the offer.',
        description: 'Compare a CV against a job description and identify the missing signals that can improve your application.',
        statLabel: 'Focus',
        statValue: 'CV relevance',
      }
    : {
        eyebrow: 'Rewrite Desk',
        title: 'Refine one CV section without losing accuracy.',
        description: 'Select a section, rewrite it more clearly, and compare the before and after version instantly.',
        statLabel: 'Focus',
        statValue: 'CV clarity',
      };

  return (
    <div className={`App app--${UI_VARIANT}`}>
      <div className="page-shell">
        <header className={`topbar ${isProfessionalUI ? 'topbar--professional' : ''}`}>
          <div className="brand-block">
            <span className="brand-mark">CV</span>
            <div>
              <p className="brand-name">Career Copilot</p>
              <p className="brand-subtitle">
                {isProfessionalUI
                  ? 'Smart tools for applications and interviews'
                  : 'Portfolio tools for applications and interview prep'}
              </p>
            </div>
          </div>
          <nav className="nav-buttons" aria-label="Sections">
            <button
              className={`nav-btn ${activeTab === 'coverLetter' ? 'active' : ''}`}
              onClick={() => setActiveTab('coverLetter')}
            >
              Lettre de motivation
            </button>
            <button
              className={`nav-btn ${activeTab === 'interview' ? 'active' : ''}`}
              onClick={() => setActiveTab('interview')}
            >
              Simulation d'entretien
            </button>
            <button
              className={`nav-btn ${activeTab === 'cvMatch' ? 'active' : ''}`}
              onClick={() => setActiveTab('cvMatch')}
            >
              Matching CV / offre
            </button>
            <button
              className={`nav-btn ${activeTab === 'cvRewrite' ? 'active' : ''}`}
              onClick={() => setActiveTab('cvRewrite')}
            >
              Reformulation CV
            </button>
          </nav>
        </header>

        {isProfessionalUI ? (
          <section className="hero-panel hero-panel--professional">
            <div className="hero-copy">
              <p className="eyebrow">{activeMode.eyebrow}</p>
              <h1>
                {activeTab === 'coverLetter'
                  ? 'Professional application support.'
                  : activeTab === 'interview'
                  ? 'Interview preparation that stays focused.'
                  : activeTab === 'cvMatch'
                  ? 'CV matching analysis for a clearer fit.'
                  : 'CV rewriting focused on stronger wording.'}
              </h1>
              <p className="hero-description">
                {activeTab === 'coverLetter'
                  ? 'Create a clear, tailored cover letter from your profile and the job description.'
                  : activeTab === 'interview'
                  ? 'Practice job-specific questions and review structured feedback after each answer.'
                  : activeTab === 'cvMatch'
                  ? 'Compare a CV to a job offer, review the score, and identify the missing skills to highlight.'
                  : 'Rewrite one CV section at a time and compare the original text with a stronger version.'}
              </p>
            </div>
            <div className="hero-metrics">
              <div className="metric-card">
                <span className="hero-card-label">Mode</span>
                <strong>
                  {activeTab === 'coverLetter'
                    ? 'Cover Letter'
                    : activeTab === 'interview'
                    ? 'Interview Coach'
                    : activeTab === 'cvMatch'
                    ? 'CV Match Analyzer'
                    : 'CV Rewrite Assistant'}
                </strong>
              </div>
              <div className="metric-card">
                <span className="hero-card-label">Experience</span>
                <strong>Clean, concise, and recruiter-ready</strong>
              </div>
            </div>
          </section>
        ) : (
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">{activeMode.eyebrow}</p>
              <h1>{activeMode.title}</h1>
              <p className="hero-description">{activeMode.description}</p>
            </div>
            <div className="hero-aside">
              <div className="hero-card">
                <span className="hero-card-label">{activeMode.statLabel}</span>
                <strong>{activeMode.statValue}</strong>
              </div>
              <div className="hero-card muted">
                <span className="hero-card-label">Tools</span>
                <strong>AI-assisted drafting and feedback</strong>
              </div>
            </div>
          </section>
        )}

        <main>
        {activeTab === 'coverLetter'
          ? <CoverLetter uiVariant={UI_VARIANT} />
          : activeTab === 'interview'
          ? <Interview uiVariant={UI_VARIANT} />
          : activeTab === 'cvMatch'
          ? <CvMatch uiVariant={UI_VARIANT} />
          : <CvRewrite uiVariant={UI_VARIANT} />}
        </main>
      </div>
    </div>
  )
}

export default App
