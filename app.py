# backend/app.py - IMPORTS ROBUSTOS
import os
import sys
import importlib.util
from datetime import datetime

print("🚀 INICIANDO GUÁCHARO PREDICTOR API")
print("=" * 50)

# ============================================
# CONFIGURACIÓN DE RUTAS
# ============================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UTILS_DIR = os.path.join(BASE_DIR, 'utils')

print(f"📁 Directorio base: {BASE_DIR}")
print(f"📁 Carpeta utils: {UTILS_DIR}")

# Agregar rutas al sys.path
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, UTILS_DIR)

# ============================================
# CARGAR MÓDULOS LOCALES (utils_map)
# ============================================
def cargar_modulo_local(nombre_archivo):
    """Carga un módulo Python desde archivo"""
    ruta = os.path.join(UTILS_DIR, nombre_archivo)
    
    if not os.path.exists(ruta):
        print(f"⚠ {nombre_archivo} no encontrado en: {ruta}")
        return None
    
    try:
        nombre_modulo = nombre_archivo.replace('.py', '')
        spec = importlib.util.spec_from_file_location(nombre_modulo, ruta)
        modulo = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(modulo)
        print(f"✅ {nombre_archivo} cargado correctamente")
        return modulo
    except Exception as e:
        print(f"❌ Error cargando {nombre_archivo}: {e}")
        return None

# Cargar utils_map
utils_map = cargar_modulo_local('utils_map.py')

if utils_map:
    nombre_a_numero = utils_map.nombre_a_numero
    numero_a_nombre = utils_map.numero_a_nombre
    print(f"🔧 Funciones disponibles: nombre_a_numero(), numero_a_nombre()")
else:
    # Funciones de emergencia si no se puede cargar el módulo
    print("⚠ Usando funciones de emergencia...")
    def nombre_a_numero(nombre):
        basic_map = {"zorro": 15, "gallo": 21, "cochino": 20, "ballena": 100, "delfin": 0}
        return basic_map.get(str(nombre).lower().strip(), None)
    
    def numero_a_nombre(numero):
        basic_map = {15: "Zorro", 21: "Gallo", 20: "Cochino", 100: "Ballena", 0: "Delfín"}
        return basic_map.get(numero, f"Animal-{numero}")

# ============================================
# CARGAR FLASK (dependencia externa)
# ============================================
try:
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    import pandas as pd
    import numpy as np
    
    FLASK_AVAILABLE = True
    print("✅ Flask y dependencias cargadas")
    
except ImportError as e:
    FLASK_AVAILABLE = False
    print(f"❌ Error importando dependencias: {e}")
    print("\n💡 SOLUCIÓN: Ejecuta estos comandos:")
    print("   cd backend")
    print("   .\\venv\\Scripts\\Activate.ps1")
    print("   pip install flask flask-cors pandas numpy")
    print("\n⏳ Saliendo...")
    sys.exit(1)

# ============================================
# CREAR APLICACIÓN FLASK
# ============================================
app = Flask(__name__)
CORS(app)

print("✅ Aplicación Flask creada")
print("🌐 Servidor listo en: http://localhost:5000")
print("=" * 50)

# ... el resto de tu app.py (rutas, etc) continúa aquí ...
@app.route('/')
def home():
    return jsonify({
        'status': 'online',
        'project': 'Guácharo Predictor API',
        'version': '1.0.0',
        'time': datetime.now().isoformat(),
        'endpoints': {
            '/': 'Esta página',
            '/api/health': 'Estado del sistema',
            '/api/animals': 'Lista de animales',
            '/api/test': 'Prueba de funciones',
            '/api/predict': 'Predicciones del modelo (params: top)',
            '/api/history': 'Historial de resultados (params: limit, fecha)',
            '/api/stats': 'Estadísticas generales',
            '/api/update-data': 'Actualizar datos (POST)'
        }
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'python_version': sys.version,
        'flask_available': FLASK_AVAILABLE,
        'utils_loaded': utils_map is not None
    })

@app.route('/api/test')
def test():
    return jsonify({
        'test_conversion': {
            'zorro_to_number': nombre_a_numero('zorro'),
            '15_to_animal': numero_a_nombre(15),
            'ballena_to_number': nombre_a_numero('ballena'),
            '100_to_animal': numero_a_nombre(100)
        }
    })

