import numpy as np
import pandas as pd
from utils.utils_map import nombre_a_numero, numero_a_nombre


# ======================================================
#   MATRIZ DE TRANSICIÓN DE MARKOV
# ======================================================
def construir_matriz_transicion(df: pd.DataFrame):
    """
    Construye una matriz de transición de Markov basada en la columna 'numero'.
    """
    if "numero" not in df.columns:
        raise ValueError("El DataFrame no contiene la columna 'numero'.")

    secuencia = df["numero"].dropna().astype(int).tolist()
    estados = sorted(list(set(secuencia)))

    n = len(estados)
    matriz = np.zeros((n, n))

    index = {estado: i for i, estado in enumerate(estados)}

    for i in range(len(secuencia) - 1):
        a = secuencia[i]
        b = secuencia[i + 1]

        if a in index and b in index:
            matriz[index[a]][index[b]] += 1

    # Normalizar
    for i in range(n):
        total = matriz[i].sum()
        if total > 0:
            matriz[i] /= total

    return matriz, estados


# ======================================================
#   SCORE MARKOV (INDICADOR SIMPLE)
# ======================================================
def score_markov(df: pd.DataFrame) -> float:
    """
    Calcula un score simple basado en la entropía de la matriz de transición.
    """
    matriz, _ = construir_matriz_transicion(df)

    if matriz.size == 0:
        return 0.0

    eps = 1e-9
    entropia = -np.sum(matriz * np.log(matriz + eps))

    return float(entropia)


# ======================================================
#   PREDICCIÓN PRINCIPAL DE MARKOV
# ======================================================
def generate_markov_prediction(df: pd.DataFrame, top_n=3):
    """
    Genera predicciones usando cadenas de Markov:
    - Toma el último número real del historial
    - Busca la fila correspondiente en la matriz de transición
    - Devuelve los animales con mayor probabilidad
    """
    if "numero" not in df.columns:
        raise ValueError("El DataFrame debe contener columna 'numero'.")

    matriz, estados = construir_matriz_transicion(df)

    if len(estados) == 0:
        return []

    # último número jugado
    ultimo_num = int(df["numero"].dropna().iloc[-1])

    if ultimo_num not in estados:
        return []

    idx = estados.index(ultimo_num)
    probs = matriz[idx]

    # Tomar los mejores N estados siguientes
    best_idx = np.argsort(probs)[::-1][:top_n]

    resultados = []
    for i in best_idx:
        numero = estados[i]
        prob = probs[i]
        nombre = numero_a_nombre(numero)
        resultados.append({
            "numero": numero,
            "animal": nombre,
            "probabilidad": round(float(prob), 4)
        })

    return resultados
