import { useState } from 'react';
import api from '../api';

const initialForm = {
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: 'candidat',
};

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/accounts/login/' : '/api/accounts/register/';
      const payload = mode === 'login'
        ? { username: form.username, password: form.password }
        : form;
      const response = await api.post(endpoint, payload);
      onAuthenticated(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="section-kicker">Career Copilot</p>
          <h1>Portail RH intelligent pour candidatures et accompagnement.</h1>
          <p>
            Connectez-vous comme candidat ou conseiller RH pour générer des documents,
            préparer les entretiens et retrouver l’historique des actions.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
            >
              Connexion
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="form-row">
                <div className="input-group">
                  <label>Prénom</label>
                  <input name="first_name" value={form.first_name} onChange={updateField} placeholder="ex: Youssra" />
                </div>
                <div className="input-group">
                  <label>Nom</label>
                  <input name="last_name" value={form.last_name} onChange={updateField} placeholder="ex: Benali" />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Nom d’utilisateur</label>
              <input name="username" value={form.username} onChange={updateField} placeholder="ex: youssra" required />
            </div>

            {mode === 'register' && (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={updateField} placeholder="ex: youssra@email.com" />
                </div>
                <div className="input-group">
                  <label>Rôle</label>
                  <select className="select-input" name="role" value={form.role} onChange={updateField}>
                    <option value="candidat">Candidat</option>
                    <option value="conseiller_rh">Conseiller RH</option>
                  </select>
                </div>
              </>
            )}

            <div className="input-group">
              <label>Mot de passe</label>
              <input name="password" type="password" value={form.password} onChange={updateField} required />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="primary" type="submit" disabled={loading}>
              {loading ? <span className="loading-dots">Traitement</span> : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Auth;
