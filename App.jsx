import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, History as HistoryIcon, BarChart3, Settings, Moon, Sun, Smartphone } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Predictions from './components/Predictions';
import History from './components/History';
import Stats from './components/Stats';
import './App.css';

const API_URL = 'https://guacharo-activo-znl5.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState({
    predictions: [],
    history: [],
    stats: null,
    loading: true
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  // Aplicar tema oscuro
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const loadAllData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      const [predictionsRes, historyRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/predict?top=10`),
        fetch(`${API_URL}/api/history?limit=50`),
        fetch(`${API_URL}/api/stats`)
      ]);

      const predictions = await predictionsRes.json();
      const history = await historyRes.json();
      const stats = await statsRes.json();

      setData({
        predictions: predictions.status === 'success' ? predictions.predictions : [],
        history: history.status === 'success' ? history.results : [],
        stats: stats.status === 'success' ? stats : null,
        loading: false
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const updateData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/update-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        alert(`✅ Datos actualizados: ${result.total_registros} registros nuevos`);
        loadAllData();
      } else {
        alert(`ℹ️ ${result.message}`);
      }
    } catch (error) {
      alert(`❌ Error actualizando datos: ${error.message}`);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'predictions', label: 'Predicciones', icon: TrendingUp },
    { id: 'history', label: 'Historial', icon: HistoryIcon },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 }
  ];

  // Normalizar datos de predicciones para compatibilidad
  const normalizePredictions = (predictions) => {
    if (!predictions || !Array.isArray(predictions)) return [];
    
    return predictions.map(pred => ({
      // Formato nuevo (local) o formato viejo (Render)
      Numero: pred.Numero || pred.numero || 0,
      Animal: pred.Animal || pred.animal || 'Desconocido',
      Score_Total: pred.Score_Total || (pred.probabilidad ? pred.probabilidad / 100 : 0),
      Score_Frecuencia: pred.Score_Frecuencia || (pred.frecuencia ? pred.frecuencia / 10 : 0),
      Score_Recencia: pred.Score_Recencia || 0.5, // Valor por defecto
      Score_Tendencia: pred.Score_Tendencia || 0.3, // Valor por defecto
      Frecuencia_Absoluta: pred.Frecuencia_Absoluta || pred.frecuencia || 0,
      Probabilidad_Porcentaje: pred.Probabilidad_Porcentaje || pred.probabilidad || 0
    }));
  };

  const renderContent = () => {
    console.log('Current activeTab:', activeTab);
    const normalizedData = {
      ...data,
      predictions: normalizePredictions(data.predictions)
    };

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={normalizedData} onUpdate={updateData} onRefresh={loadAllData} />;
      case 'predictions':
        return <Predictions data={normalizedData.predictions} loading={data.loading} onRefresh={loadAllData} />;
      case 'history':
        return <History data={data.history} loading={data.loading} onRefresh={loadAllData} />;
      case 'stats':
        return <Stats data={data.stats} loading={data.loading} onRefresh={loadAllData} />;
      default:
        return <Dashboard data={normalizedData} onUpdate={updateData} onRefresh={loadAllData} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🔮</span>
            <h1>Guácharo Predictor</h1>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
              title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a
              href="exp://vyle5tg-yusmary0993-8083.exp.direct"
              className="mobile-link"
              title="Abrir App Móvil"
            >
              <Smartphone size={20} />
              <span>App Móvil</span>
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Clicking tab:', tab.id);
                setActiveTab(tab.id);
              }}
              className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Guácharo Predictor - Predicciones inteligentes de animalitos</p>
        <p>API: <code>{API_URL}</code></p>
      </footer>
    </div>
  );
}

export default App;