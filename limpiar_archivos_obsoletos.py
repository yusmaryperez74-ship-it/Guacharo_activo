#!/usr/bin/env python3
"""
Script para limpiar archivos obsoletos y documentación innecesaria
"""
import os

# Archivos obsoletos para eliminar
archivos_obsoletos = [
    # Documentación de desarrollo obsoleta
    "ACTUALIZACION_ANIMALES.md",
    "ACTUALIZACION_DATOS.md", 
    "ARCHIVOS_NECESARIOS_GITHUB.md",
    "ARREGLAR_GITHUB_ESTRUCTURA.md",
    "CHECKLIST_DESARROLLO.md",
    "CONCEPTOS_FUNDAMENTALES.md",
    "CONFIGURACION_API.md",
    "CORREGIR_UTILS_GITHUB.md",
    "DATOS_ACTUALIZADOS_REFRESCAR_APP.md",
    "DESPLEGAR_RAILWAY_FACIL.md",
    "DESPLEGAR_RENDER_COMPLETO.md",
    "EJECUTAR_AHORA.md",
    "EJEMPLOS_CODIGO.md",
    "ESTADO_DEL_PROYECTO.md",
    "FUNCIONALIDADES_COMPLETAS.md",
    "FUNCIONALIDADES_PREMIUM.md",
    "GENERAR_APK.md",
    "GUIA_DESARROLLO.md",
    "GUIA_FIREWALL_COMPLETA.txt",
    "GUIA_PUBLICACION.md",
    "GUIA_VISUAL_RAPIDA.md",
    "IMPLEMENTACION_COMPLETA_PREMIUM.md",
    "INICIO_RAPIDO.md",
    "INSTALACION_MOBILE.md",
    "INTEGRACION_COMPLETA.md",
    "INTEGRACION_NUEVAS_PANTALLAS.md",
    "LIMPIEZA_BACKEND_COMPLETADA.md",
    "LIMPIEZA_PROYECTO_COMPLETADA.md",
    "LISTA_COMPLETA_ANIMALES.md",
    "LISTO_PARA_PROBAR.md",
    "MEJORAS_DATOS_Y_ORDEN.md",
    "MEJORAS_IMPLEMENTADAS_EXITOSAS.md",
    "MEJORAS_VISUALES.md",
    "MODO_OSCURO_IMPLEMENTADO.md",
    "OPTIMIZACION_VELOCIDAD.md",
    "OPTIMIZAR_RENDIMIENTO.md",
    "PASO_1_ACTUALIZACION_AUTOMATICA.md",
    "PASOS_EXACTOS_GITHUB.md",
    "PASOS_FINALES_ABRIR_APP.md",
    "PASOS_SUBIR_GITHUB_MANUAL.md",
    "PROBAR_AHORA_EXPO_GO.md",
    "PROBAR_EN_EXPO_GO.md",
    "PRUEBA_RAPIDA_NGROK.md",
    "PRUEBAS_API_EXITOSAS.md",
    "PRUEBAS_APLICACION_EXITOSAS.md",
    "RESUMEN_API_PUBLICA.md",
    "RESUMEN_FINAL_HISTORIAL_POR_DIAS.md",
    "RESUMEN_PROYECTO_COMPLETO.md",
    "SOLUCION_ACTUALIZACION_AUTOMATICA.md",
    "SOLUCION_ACTUALIZACION_DATOS.md",
    "SOLUCION_APP_CARGANDO.md",
    "SOLUCION_DATOS_DESCONOCIDO_WEB.md",
    "SOLUCION_ERROR_PREDICT_SCREEN.md",
    "SOLUCION_ERROR_STYLES_CORREGIDO.md",
    "SOLUCION_ERRORES.md",
    "SOLUCION_MAPEO_INTEGRADO.md",
    "SOLUCION_MODO_OSCURO_COMPLETO.md",
    "SOLUCION_NAVEGACION_WEB.md",
    "SOLUCION_RENDER_DEFINITIVA.md",
    "TEMA_MORADO_Y_ANIMALES.md",
    "TODO_LISTO_API_PUBLICA.md",
    
    # Scripts batch obsoletos
    "INICIAR_BACKEND.bat",
    "INICIAR_MOBILE.bat", 
    "INICIAR_TODO.bat",
    "OPCION_A_PERMITIR_PYTHON.bat",
    "OPCION_D_DESACTIVAR_FIREWALL.bat",
    "PROBAR_ENDPOINTS.bat",
    "REINICIAR_CON_MODO_OSCURO.bat",
    "SOLUCION_RAPIDA_NGROK.bat",
    "USAR_NGROK_AHORA.bat",
    "VERIFICAR_BACKEND_RENDER.bat",
    
    # Archivos de datos obsoletos
    "guacharo_historial.json",
]

# Archivos importantes que NO se deben eliminar
archivos_importantes = [
    "README.md",
    "app.py",
    "requirements.txt",
    "Procfile", 
    "runtime.txt",
    "resultados_guacharo.csv",
    "actualizar_render.py",
    "APK_LISTO_PARA_DESCARGAR.md",
    "GUIA_API_PUBLICA.md",
    "GUIA_WEBSITE_TO_APK.md",
    "DEPLOY_NETLIFY_INSTRUCCIONES.md",
    "HISTORIAL_SEPARADO_POR_DIAS_IMPLEMENTADO.md",
    "ARCHIVOS_ESENCIALES_GITHUB.md",
    ".gitignore"
]

def main():
    print("🧹 LIMPIANDO ARCHIVOS OBSOLETOS")
    print("=" * 50)
    
    eliminados = 0
    errores = 0
    
    for archivo in archivos_obsoletos:
        if os.path.exists(archivo):
            try:
                os.remove(archivo)
                print(f"✅ Eliminado: {archivo}")
                eliminados += 1
            except Exception as e:
                print(f"❌ Error eliminando {archivo}: {e}")
                errores += 1
        else:
            print(f"⚠️  No existe: {archivo}")
    
    print("\n" + "=" * 50)
    print(f"✅ LIMPIEZA COMPLETADA")
    print(f"📊 Archivos eliminados: {eliminados}")
    print(f"❌ Errores: {errores}")
    print("=" * 50)
    
    # Mostrar archivos importantes que se mantuvieron
    print("\n📁 ARCHIVOS IMPORTANTES MANTENIDOS:")
    for archivo in archivos_importantes:
        if os.path.exists(archivo):
            print(f"✅ {archivo}")
    
    print("\n📁 CARPETAS IMPORTANTES MANTENIDAS:")
    carpetas = ["mobile", "web", "Backend", "utils", "data"]
    for carpeta in carpetas:
        if os.path.exists(carpeta):
            print(f"📂 {carpeta}/")

if __name__ == "__main__":
    main()