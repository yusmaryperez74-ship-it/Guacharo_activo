import React from 'react';
import { TrendingUp, RefreshCw, Trophy, Target, Clock, Zap } from 'lucide-react';

const Predictions = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Generando predicciones inteligentes...</p>
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

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

  const getScoreColor = (score) => {
    if (score > 0.7) return 'var(--success)';
    if (score > 0.4) return 'var(--warning)';
    return 'var(--text-secondary)';
  };

  const ScoreBar = ({ label, value, color, isMain = false }) => {
    const percentage = Math.round((value || 0) * 100);
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        marginBottom: isMain ? '0.75rem' : '0.5rem',
        paddingBottom: isMain ? '0.5rem' : '0',
        borderBottom: isMain ? '1px solid var(--border)' : 'none'
      }}>
        <div style={{ 
          width: '70px', 
          fontSize: isMain ? '0.875rem' : '0.75rem',
          fontWeight: isMain ? '600' : '500',
          color: isMain ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>
          {label}
        </div>
        <div style={{ 
          flex: 1, 
          height: isMain ? '10px' : '8px', 
          background: 'var(--border)', 
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            borderRadius: 'var(--radius-sm)',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          width: '38px', 
          textAlign: 'right',
          fontSize: isMain ? '0.875rem' : '0.75rem',
          fontWeight: 'bold',
          color: isMain ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>
          {percentage}%
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="card-header">
        <h2 className="card-title">
          <TrendingUp size={24} />
          Predicciones Inteligentes
        </h2>
        <div className="card-actions">
          <button onClick={onRefresh} className="btn btn-secondary">
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      {data.length > 0 ? (
        <>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>Top {data.length} animales con mayor probabilidad basado en análisis de frecuencia, recencia y tendencias</p>
          </div>

          <div className="grid grid-2">
            {data.map((prediction, index) => {
              const numero = prediction.Numero || 0;
              const animal = prediction.Animal || 'Desconocido';
              const scoreTotal = prediction.Score_Total || 0;
              const scoreFrecuencia = prediction.Score_Frecuencia || 0;
              const scoreRecencia = prediction.Score_Recencia || 0;
              const scoreTendencia = prediction.Score_Tendencia || 0;

              return (
                <div key={numero} className="card" style={{
                  border: index < 3 ? `2px solid ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}` : '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Badge de ranking */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                               index === 1 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' :
                               index === 2 ? 'linear-gradient(135deg, #CD7F32, #B8860B)' :
                               'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <div style={{ fontSize: '1rem' }}>{getRankIcon(index + 1)}</div>
                    <div>#{index + 1}</div>
                  </div>

                  {/* Información principal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingRight: '3rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      {numero}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{getAnimalIcon(animal)}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>
                          Animal
                        </span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {animal}
                      </div>
                    </div>
                  </div>

                  {/* Scores */}
                  <div>
                    <ScoreBar 
                      label="Total" 
                      value={scoreTotal} 
                      color={getScoreColor(scoreTotal)}
                      isMain={true}
                    />
                    <ScoreBar 
                      label="Frecuencia" 
                      value={scoreFrecuencia} 
                      color="var(--secondary)"
                    />
                    <ScoreBar 
                      label="Recencia" 
                      value={scoreRecencia} 
                      color="var(--warning)"
                    />
                    <ScoreBar 
                      label="Tendencia" 
                      value={scoreTendencia} 
                      color="#8B5CF6"
                    />
                  </div>

                  {/* Información adicional */}
                  {prediction.Frecuencia_Absoluta && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      background: 'var(--surface-elevated)', 
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Apariciones:</span>
                        <span className="font-semibold">{prediction.Frecuencia_Absoluta}</span>
                      </div>
                      {prediction.Probabilidad_Porcentaje && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Probabilidad:</span>
                          <span className="font-semibold">{prediction.Probabilidad_Porcentaje}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="card" style={{ marginTop: '1.5rem', background: 'var(--surface-elevated)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} />
              Explicación de Scores
            </h3>
            <div className="grid grid-2">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%' }}></div>
                  <strong>Score Total:</strong> Puntuación general combinada
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--secondary)', borderRadius: '50%' }}></div>
                  <strong>Frecuencia:</strong> Qué tan seguido aparece
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--warning)', borderRadius: '50%' }}></div>
                  <strong>Recencia:</strong> Qué tan reciente fue su aparición
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: '#8B5CF6', borderRadius: '50%' }}></div>
                  <strong>Tendencia:</strong> Patrón en apariciones recientes
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔮</div>
          <h3>No hay predicciones disponibles</h3>
          <p>Asegúrate de que el backend esté corriendo y tenga datos.</p>
          <button onClick={onRefresh} className="btn" style={{ marginTop: '1rem' }}>
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

export default Predictions;