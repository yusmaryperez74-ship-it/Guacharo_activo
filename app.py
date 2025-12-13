# app.py - GUÁCHARO PREDICTOR API PARA RENDER
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
BACKEND_DIR = os.path.join(BASE_DIR, 'Backend')

print(f"📁 Directorio base: {BASE_DIR}")
print(f"📁 Carpeta utils: {UTILS_DIR}")
print(f"📁 Carpeta Backend: {BACKEND_DIR}")

# Agregar rutas al sys.path
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, UTILS_DIR)
sys.path.insert(0, BACKEND_DIR)

# ============================================
# CARGAR MÓDULOS LOCALES (utils_map)
# ============================================
def cargar_modulo_local(nombre_archivo):
    """Carga un módulo Python desde archivo"""
    # Buscar en utils/ primero, luego en Backend/utils/
    rutas_posibles = [
        os.path.join(UTILS_DIR, nombre_archivo),
        os.path.join(BACKEND_DIR, 'utils', nombre_archivo),
        os.path.join(BASE_DIR, nombre_archivo)
    ]
    
    for ruta in rutas_posibles:
        if os.path.exists(ruta):
            try:
                nombre_modulo = nombre_archivo.replace('.py', '')
                spec = importlib.util.spec_from_file_location(nombre_modulo, ruta)
                modulo = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(modulo)
                print(f"✅ {nombre_archivo} cargado desde: {ruta}")
                return modulo
            except Exception as e:
                print(f"❌ Error cargando {nombre_archivo} desde {ruta}: {e}")
                continue
    
    print(f"⚠ {nombre_archivo} no encontrado en ninguna ubicación")
    return None

# Cargar utils_map
utils_map = cargar_modulo_local('utils_map.py')

if utils_map:
    nombre_a_numero = utils_map.nombre_a_numero
    numero_a_nombre = utils_map.numero_a_nombre
    print(f"✅ utils_map.py cargado correctamente - 77 animales disponibles")
else:
    # Mapeo completo integrado - 77 animales del Guácharo Activo
    print("✅ Usando mapeo completo integrado (77 animales)")
    def nombre_a_numero(nombre):
        """Convierte nombre de animal a número - Guácharo Activo (77 animales)"""
        mapa = {
            # 0-9
            "delfin": 0, "delfín": 0,
            "carnero": 1,
            "toro": 2,
            "ciempies": 3, "ciempiés": 3,
            "alacrán": 4, "alacran": 4,
            "león": 5, "leon": 5,
            "rana": 6,
            "perico": 7,
            "ratón": 8, "raton": 8,
            "águila": 9, "aguila": 9,
            # 10-19
            "tigre": 10,
            "gato": 11,
            "caballo": 12,
            "mono": 13,
            "paloma": 14,
            "zorro": 15,
            "oso": 16,
            "pavo": 17,
            "burro": 18,
            "chivo": 19,
            # 20-29
            "cochino": 20,
            "gallo": 21,
            "camello": 22,
            "cebra": 23,
            "iguana": 24,
            "gallina": 25,
            "vaca": 26,
            "perro": 27,
            "zamuro": 28,
            "elefante": 29,
            # 30-39
            "caimán": 30, "caiman": 30,
            "lapa": 31,
            "ardilla": 32,
            "pescado": 33,
            "venado": 34,
            "jirafa": 35,
            "culebra": 36,
            "tortuga": 37,
            "lechuza": 38,
            "chigüire": 39, "chiguire": 39,
            # 40-49
            "avestruz": 40,
            "canguro": 41,
            "morrocoy": 42,
            "jorobado": 43,
            "garza": 44,
            "ballena": 45,
            "puma": 46,
            "pavo real": 47,
            "hormiga": 48,
            "oso hormiguero": 49,
            # 50-59
            "pereza": 50,
            "canario": 51,
            "cotorra": 52,
            "pulpo": 53,
            "caracol": 54,
            "grillo": 55,
            "mapache": 56,
            "tiburón": 57, "tiburon": 57,
            "pato": 58,
            "murciélago": 59, "murcielago": 59,
            # 60-69
            "nutria": 60,
            "camaleón": 61, "camaleon": 61,
            "rinoceronte": 62,
            "cachicamo": 63,
            "gavilán": 64, "gavilan": 64,
            "araña": 65, "arana": 65,
            "sapo": 66,
            "comadreja": 67,
            "conejo": 68,
            "serpiente": 69,
            # 70-75
            "guacamaya": 70,
            "cocodrilo": 71,
            "hipopótamo": 72, "hipopotamo": 72,
            "pantera": 73,
            "cuervo": 74,
            "búho": 75, "buho": 75,
            # Animales adicionales encontrados en scraping
            "gorila": 40,  # Puede variar según la lotería
            "puercoespin": 42,
            "bisonte": 38,
            "panda": 73,
            "lobo": 10,  # Similar a tigre
            "cangrejo": 53,  # Similar a pulpo
            # Especial
            "00": 100
        }
        if nombre is None:
            return None
        texto_norm = str(nombre).lower().strip()
        return mapa.get(texto_norm)
    
    def numero_a_nombre(numero):
        """Convierte número a nombre de animal - Guácharo Activo (77 animales)"""
        mapa = {
            0: "Delfín",
            1: "Carnero",
            2: "Toro",
            3: "Ciempiés",
            4: "Alacrán",
            5: "León",
            6: "Rana",
            7: "Perico",
            8: "Ratón",
            9: "Águila",
            10: "Tigre",
            11: "Gato",
            12: "Caballo",
            13: "Mono",
            14: "Paloma",
            15: "Zorro",
            16: "Oso",
            17: "Pavo",
            18: "Burro",
            19: "Chivo",
            20: "Cochino",
            21: "Gallo",
            22: "Camello",
            23: "Cebra",
            24: "Iguana",
            25: "Gallina",
            26: "Vaca",
            27: "Perro",
            28: "Zamuro",
            29: "Elefante",
            30: "Caimán",
            31: "Lapa",
            32: "Ardilla",
            33: "Pescado",
            34: "Venado",
            35: "Jirafa",
            36: "Culebra",
            37: "Tortuga",
            38: "Lechuza",
            39: "Chigüire",
            40: "Gorila",  # Actualizado desde scraping
            41: "Canguro",
            42: "Puercoespín",  # Actualizado desde scraping
            43: "Jorobado",
            44: "Garza",
            45: "Ballena",
            46: "Puma",
            47: "Pavo Real",
            48: "Hormiga",
            49: "Oso Hormiguero",
            50: "Pereza",
            51: "Canario",
            52: "Cotorra",
            53: "Pulpo",
            54: "Caracol",
            55: "Grillo",
            56: "Mapache",
            57: "Tiburón",
            58: "Pato",
            59: "Murciélago",
            60: "Nutria",
            61: "Camaleón",
            62: "Rinoceronte",
            63: "Cachicamo",
            64: "Gavilán",
            65: "Araña",
            66: "Sapo",
            67: "Comadreja",
            68: "Conejo",
            69: "Serpiente",
            70: "Guacamaya",
            71: "Cocodrilo",
            72: "Hipopótamo",
            73: "Pantera",
            74: "Cuervo",
            75: "Búho",
            100: "Ballena (00)"
        }
        return mapa.get(numero, f"Animal-{numero}")

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
    sys.exit(1)

