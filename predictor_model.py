# predictor_model.py - VERSIÓN CORREGIDA
import pandas as pd
import numpy as np
from utils.utils_map import numero_a_nombre

# Estados válidos según el mapeo exacto
STATES = sorted([0, 100] + list(range(1, 76)))  # [0, 1, 2, ..., 75, 100]

def normalizar_serie(s: pd.Series) -> pd.Series:
    """Normaliza una serie entre 0 y 1"""
    s = s.astype(float).copy()
    if s.max() == s.min():
        return pd.Series(0.0, index=s.index)
    return (s - s.min()) / (s.max() - s.min())

def es_numero_valido(num):
    """Verifica si un número es válido en el juego"""
    try:
        n = int(num)
        return n == 0 or n == 100 or (1 <= n <= 75)
    except:
        return False

def filtrar_numeros_validos(df: pd.DataFrame) -> pd.DataFrame:
    """Filtra solo los números válidos del juego"""
    return df[df["Num_Ganador"].apply(es_numero_valido)].copy()

def score_frecuencia(df: pd.DataFrame) -> pd.Series:
    """Score basado en frecuencia de aparición"""
    df_valid = filtrar_numeros_validos(df)
    if df_valid.empty:
        return pd.Series(0.0, index=STATES)
    
    counts = df_valid["Num_Ganador"].value_counts()
    s = pd.Series(0.0, index=STATES)
    
    for num, count in counts.items():
        if num in STATES:
            s.loc[num] = count
    
    return normalizar_serie(s)

def score_recencia(df: pd.DataFrame) -> pd.Series:
    """Score basado en recencia (cuánto tiempo hace que no sale)"""
    df_valid = filtrar_numeros_validos(df)
    if df_valid.empty:
        return pd.Series(0.0, index=STATES)
    
    # Convertir fechas
    df_valid = df_valid.copy()
    df_valid["Fecha_dt"] = pd.to_datetime(df_valid["Fecha"], dayfirst=True, errors="coerce")
    df_valid = df_valid.dropna(subset=["Fecha_dt"])
    
    if df_valid.empty:
        return pd.Series(0.0, index=STATES)
    
    last_date = df_valid["Fecha_dt"].max()
    
    # Última fecha de aparición de cada número
    last_appearance = df_valid.groupby("Num_Ganador")["Fecha_dt"].max()
    
    scores = {}
    for num in STATES:
        if num in last_appearance.index:
            days_since = (last_date - last_appearance[num]).days
            # Mayor score para números que salieron hace más tiempo
            scores[num] = days_since
        else:
            # Nunca ha salido (máxima recencia)
            scores[num] = 999
    
    ser = pd.Series(scores)
    return normalizar_serie(ser)

def score_tendencia(df: pd.DataFrame, window: int = 30) -> pd.Series:
    """Score basado en tendencia reciente"""
    df_valid = filtrar_numeros_validos(df)
    if df_valid.empty:
        return pd.Series(0.0, index=STATES)
    
    # Ordenar por fecha
    df_valid = df_valid.copy()
    df_valid["Fecha_dt"] = pd.to_datetime(df_valid["Fecha"], dayfirst=True, errors="coerce")
    df_valid = df_valid.sort_values("Fecha_dt", ascending=False)
    
    # Tomar últimos 'window' resultados
    recent = df_valid.head(window)
    counts = recent["Num_Ganador"].value_counts()
    
    s = pd.Series(0.0, index=STATES)
    for num, count in counts.items():
        if num in STATES:
            s.loc[num] = count
    
    return normalizar_serie(s)

