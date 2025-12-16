import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import { useTheme } from '../contexts/ThemeContext';
import { getAnimalIcon } from '../utils/animalIcons';


export default function HomeScreen() {
  const { theme, colors } = useTheme();
  const styles = createStyles(theme);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/history?limit=20`, {
        timeout: config.TIMEOUT
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setResultados(data.results);
      } else {
        throw new Error(data.message);
      }
      
    } catch (error) {
      Alert.alert(
        'Error de Conexión',
        `No se pudieron cargar los datos.\n\n${error.message}\n\nVerifica que el backend esté corriendo.`
      );
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  const actualizarDatos = async () => {
    try {
      setUpdating(true);
      
      Alert.alert(
        'Actualizar Datos',
        '¿Deseas descargar los últimos resultados del sitio web? Esto puede tardar hasta 2 minutos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Actualizar', 
            onPress: async () => {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos
                
                const response = await fetch(`${config.API_URL}/api/update-data`, {
                  method: 'POST',
                  signal: controller.signal,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                clearTimeout(timeoutId);
                
                const data = await response.json();
                
                if (data.status === 'success') {
                  Alert.alert(
                    'Actualización Exitosa',
                    `Se descargaron ${data.total_registros} resultados nuevos.`,
                    [{ text: 'OK', onPress: () => cargarDatos() }]
                  );
                } else {
                  Alert.alert('Información', data.message);
                }
                
              } catch (error) {
                Alert.alert(
                  'Error de Actualización',
                  error.name === 'AbortError' 
                    ? 'La actualización tardó demasiado. Intenta más tarde.'
                    : `Error: ${error.message}`
                );
              }
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const gradientColors = index % 3 === 0 
      ? theme.gradients.primary 
      : index % 3 === 1 
      ? theme.gradients.secondary 
      : theme.gradients.mystic;
    
    const animalIcon = getAnimalIcon(item.Animal_Gan);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={styles.fecha}>{item.Fecha}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.hora}>{item.Hora}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.numeroContainer}
          >
            <Text style={styles.numero}>{item.Num_Ganador}</Text>
          </LinearGradient>
          <View style={styles.animalContainer}>
            <View style={styles.animalHeader}>
              <Text style={styles.animalIcon}>{animalIcon}</Text>
              <Text style={styles.animalLabel}>Ganador</Text>
            </View>
            <Text style={styles.animal}>{item.Animal_Gan}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando resultados...</Text>
      </View>
    );
  }

  if (resultados.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>No hay resultados</Text>
        <Text style={styles.emptyText}>
          Ejecuta data_update.py en el backend para descargar datos.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarDatos}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>🏠 Últimos Resultados</Text>
            <Text style={styles.subtitle}>{resultados.length} sorteos registrados</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={actualizarDatos} style={[styles.refreshButton, updating && styles.buttonDisabled]}>
              <Text style={styles.refreshIcon}>{updating ? '⏳' : '📥'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cargarDatos} style={styles.refreshButton}>
              <Text style={styles.refreshIcon}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <FlatList
        data={resultados}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Fecha}-${item.Hora}-${index}`}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  loadingSubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  retryButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.heading,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  refreshButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  refreshIcon: {
    fontSize: 24,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateIcon: {
    fontSize: 14,
  },
  timeIcon: {
    fontSize: 14,
  },
  fecha: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  hora: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  numeroContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.colored,
  },
  numero: {
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.textWhite,
  },
  animalContainer: {
    flex: 1,
  },
  animalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  animalIcon: {
    fontSize: 20,
    marginRight: theme.spacing.xs,
  },
  animalLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  animal: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