@app.route('/api/animals')
def animals_list():
    """
    Retorna la lista completa de los 77 animales del Guácharo Activo
    """
    # Generar lista completa de animales (0-75 + 100)
    numeros = list(range(0, 76)) + [100]
    animales = []
    
    for num in numeros:
        nombre = numero_a_nombre(num)
        animales.append({
            'numero': num,
            'nombre': nombre
        })
    
    return jsonify({
        'status': 'success',
        'count': len(animales),
        'animals': animales,
        'special_notes': {
            '0': 'Delfín - Representa el número 0',
            '100': 'Ballena - Representa el 00 en lotería'
        },
        'info': 'Lista completa de 77 animales del Guácharo Activo'
    })

# ============================================
# NUEVOS ENDPOINTS PARA LA APP MÓVIL
# ============================================

CSV_FILE = "resultados_guacharo.csv"

@app.route('/api/predict', methods=['GET'])
def predict():
    """
    Retorna predicciones del modelo
    Query params:
    - top: número de predicciones (default: 10)
    """
    try:
        from predictor_model import generar_predicciones
        
        top = request.args.get('top', 10, type=int)
        
        # Verificar que existe el CSV
        if not os.path.exists(CSV_FILE):
            return jsonify({
                'status': 'error',
                'message': 'No hay datos disponibles. Ejecuta data_update.py primero'
            }), 404
        
        # Cargar datos
        df = pd.read_csv(CSV_FILE)
        
        # Verificar que hay datos
        if df.empty:
            return jsonify({
                'status': 'error',
                'message': 'El archivo de datos está vacío'
            }), 404
        
        # Generar predicciones
        predicciones = generar_predicciones(df, top_k=top)
        
        # Convertir a formato JSON, reemplazando NaN con 0
        predicciones = predicciones.fillna(0)
        resultado = predicciones.to_dict('records')
        
        return jsonify({
            'status': 'success',
            'count': int(len(resultado)),
            'predictions': resultado,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/history', methods=['GET'])
def history():
    """
    Retorna historial de resultados
    Query params:
    - limit: número de resultados (default: 50)
    - fecha: filtrar por fecha (formato: YYYY/MM/DD)
    """
    try:
        limit = request.args.get('limit', 50, type=int)
        fecha_filtro = request.args.get('fecha', None)
        
        # Verificar que existe el CSV
        if not os.path.exists(CSV_FILE):
            return jsonify({
                'status': 'error',
                'message': 'No hay datos disponibles'
            }), 404
        
        # Cargar datos
        df = pd.read_csv(CSV_FILE)
        
        # Aplicar filtro de fecha si existe
        if fecha_filtro:
            df = df[df['Fecha'] == fecha_filtro]
        
        # Convertir Fecha a datetime para ordenar correctamente
        df['Fecha_dt'] = pd.to_datetime(df['Fecha'], format='%Y/%m/%d', errors='coerce')
        
        # Crear columna de hora en formato 24h para ordenar
        def hora_a_24h(hora_str):
            try:
                from datetime import datetime
                hora_obj = datetime.strptime(hora_str, '%I:%M %p')
                return hora_obj.hour * 60 + hora_obj.minute
            except:
                return 0
        
        df['Hora_minutos'] = df['Hora'].apply(hora_a_24h)
        
        # Ordenar por fecha descendente y hora descendente (más recientes primero)
        df = df.sort_values(['Fecha_dt', 'Hora_minutos'], ascending=[False, False])
        
        # Eliminar columnas auxiliares
        df = df.drop(['Fecha_dt', 'Hora_minutos'], axis=1)
        
        # Limitar resultados
        df = df.head(limit)
        
        # Convertir a JSON, reemplazando NaN con None
        resultados = df.fillna('').to_dict('records')
        
        return jsonify({
            'status': 'success',
            'count': int(len(resultados)),
            'results': resultados
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/update-data', methods=['POST'])
def update_data():
    """
    Actualiza los datos ejecutando el script de scraping
    """
    try:
        import subprocess
        
        print("🔄 Iniciando actualización de datos...")
        
        # Ejecutar data_update.py con el Python del venv
        python_exe = os.path.join(BASE_DIR, 'venv', 'Scripts', 'python.exe')
        if not os.path.exists(python_exe):
            python_exe = 'python'  # Fallback
        
        result = subprocess.run(
            [python_exe, 'data_update.py'],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            # Recargar datos
            if os.path.exists(CSV_FILE):
                df = pd.read_csv(CSV_FILE)
                
                # Convertir NaN a valores válidos
                fecha_min = str(df['Fecha'].min()) if not pd.isna(df['Fecha'].min()) else 'N/A'
                fecha_max = str(df['Fecha'].max()) if not pd.isna(df['Fecha'].max()) else 'N/A'
                
                return jsonify({
                    'status': 'success',
                    'message': 'Datos actualizados correctamente',
                    'total_registros': int(len(df)),
                    'fechas_unicas': int(df['Fecha'].nunique()),
                    'rango': {
                        'desde': fecha_min,
                        'hasta': fecha_max
                    },
                    'output': result.stdout[:500] if result.stdout else ''  # Limitar output
                })
            else:
                return jsonify({
                    'status': 'success',
                    'message': 'Actualización completada pero no se encontró el CSV',
                    'output': result.stdout
                })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Error al actualizar datos',
                'error': result.stderr
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'status': 'error',
            'message': 'Timeout: La actualización tardó más de 60 segundos'
        }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """
    Retorna estadísticas generales
    """
    try:
        # Verificar que existe el CSV
        if not os.path.exists(CSV_FILE):
            return jsonify({
                'status': 'error',
                'message': 'No hay datos disponibles'
            }), 404
        
        # Cargar datos
        df = pd.read_csv(CSV_FILE)
        
        # Convertir Num_Ganador a numérico
        df['Num_Ganador'] = pd.to_numeric(df['Num_Ganador'], errors='coerce')
        df = df.dropna(subset=['Num_Ganador'])
        df['Num_Ganador'] = df['Num_Ganador'].astype(int)
        
        # Estadísticas básicas
        total_sorteos = len(df)
        
        # Top 10 más frecuentes
        top_frecuentes = df['Num_Ganador'].value_counts().head(10)
        top_list = []
        for num, count in top_frecuentes.items():
            top_list.append({
                'numero': int(num),
                'animal': numero_a_nombre(int(num)),
                'frecuencia': int(count),
                'porcentaje': round((count / total_sorteos) * 100, 2)
            })
        
        # Números únicos que han salido
        numeros_salidos = sorted(df['Num_Ganador'].unique().tolist())
        
        # Estadísticas por hora
        stats_hora = df.groupby('Hora').size().to_dict()
        
        # Último resultado
        ultimo = df.iloc[-1] if not df.empty else None
        ultimo_resultado = {
            'fecha': ultimo['Fecha'],
            'hora': ultimo['Hora'],
            'animal': ultimo['Animal_Gan'],
            'numero': int(ultimo['Num_Ganador'])
        } if ultimo is not None else None
        
        # Convertir fechas a string para evitar NaN en JSON
        fecha_min = str(df['Fecha'].min()) if not pd.isna(df['Fecha'].min()) else 'N/A'
        fecha_max = str(df['Fecha'].max()) if not pd.isna(df['Fecha'].max()) else 'N/A'
        
        return jsonify({
            'status': 'success',
            'total_sorteos': int(total_sorteos),
            'numeros_diferentes': int(len(numeros_salidos)),
            'top_frecuentes': top_list,
            'por_hora': {str(k): int(v) for k, v in stats_hora.items()},
            'ultimo_resultado': ultimo_resultado,
            'rango_fechas': {
                'desde': fecha_min,
                'hasta': fecha_max
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    import os
    
    # Obtener puerto de variable de entorno (Railway/Render) o usar 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    
    # Detectar si estamos en producción
    is_production = os.environ.get('RAILWAY_ENVIRONMENT') or os.environ.get('RENDER')
    
    if not is_production:
        print("\n🎯 INICIANDO SERVIDOR LOCAL...")
        print(f"📍 Puerto: {port}")
        print("📍 Presiona Ctrl+C para detener")
        print("=" * 50)
    
    app.run(host='0.0.0.0', port=port, debug=not is_production)