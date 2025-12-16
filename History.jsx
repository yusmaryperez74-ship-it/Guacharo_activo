import React, { useState } from 'react';
import { History as HistoryIcon, RefreshCw, Search, Calendar } from 'lucide-react';

const History = ({ data, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando historial completo...</p>
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

  // Filtrar datos
  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.Animal_Gan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Num_Ganador?.toString().includes(searchTerm);
    
    const matchesDate = !dateFilter || item.Fecha?.includes(dateFilter);
    
    return matchesSearch && matchesDate;
  });

  // Agrupar datos por fecha
  const groupedByDate = filteredData.reduce((groups, item) => {
    const date = item.Fecha || 'Sin fecha';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Ordenar fechas de más reciente a más antigua
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    if (a === 'Sin fecha') return 1;
    if (b === 'Sin fecha') return -1;
    return new Date(b.replace(/\//g, '-')) - new Date(a.replace(/\//g, '-'));
  });

  return (
    <div className="fade-in">
      <div className="card-header">
        <h2 className="card-title">
          <HistoryIcon size={24} />
          Historial Completo
        </h2>
        <div className="card-actions">
          <button onClick={onRefresh} className="btn btn-secondary">
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-lg">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <Search size={16} style={{ marginRight: '0.5rem' }} />
              Buscar animal o número
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: león, 5, gato..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <Calendar size={16} style={{ marginRight: '0.5rem' }} />
              Filtrar por fecha
            </label>
            <input
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Ej: 2025/12/14"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
        
        {(searchTerm || dateFilter) && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Mostrando {filteredData.length} de {data.length} resultados
              {searchTerm && ` • Búsqueda: "${searchTerm}"`}
              {dateFilter && ` • Fecha: "${dateFilter}"`}
            </p>
          </div>
        )}
      </div>

      {/* Resultados agrupados por fecha */}
      {filteredData.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sortedDates.map(date => (
            <div key={date} className="fade-in">
              {/* Header de fecha */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: 'var(--radius-lg)',
                color: 'white'
              }}>
                <div style={{ fontSize: '1.5rem' }}>📅</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {date}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                    {groupedByDate[date].length} sorteo{groupedByDate[date].length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Resultados del día */}
              <div className="grid grid-3">
                {groupedByDate[date]
                  .sort((a, b) => {
                    // Ordenar por hora dentro del día
                    const timeA = a.Hora || '';
                    const timeB = b.Hora || '';
                    return timeB.localeCompare(timeA);
                  })
                  .map((item, index) => (
                    <div key={`${item.Fecha}-${item.Hora}-${index}`} className="card">
                      {/* Hora del sorteo */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        background: 'var(--surface-elevated)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1rem' }}>🕐</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 'bold',
                            color: 'var(--text-primary)'
                          }}>
                            {item.Hora}
                          </span>
                        </div>
                        {index === 0 && (
                          <span style={{
                            background: 'var(--success)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            Más reciente
                          </span>
                        )}
                      </div>

                      {/* Información del resultado */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          boxShadow: 'var(--shadow-md)'
                        }}>
                          {item.Num_Ganador || '?'}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>{getAnimalIcon(item.Animal_Gan)}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Ganador
                            </span>
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {item.Animal_Gan || 'Pendiente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>
            {searchTerm || dateFilter ? 'No se encontraron resultados' : 'No hay historial disponible'}
          </h3>
          <p>
            {searchTerm || dateFilter 
              ? 'Intenta con otros términos de búsqueda o filtros'
              : 'Asegúrate de que el backend esté corriendo y tenga datos.'
            }
          </p>
          {(searchTerm || dateFilter) && (
            <button 
              onClick={() => { setSearchTerm(''); setDateFilter(''); }} 
              className="btn btn-secondary" 
              style={{ marginTop: '1rem' }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default History;