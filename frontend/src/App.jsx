import { useState } from 'react'
import './App.css'
import CoverLetter from './components/CoverLetter'
import Interview from './components/Interview'

function App() {
  const [activeTab, setActiveTab] = useState('coverLetter');

  return (
    <div className="App">
      <nav>
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${activeTab === 'coverLetter' ? 'active' : ''}`}
            onClick={() => setActiveTab('coverLetter')}
          >
            📄 Lettre de Motivation
          </button>
          <button 
            className={`nav-btn ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            🎤 Simulation d'Entretien
          </button>
        </div>
      </nav>

      <main>
        {activeTab === 'coverLetter' ? <CoverLetter /> : <Interview />}
      </main>
    </div>
  )
}

export default App