# ============================================
# CREAR APLICACIÓN FLASK
# ============================================
app = Flask(__name__)
CORS(app)

print("✅ Aplicación Flask creada")
print("🌐 Servidor listo")
print("=" * 50)

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
        'utils_loaded': utils_map is not None,
        'directories': {
            'base': BASE_DIR,
            'utils': UTILS_DIR,
            'backend': BACKEND_DIR
        }
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
# ENDPOINTS PARA LA APP MÓVIL
# ============================================

# Buscar CSV en múltiples ubicaciones
def encontrar_csv():
    """Busca el archivo CSV en diferentes ubicaciones"""
    posibles_rutas = [
        "resultados_guacharo.csv",
        "Backend/resultados_guacharo.csv",
        "data/resultados_guacharo.csv"
    ]
    
    for ruta in posibles_rutas:
        if os.path.exists(ruta):
            return ruta
    return None

@app.route('/api/predict', methods=['GET'])
def predict():
    """
    Retorna predicciones del modelo
    """
    try:
        top = request.args.get('top', 10, type=int)
        
        # Buscar CSV
        csv_file = encontrar_csv()
        if not csv_file:
            return jsonify({
                'status': 'error',
                'message': 'No hay datos disponibles'
            }), 404
        
        # Cargar datos
        df = pd.read_csv(csv_file)
        
        if df.empty:
            return jsonify({
                'status': 'error',
                'message': 'El archivo de datos está vacío'
            }), 404
        
        # Generar predicciones simples basadas en frecuencia
        df['Num_Ganador'] = pd.to_numeric(df['Num_Ganador'], errors='coerce')
        df = df.dropna(subset=['Num_Ganador'])
        
        # Contar frecuencias
        frecuencias = df['Num_Ganador'].value_counts().head(top)
        
        predicciones = []
        for i, (numero, freq) in enumerate(frecuencias.items()):
            predicciones.append({
                'numero': int(numero),
                'animal': numero_a_nombre(int(numero)),
                'probabilidad': round((freq / len(df)) * 100, 2),
                'frecuencia': int(freq),
                'ranking': i + 1
            })
        
        return jsonify({
            'status': 'success',
            'count': len(predicciones),
            'predictions': predicciones,
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
    """
    try:
        limit = request.args.get('limit', 50, type=int)
        fecha_filtro = request.args.get('fecha', None)
        
        # Buscar CSV
        csv_file = encontrar_csv()
        if not csv_file:
            return jsonify({
                'status': 'error',
                'message': 'No hay datos disponibles'
            }), 404
        
        # Cargar datos
        df = pd.read_csv(csv_file)
        
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
            'count': len(resultados),
            'results': resultados
        })
        
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
        # Buscar CSV
        csv_file = encontrar_csv()
        if not csv_file:
            return jsonify({
                'status': 'error',
                'message': 'No hay datos disponibles'
            }), 404
        
        # Cargar datos
        df = pd.read_csv(csv_file)
        
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

@app.route('/api/update-data', methods=['POST'])
def update_data():
    """
    Endpoint para actualizar datos (placeholder)
    """
    return jsonify({
        'status': 'info',
        'message': 'Actualización de datos no disponible en producción'
    })

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