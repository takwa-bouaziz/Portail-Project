import { useEffect, useState } from 'react'
import './App.css'
import api from './api'
import Auth from './components/Auth'
import CoverLetter from './components/CoverLetter'
import Interview from './components/Interview'
import CvMatch from './components/CvMatch'
import CvRewrite from './components/CvRewrite'
import History from './components/History'
import HrCvRanking from './components/HrCvRanking'
import HrInterviewGuide from './components/HrInterviewGuide'
import { UI_VARIANT } from './uiVariant'

const modes = {
  coverLetter: {
    eyebrow: 'Candidature',
    statValue: 'Qualité du dossier',
  },
  interview: {
    eyebrow: 'Entretien',
    statValue: 'Préparation candidat',
  },
  cvMatch: {
    eyebrow: 'Analyse CV',
    statValue: 'Pertinence du profil',
  },
  cvRewrite: {
    eyebrow: 'Reformulation',
    statValue: 'Clarté du CV',
  },
  history: {
    eyebrow: 'Suivi',
    statValue: 'Traçabilité',
  },
  hrInterviewGuide: {
    eyebrow: 'Guide RH',
    statValue: 'Questions utiles',
  },
  hrCvRanking: {
    eyebrow: 'Sélection RH',
    statValue: 'CV gagnants',
  },
}

const candidateTabs = [
  { id: 'coverLetter', label: 'Lettre' },
  { id: 'interview', label: 'Entretien' },
  { id: 'cvMatch', label: 'Matching' },
  { id: 'cvRewrite', label: 'Reformulation' },
  { id: 'history', label: 'Historique' },
]

const advisorTabs = [
  { id: 'hrInterviewGuide', label: 'Questions entretien' },
  { id: 'hrCvRanking', label: 'Classement CV' },
  { id: 'history', label: 'Historique' },
]

function App() {
  const [activeTab, setActiveTab] = useState('coverLetter')
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const activeMode = modes[activeTab]
  const tabs = user?.role === 'conseiller_rh' ? advisorTabs : candidateTabs

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await api.get('/api/accounts/me/')
        setUser(response.data.user)
        if (response.data.user.role === 'conseiller_rh') {
          setActiveTab('hrInterviewGuide')
        }
      } catch {
        setUser(null)
      } finally {
        setCheckingAuth(false)
      }
    }

    loadCurrentUser()
  }, [])

  const logout = async () => {
    await api.post('/api/accounts/logout/')
    setUser(null)
    setActiveTab('coverLetter')
  }

  const handleAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser)
    setActiveTab(authenticatedUser.role === 'conseiller_rh' ? 'hrInterviewGuide' : 'coverLetter')
  }

  if (checkingAuth) {
    return (
      <div className="App">
        <div className="loading-screen">Chargement du portail...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className={`App app--${UI_VARIANT}`}>
      <div className="page-shell">
        <header className="topbar">
          <div className="brand-block">
            <span className="brand-mark">CV</span>
            <div>
              <p className="brand-name">Career Copilot</p>
              <p className="brand-subtitle">Assistant RH pour candidatures et entretiens</p>
            </div>
          </div>
          <nav className="nav-buttons" aria-label="Sections">
            {tabs.map((tab) => (
              <button
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="user-menu">
            <button className="profile-trigger" type="button" aria-label="Menu utilisateur">
              <span className="avatar-mark">
                {(user.first_name || user.username || 'U').slice(0, 1).toUpperCase()}
              </span>
              <span className="profile-name">{user.first_name || user.username}</span>
            </button>
            <div className="profile-popover">
              <span>{user.role_label}</span>
              <button type="button" onClick={logout}>
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">{activeMode.eyebrow}</p>
            <h1>
              {activeTab === 'coverLetter'
                ? 'Rédiger une candidature claire et ciblée.'
                : activeTab === 'interview'
                ? 'Préparer un entretien avec des retours structurés.'
                : activeTab === 'cvMatch'
                ? 'Mesurer l’adéquation entre un CV et une offre.'
                : activeTab === 'cvRewrite'
                ? 'Améliorer une section de CV avec précision.'
                : activeTab === 'hrInterviewGuide'
                ? 'Préparer les questions à poser aux candidats.'
                : activeTab === 'hrCvRanking'
                ? 'Classer les CV et choisir les meilleurs profils.'
                : 'Suivre les actions réalisées sur le portail.'}
            </h1>
            <p className="hero-description">
              {user.role === 'conseiller_rh'
                ? 'Mode conseiller RH: accompagnez les candidats, analysez leurs supports et gardez une trace des actions.'
                : 'Mode candidat: préparez vos candidatures, entraînez-vous et retrouvez vos résultats dans l’historique.'}
            </p>
          </div>
          <div className="hero-metrics">
            <div className="metric-card">
              <span className="hero-card-label">Acteur</span>
              <strong>{user.role_label}</strong>
            </div>
            <div className="metric-card">
              <span className="hero-card-label">Objectif</span>
              <strong>{activeMode.statValue}</strong>
            </div>
          </div>
        </section>

        <main>
          {activeTab === 'coverLetter'
            ? <CoverLetter uiVariant={UI_VARIANT} />
            : activeTab === 'interview'
            ? <Interview uiVariant={UI_VARIANT} />
            : activeTab === 'cvMatch'
            ? <CvMatch uiVariant={UI_VARIANT} />
            : activeTab === 'cvRewrite'
            ? <CvRewrite uiVariant={UI_VARIANT} />
            : activeTab === 'hrInterviewGuide'
            ? <HrInterviewGuide uiVariant={UI_VARIANT} />
            : activeTab === 'hrCvRanking'
            ? <HrCvRanking uiVariant={UI_VARIANT} />
            : <History uiVariant={UI_VARIANT} />}
        </main>
      </div>
    </div>
  )
}

export default App
