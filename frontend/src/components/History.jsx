import { useEffect, useState } from 'react';
import api from '../api';

const typeLabels = {
  cover_letter: 'Lettre',
  interview: 'Entretien',
  cv_match: 'Matching',
  cv_rewrite: 'CV',
};

function History({ uiVariant }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isProfessional = uiVariant === 'professional';

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/api/accounts/history/');
        setItems(response.data.items || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Impossible de charger l’historique.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <section className={`tool-layout fade-in ${isProfessional ? 'tool-layout--professional' : ''}`}>
      <div className="section-heading">
        <p className="section-kicker">Historique</p>
        <h2>Retrouver les actions réalisées sur le portail.</h2>
        <p className="subtitle">
          Les lettres, simulations, analyses CV et reformulations sont regroupées ici.
        </p>
      </div>

      <div className="card">
        {loading && <p className="empty-state">Chargement de l’historique...</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="empty-state">Aucune action enregistrée pour le moment.</p>
        )}

        <div className="history-list">
          {items.map((item) => (
            <article className="history-item" key={`${item.type}-${item.id}`}>
              <div>
                <span className="history-type">{typeLabels[item.type] || item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <div className="history-meta">
                {item.score !== null && item.score !== undefined && (
                  <strong>{item.score}%</strong>
                )}
                <span>{new Date(item.created_at).toLocaleString('fr-FR')}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default History;
