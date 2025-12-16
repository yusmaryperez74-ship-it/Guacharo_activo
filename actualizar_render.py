#!/usr/bin/env python3
"""
Script para actualizar los datos en Render
"""
import os
import shutil
import subprocess
import sys

def main():
    print("🔄 ACTUALIZANDO API DE RENDER CON DATOS RECIENTES")
    print("=" * 60)
    
    # 1. Actualizar datos locales
    print("1. Actualizando datos locales...")
    try:
        subprocess.run([sys.executable, "Backend/data_update.py"], check=True)
        print("✅ Datos locales actualizados")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error actualizando datos locales: {e}")
        return False
    
    # 2. Copiar CSV actualizado al directorio principal
    print("\n2. Copiando CSV actualizado...")
    try:
        if os.path.exists("Backend/resultados_guacharo.csv"):
            shutil.copy2("Backend/resultados_guacharo.csv", "resultados_guacharo.csv")
            print("✅ CSV copiado al directorio principal")
        else:
            print("❌ No se encontró el CSV en Backend/")
            return False
    except Exception as e:
        print(f"❌ Error copiando CSV: {e}")
        return False
    
    # 3. Verificar que el archivo existe y tiene datos
    print("\n3. Verificando datos...")
    try:
        with open("resultados_guacharo.csv", 'r', encoding='utf-8') as f:
            lines = f.readlines()
            print(f"✅ CSV tiene {len(lines)} líneas")
            
            # Mostrar últimas 3 líneas
            print("📊 Últimos 3 registros:")
            for line in lines[-3:]:
                print(f"   {line.strip()}")
                
    except Exception as e:
        print(f"❌ Error verificando CSV: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ DATOS LISTOS PARA RENDER")
    print("📝 Próximos pasos:")
    print("   1. Hacer commit de los cambios")
    print("   2. Push a GitHub")
    print("   3. Render se actualizará automáticamente")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    main()