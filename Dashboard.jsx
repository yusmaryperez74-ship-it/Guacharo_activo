import React from 'react';
import { RefreshCw, Download, TrendingUp, Clock, Trophy, Activity } from 'lucide-react';

const Dashboard = ({ data, onUpdate, onRefresh }) => {
  const { predictions, history, stats, loading } = data;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  const getAnimalIcon = (animal) => {
    const icons = {
      'delfín': '🐬', 'carnero': '🐏', 'toro': '🐂', 'ciempiés': '🐛', 'alacrán': '🦂',
      'león': '🦁', 'rana': '🐸', 'perico': '🦜', 'ratón': '🐭', 'águila': '🦅',
      'tigre': '🐅', 'gato': '🐱', 'caballo': '🐴', 'mono': '🐵', 'paloma': '🕊️',
      'zorro': '🦊', 'oso': '🐻', 'pavo': '🦃', 'burro': '🫏', 'chivo': '🐐',
      'cochino': '🐷', 'gallo': '🐓', 'camello': '🐪', 'cebra': '🦓', 'iguana': '🦎',
      'gallina': '🐔', 'vaca': '🐄', 'perro': '🐕', 'zamuro': '🦅', 'elefante': '🐘',
      'caimán': '🐊', 'lapa': '🐰', 'ardilla': '🐿️', 'pescado': '🐟', 'venado': '🦌',
      'jirafa': '🦒', 'culebra': '🐍', 'tortuga': '🐢', 'lechuza': '🦉', 'chigüire': '🦫',
      'gorila': '🦍', 'canguro': '🦘', 'puercoespín': '🦔', 'jorobado': '🐪', 'garza': '🦢',
      'ballena': '🐋', 'puma': '🐆', 'pavo real': '🦚', 'hormiga': '🐜', 'oso hormiguero': '🐻',
      'pereza': '🦥', 'canario': '🐤', 'cotorra': '🦜', 'pulpo': '🐙', 'caracol': '🐌',
      'grillo': '🦗', 'mapache': '🦝', 'tiburón': '🦈', 'pato': '🦆', 'murciélago': '🦇',
      'nutria': '🦦', 'camaleón': '🦎', 'rinoceronte': '🦏', 'cachicamo': '🦔', 'gavilán': '🦅',
      'araña': '🕷️', 'sapo': '🐸', 'comadreja': '🦔', 'conejo': '🐰', 'serpiente': '🐍',
      'guacamaya': '🦜', 'cocodrilo': '🐊', 'hipopótamo': '🦛', 'pantera': '🐆', 'cuervo': '🐦‍⬛',
      'búho': '🦉'
    };
    return icons[animal?.toLowerCase()] || '🔮';
  };

  const topPredictions = predictions.slice(0, 3);
  const recentResults = history.slice(0, 5);

  return (
    <div className="fade-in">
      {/* Header con acciones */}
      <div className="card-header">
        <h2 className="card-title">
          <Activity size={24} />
          Dashboard - Guácharo Predictor
        </h2>
        <div className="card-actions">
          <button onClick={onUpdate} className="btn btn-success">
            <Download size={16} />
            Actualizar Datos
          </button>
          <button onClick={onRefresh} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refrescar
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {stats && (
        <div className="grid grid-4 mb-lg">
          <div className="card">
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div className="text-xl font-bold">{stats.total_sorteos}</div>
              <div className="text-sm text-secondary">Total Sorteos</div>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <div className="text-xl font-bold">{stats.numeros_diferentes}</div>
              <div className="text-sm text-secondary">Números Únicos</div>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
              <div className="text-xl font-bold">{stats.rango_fechas?.hasta || 'N/A'}</div>
              <div className="text-sm text-secondary">Última Fecha</div>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <div className="text-xl font-bold">
                {stats.top_frecuentes?.[0]?.numero || 'N/A'}
              </div>
              <div className="text-sm text-secondary">Más Frecuente</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        {/* Top Predicciones */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Top 3 Predicciones
            </h3>
          </div>
          
          {topPredictions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topPredictions.map((pred, index) => (
                <div key={pred.Numero} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: index === 0 ? '2px solid var(--primary)' : '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                               index === 1 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' :
                               'linear-gradient(135deg, #CD7F32, #B8860B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    #{index + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{getAnimalIcon(pred.Animal)}</span>
                      <span className="font-semibold">{pred.Numero} - {pred.Animal}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Score: {Math.round(pred.Score_Total * 100)}%
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {Math.round(pred.Score_Total * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔮</div>
              <p>No hay predicciones disponibles</p>
            </div>
          )}
        </div>

        {/* Últimos Resultados */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={20} />
              Últimos Resultados
            </h3>
          </div>
          
          {recentResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentResults.map((result, index) => (
                <div key={`${result.Fecha}-${result.Hora}-${index}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {result.Num_Ganador}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span>{getAnimalIcon(result.Animal_Gan)}</span>
                      <span className="font-semibold">{result.Animal_Gan}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {result.Fecha} • {result.Hora}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No hay resultados disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Último resultado destacado */}
      {stats?.ultimo_resultado && (
        <div className="card" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>🏆 Último Resultado Oficial</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>{getAnimalIcon(stats.ultimo_resultado.animal)}</div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {stats.ultimo_resultado.numero} - {stats.ultimo_resultado.animal}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  {stats.ultimo_resultado.fecha} • {stats.ultimo_resultado.hora}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;