# 🚀 INSTRUCCIONES PARA RENDER - CORREGIDAS

## 📋 Pasos para Desplegar

### 1. Subir a GitHub
1. Crea un repositorio público en GitHub
2. Sube todos estos archivos al repositorio

### 2. Configurar Render
1. Ve a https://render.com/
2. Crea cuenta con GitHub
3. New Web Service
4. Conecta tu repositorio

### 3. Configuración del Servicio ⚠️ IMPORTANTE
- **Name:** guacharo-predictor
- **Root Directory:** (DEJAR VACÍO - archivos están en la raíz)
- **Environment:** Python 3
- **Build Command:** pip install -r requirements.txt
- **Start Command:** python app.py
- **Plan:** Free

### 4. Archivos Organizados para Render
✅ requirements.txt - En la raíz (Render lo encontrará)
✅ app.py - En la raíz (archivo principal)
✅ Procfile - En la raíz (comando de inicio)
✅ runtime.txt - En la raíz (Python 3.11.0)
✅ utils/ - Carpeta con utilidades
✅ Backend/ - Carpeta original (respaldo)
✅ mobile/ - App móvil para APK

### 5. Obtener URL
Una vez desplegado, obtendrás una URL como:
https://guacharo-predictor.onrender.com

### 6. Actualizar config.js
Edita mobile/config.js y cambia:
: "https://TU-URL.onrender.com"

### 7. Generar APK
cd mobile
npm install
eas build --platform android --profile production

¡El APK funcionará desde cualquier red!

## 🆘 Si Hay Errores

### "Could not open requirements file"
✅ SOLUCIONADO - requirements.txt está en la raíz

### "Module not found"
- Verifica que utils/utils_map.py esté incluido
- Todos los archivos Python están en la raíz

### "Application failed to respond"
- Verifica que app.py use os.environ.get('PORT')
- El Procfile debe decir: web: python app.py