def generar_predicciones(df: pd.DataFrame, top_k: int = 10, 
                         weights: dict = None, window: int = 30) -> pd.DataFrame:
    """
    Genera predicciones combinando múltiples scores
    """
    if weights is None:
        weights = {"freq": 0.40, "recency": 0.30, "trend": 0.20, "markov": 0.10}
    
    # Calcular scores individuales
    sf = score_frecuencia(df)
    sr = score_recencia(df)
    st = score_tendencia(df, window)
    
    # Inicializar score Markov (simplificado por ahora)
    sm = pd.Series(0.0, index=STATES)
    
    # Normalizar cada score
    sf_n = normalizar_serie(sf)
    sr_n = normalizar_serie(sr)
    st_n = normalizar_serie(st)
    sm_n = normalizar_serie(sm)
    
    # Combinar scores ponderados
    total = (
        weights.get("freq", 0) * sf_n +
        weights.get("recency", 0) * sr_n +
        weights.get("trend", 0) * st_n +
        weights.get("markov", 0) * sm_n
    )
    
    # Crear DataFrame con resultados
    resultados = []
    for num in STATES:
        resultados.append({
            "Numero": num,
            "Animal": numero_a_nombre(num),
            "Score_Total": total.get(num, 0),
            "Score_Frecuencia": sf_n.get(num, 0),
            "Score_Recencia": sr_n.get(num, 0),
            "Score_Tendencia": st_n.get(num, 0)
        })
    
    df_result = pd.DataFrame(resultados)
    
    # Ordenar por score total
    df_result = df_result.sort_values("Score_Total", ascending=False).reset_index(drop=True)
    
    # Añadir ranking
    df_result["Ranking"] = df_result.index + 1
    
    return df_result.head(top_k)

def backtest_simple(df: pd.DataFrame, lookback_window: int = 100, 
                    eval_window: int = 50, top_k: int = 5) -> dict:
    """
    Backtesting simple para evaluar el modelo
    """
    n = len(df)
    if n < lookback_window + eval_window:
        return {"error": f"Datos insuficientes. Se necesitan al menos {lookback_window + eval_window} registros."}
    
    hits = 0
    total_tests = 0
    
    for i in range(lookback_window, min(n, lookback_window + eval_window)):
        # Datos de entrenamiento
        train = df.iloc[:i].copy()
        
        # Resultado real a predecir
        real = df.iloc[i]["Num_Ganador"]
        
        # Generar predicciones
        try:
            preds = generar_predicciones(train, top_k=top_k)
            predicted_numbers = preds["Numero"].tolist()
            
            # Verificar acierto
            if real in predicted_numbers:
                hits += 1
            
            total_tests += 1
        except Exception as e:
            continue
    
    if total_tests == 0:
        return {"error": "No se pudieron realizar pruebas"}
    
    hit_rate = hits / total_tests
    
    return {
        "aciertos": hits,
        "total_pruebas": total_tests,
        "tasa_acierto": f"{hit_rate:.2%}",
        "window_entrenamiento": lookback_window,
        "window_prueba": eval_window,
        "top_k": top_k
    }

# Función auxiliar para análisis rápido
def analisis_rapido(df: pd.DataFrame):
    """Análisis rápido de los datos"""
    print("📊 ANÁLISIS RÁPIDO DEL DATASET")
    print("=" * 50)
    
    # Estadísticas básicas
    print(f"Total registros: {len(df)}")
    print(f"Rango de números: {df['Num_Ganador'].min()} - {df['Num_Ganador'].max()}")
    
    # Fechas
    try:
        df["Fecha_dt"] = pd.to_datetime(df["Fecha"], dayfirst=True, errors="coerce")
        print(f"Rango de fechas: {df['Fecha_dt'].min().date()} a {df['Fecha_dt'].max().date()}")
    except:
        print("No se pudo analizar fechas")
    
    # Top números
    print("\n🔝 TOP 10 NÚMEROS MÁS FRECUENTES:")
    top_10 = df["Num_Ganador"].value_counts().head(10)
    for num, count in top_10.items():
        nombre = numero_a_nombre(num)
        porcentaje = (count / len(df)) * 100
        print(f"  {num:3d} ({nombre:20s}): {count:3d} veces ({porcentaje:.1f}%)")
    
    # Números que nunca han salido
    print("\n❌ NÚMEROS QUE NUNCA HAN SALIDO:")
    todos_numeros = set(STATES)
    numeros_salidos = set(df["Num_Ganador"].unique())
    numeros_faltantes = sorted(list(todos_numeros - numeros_faltantes))
    
    if len(numeros_faltantes) > 0:
        for num in numeros_faltantes[:10]:  # Mostrar solo primeros 10
            nombre = numero_a_nombre(num)
            print(f"  {num:3d} ({nombre:20s})")
        if len(numeros_faltantes) > 10:
            print(f"  ... y {len(numeros_faltantes) - 10} más")
    else:
        print("  ¡Todos los números han salido al menos una vez!")