# predictor.py
import pandas as pd
from predictor_model import generar_predicciones, backtest_simple

CSV = "resultados_guacharo.csv"


def norm_num(v):
    if pd.isna(v):
        return None
    s = str(v).strip()
    if s == "":
        return None
    if s == "00":
        return 100
    if s.isdigit():
        return int(s)
    return None


def main():
    df = pd.read_csv(CSV, dtype=str)
    if "Num_Ganador" not in df.columns:
        print("CSV no contiene columna Num_Ganador.")
        return

    df["Num_Ganador"] = df["Num_Ganador"].apply(norm_num)
    df = df.dropna(subset=["Num_Ganador"]).copy()
    df["Num_Ganador"] = df["Num_Ganador"].astype(int)

    print("Registros válidos:", len(df))
    print("Top predicciones:")
    print(generar_predicciones(df, top_k=10))
    print("\nBacktest (si tienes suficientes datos):")
    res = backtest_simple(df, lookback_window=100, eval_window=100, top_k=5)
    print(res)


if __name__ == "__main__":
    main()

