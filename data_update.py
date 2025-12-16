# data_update.py
import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
import os
import re
from datetime import datetime

URL = "https://lotoven.com/animalito/guacharoactivo/historial/"
CSV_FILE = "resultados_guacharo.csv"
JSON_FILE = "guacharo_historial.json"


def normalizar_texto(texto):
    """Normaliza texto para comparación"""
    if texto is None:
        return ""
    return str(texto).lower().strip()

def nombre_a_numero(nombre):
    """Convierte nombre de animal a número - versión simplificada para scraping"""
    mapa = {
        "delfin": 0, "carnero": 1, "toro": 2, "ciempies": 3, "alacran": 4,
        "leon": 5, "rana": 6, "perico": 7, "raton": 8, "aguila": 9,
        "tigre": 10, "gato": 11, "caballo": 12, "mono": 13, "paloma": 14,
        "zorro": 15, "oso": 16, "pavo": 17, "burro": 18, "chivo": 19,
        "cochino": 20, "gallo": 21, "camello": 22, "cebra": 23, "iguana": 24,
        "gallina": 25, "vaca": 26, "perro": 27, "zamuro": 28, "elefante": 29,
        "caiman": 30, "lapa": 31, "ardilla": 32, "pescado": 33, "venado": 34,
        "jirafa": 35, "culebra": 36, "tortuga": 37, "lechuza": 38, "bufalo": 38,
        "canguro": 41, "garza": 44, "chiguire": 44, "puma": 46, "pavo real": 47,
        "oso hormiguero": 49, "pereza": 50, "canario": 51, "pulpo": 53,
        "caracol": 54, "grillo": 55, "tiburon": 57, "pato": 58, "camaleon": 61,
        "cachicamo": 63, "gavilan": 64, "arana": 65, "conejo": 68,
        "guacamaya": 70, "hipopotamo": 72, "ballena": 100
    }
    if nombre is None:
        return None
    return mapa.get(normalizar_texto(nombre))

def extraer_numero_animal(raw_text: str):
    if not isinstance(raw_text, str):
        return None

    txt = normalizar_texto(raw_text)

    if txt in ["", "-", "--", "n/a", "na", "sin dato"]:
        return None

    # Ballena: "00" or 'ballena' word
    if "00" in txt or "ballena" in txt:
        return 100

    # Delfin: '0' or 'delfin'
    if txt == "0" or "delfin" in txt:
        return 0

    # explicit numeric
    m = re.findall(r'\b(\d{1,2})\b', txt)
    if m:
        n = int(m[-1])
        # could be 0 or 1..75
        if n == 0:
            return 0
        if 1 <= n <= 85:
            return n

    # try name mapping
    mapped = nombre_a_numero(txt)
    if mapped is not None:
        return mapped

    # not recognized
    print(f"⚠ Texto no reconocido en scraping: '{raw_text}' -> '{txt}'")
    return None


def obtener_historial():
    print("Descargando historial desde:", URL)
    r = requests.get(URL, timeout=20)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    tabla = soup.find("table")
    if tabla is None:
        raise RuntimeError("No se encontró la tabla de historial en la página.")

    filas = tabla.find_all("tr")
    if len(filas) < 2:
        raise RuntimeError("Tabla encontrada pero no tiene filas esperadas.")

    encabezados = filas[0].find_all(["th", "td"])
    fechas = [c.get_text(strip=True).replace("-", "/") for c in encabezados[1:]]

    data = []
    for row in filas[1:]:
        celdas = row.find_all(["th", "td"])
        if not celdas:
            continue
        hora = celdas[0].get_text(strip=True)
        for i, cell in enumerate(celdas[1:]):
            fecha = fechas[i] if i < len(fechas) else ""
            animal_txt = cell.get_text(" ", strip=True)
            num = extraer_numero_animal(animal_txt)
            data.append({
                "Fecha": fecha,
                "Hora": hora,
                "Animal_Gan": animal_txt,
                "Num_Ganador": "" if num is None else num
            })
    return data


def guardar(historial):
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(historial, f, ensure_ascii=False, indent=2)

    df_new = pd.DataFrame(historial)

    if os.path.exists(CSV_FILE):
        df_old = pd.read_csv(CSV_FILE, dtype=str)
        df_comb = pd.concat([df_old, df_new], ignore_index=True)
        df_comb.drop_duplicates(subset=["Fecha", "Hora"], keep="last", inplace=True)
    else:
        df_comb = df_new

    df_comb.to_csv(CSV_FILE, index=False, encoding="utf-8")
    print("✔ CSV actualizado correctamente:", CSV_FILE)


def main():
    print("=" * 60)
    print("🔄 ACTUALIZANDO DATOS DEL GUÁCHARO ACTIVO")
    print("=" * 60)
    
    try:
        historial = obtener_historial()
        
        if not historial:
            print("⚠️ No se descargaron datos")
            return
        
        # Mostrar estadísticas
        print(f"\n📊 Datos descargados:")
        print(f"   Total de registros: {len(historial)}")
        
        # Contar fechas únicas
        fechas_unicas = set(item['Fecha'] for item in historial if item['Fecha'])
        print(f"   Fechas únicas: {len(fechas_unicas)}")
        if fechas_unicas:
            print(f"   Rango: {min(fechas_unicas)} a {max(fechas_unicas)}")
        
        # Guardar
        guardar(historial)
        
        # Verificar archivo guardado
        if os.path.exists(CSV_FILE):
            df = pd.read_csv(CSV_FILE)
            print(f"\n✅ Archivo CSV actualizado:")
            print(f"   Total de registros en CSV: {len(df)}")
            print(f"   Fechas en CSV: {df['Fecha'].nunique()}")
            print(f"   Rango: {df['Fecha'].min()} a {df['Fecha'].max()}")
        
        print("\n" + "=" * 60)
        print("✅ ACTUALIZACIÓN COMPLETADA")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
