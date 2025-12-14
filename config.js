// Configuración del Backend para Expo y APK

// 🔹 IMPORTANTE: Usa la IP de tu red WiFi (192.168.x.x)
// Para encontrar tu IP: ipconfig en Windows, busca "Adaptador de LAN inalámbrica"
const LOCAL_IP = "192.168.9.100"; // ⚠️ IP actual de tu PC

const config = {
  API_URL: __DEV__
    ? `http://${LOCAL_IP}:5000` // 🔹 Expo Go (desarrollo local)
    : "https://guacharo-activo-znl5.onrender.com", // 🔹 APK (producción - URL correcta de Render)

  TIMEOUT: 60000, // 60 segundos - balance entre velocidad y confiabilidad
};

export default config;
