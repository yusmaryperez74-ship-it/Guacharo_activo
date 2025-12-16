import React from 'react';
import { BarChart3, RefreshCw, Trophy, TrendingUp, Calendar, Target } from 'lucide-react';

const Stats = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Calculando estadísticas avanzadas...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3>No hay estadísticas disponibles</h3>
        <p>Asegúrate de que el backend esté corriendo y tenga datos.</p>
        <button onClick={onRefresh} className="btn" style={{ marginTop: '1rem' }}>
          <RefreshCw size={16} />
          Reintentar
        </button>
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
      'búho': '🦉',
      // NUEVOS ANIMALES 76-85
      'pelícano': '🦢', 'guácharo': '🦇', 'búfalo': '🐃', 'tucán': '🦜', 'mariposa': '🦋',
      'avestruz': '🦤', 'turpial': '🐦', 'cangrejo': '🦀', 'bisonte': '🦬', 'lobo': '🐺'
    };
    return icons[animal?.toLowerCase()] || '🔮';
  };

  return (
    <div className="fade-in">
      <div className="card-header">
        <h2 className="card-title">
          <BarChart3 size={24} />
          Estadísticas Avanzadas
        </h2>
        <div className="card-actions">
          <button onClick={onRefresh} className="btn btn-secondary">
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-4 mb-lg">
        <div className="card">
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
            <div className="text-xl font-bold">{data.total_sorteos}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Sorteos</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <div className="text-xl font-bold">{data.numeros_diferentes}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Números Únicos</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <div className="text-xl font-bold">{data.rango_fechas?.desde || 'N/A'}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Primera Fecha</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <div className="text-xl font-bold">{data.rango_fechas?.hasta || 'N/A'}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Última Fecha</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Top 10 más frecuentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Trophy size={20} />
              Top 10 Más Frecuentes
            </h3>
          </div>
          
          {data.top_frecuentes && data.top_frecuentes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.top_frecuentes.slice(0, 10).map((item, index) => (
                <div key={item.numero} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: index < 3 ? `2px solid ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}` : '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                               index === 1 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' :
                               index === 2 ? 'linear-gradient(135deg, #CD7F32, #B8860B)' :
                               'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}>
                    #{index + 1}
                  </div>
                  
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {item.numero}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span>{getAnimalIcon(item.animal)}</span>
                      <span className="font-semibold">{item.animal}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {item.frecuencia} veces • {item.porcentaje}%
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
                    {item.porcentaje}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <p>No hay datos de frecuencia</p>
            </div>
          )}
        </div>

        {/* Estadísticas por hora */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={20} />
              Distribución por Hora
            </h3>
          </div>
          
          {data.por_hora && Object.keys(data.por_hora).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(data.por_hora)
                .sort(([,a], [,b]) => b.cantidad - a.cantidad)
                .slice(0, 12)
                .map(([hora, info]) => {
                  const maxCantidad = Math.max(...Object.values(data.por_hora).map(h => h.cantidad));
                  const porcentaje = Math.round((info.cantidad / maxCantidad) * 100);
                  
                  return (
                    <div key={hora} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'var(--surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ width: '80px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        🕐 {hora}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          height: '8px',
                          background: 'var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            width: `${porcentaje}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        
                        {/* Información del animal más frecuente */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          fontSize: '0.875rem'
                        }}>
                          <span style={{ fontSize: '1rem' }}>
                            {getAnimalIcon(info.animal_frecuente.nombre)}
                          </span>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                            {info.animal_frecuente.nombre}
                          </span>
                          <span style={{ 
                            background: 'var(--primary-light)', 
                            color: 'var(--primary-dark)',
                            padding: '0.125rem 0.375rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            #{info.animal_frecuente.numero}
                          </span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            {info.animal_frecuente.frecuencia}x ({info.animal_frecuente.porcentaje}%)
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ 
                        width: '50px', 
                        textAlign: 'right', 
                        fontWeight: 'bold', 
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)'
                      }}>
                        {info.cantidad}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <p>No hay datos por hora</p>
            </div>
          )}
        </div>
      </div>

      {/* Último resultado destacado */}
      {data.ultimo_resultado && (
        <div className="card" style={{ 
          marginTop: '1.5rem', 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
          color: 'white',
          border: 'none'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Target size={24} />
              Último Resultado Oficial
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '4rem' }}>{getAnimalIcon(data.ultimo_resultado.animal)}</div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {data.ultimo_resultado.numero} - {data.ultimo_resultado.animal}
                </div>
                <div style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                  📅 {data.ultimo_resultado.fecha} • 🕐 {data.ultimo_resultado.hora}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;