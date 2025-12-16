import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import { useTheme } from '../contexts/ThemeContext';
import { getAnimalIcon } from '../utils/animalIcons';

export default function StatsScreen() {
  const { theme, colors } = useTheme();
  const styles = createStyles(theme);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/stats`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setStats(data);
      } else {
        throw new Error(data.message);
      }
      
    } catch (error) {
      Alert.alert('Error', `No se pudieron cargar las estadísticas.\n\n${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarEstadisticas();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingIcon}>📊</Text>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>No hay estadísticas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarEstadisticas}>
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
            <Text style={styles.title}>📊 Estadísticas</Text>
            <Text style={styles.subtitle}>Análisis de datos históricos</Text>
          </View>
          <TouchableOpacity onPress={cargarEstadisticas} style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Resumen General</Text>
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statValue}>{stats.total_sorteos}</Text>
              <Text style={styles.statLabel}>Total Sorteos</Text>
            </LinearGradient>
            <LinearGradient
              colors={theme.gradients.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statValue}>{stats.numeros_diferentes}</Text>
              <Text style={styles.statLabel}>Números Únicos</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Último Resultado */}
        {stats.ultimo_resultado && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Último Resultado</Text>
            <View style={styles.lastResultCard}>
              <View style={styles.lastResultHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateIcon}>📅</Text>
                  <Text style={styles.lastResultDate}>
                    {stats.ultimo_resultado.fecha}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeIcon}>🕐</Text>
                  <Text style={styles.lastResultTime}>
                    {stats.ultimo_resultado.hora}
                  </Text>
                </View>
              </View>
              <View style={styles.lastResultBody}>
                <LinearGradient
                  colors={theme.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.lastResultNumero}
                >
                  <Text style={styles.lastResultNumeroText}>
                    {stats.ultimo_resultado.numero}
                  </Text>
                </LinearGradient>
                <View style={styles.lastResultAnimalContainer}>
                  <View style={styles.lastResultAnimalHeader}>
                    <Text style={styles.lastResultAnimalIcon}>
                      {getAnimalIcon(stats.ultimo_resultado.animal)}
                    </Text>
                    <Text style={styles.lastResultAnimalLabel}>Ganador</Text>
                  </View>
                  <Text style={styles.lastResultAnimal}>
                    {stats.ultimo_resultado.animal}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Top 10 Más Frecuentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Top 10 Más Frecuentes</Text>
          {stats.top_frecuentes.map((item, index) => {
            const getRankGradient = (rank) => {
              if (rank === 1) return theme.gradients.gold;
              if (rank === 2) return ['#D1D5DB', '#9CA3AF'];
              if (rank === 3) return theme.gradients.sunset;
              return theme.gradients.primary;
            };

            const animalIcon = getAnimalIcon(item.animal);

            return (
              <View key={item.numero} style={styles.topItem}>
                <LinearGradient
                  colors={getRankGradient(index + 1)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.topRank}
                >
                  <Text style={styles.topRankText}>#{index + 1}</Text>
                </LinearGradient>
                <View style={styles.topNumero}>
                  <Text style={styles.topNumeroText}>{item.numero}</Text>
                </View>
                <View style={styles.topInfo}>
                  <View style={styles.topAnimalRow}>
                    <Text style={styles.topAnimalIcon}>{animalIcon}</Text>
                    <Text style={styles.topAnimal}>{item.animal}</Text>
                  </View>
                  <Text style={styles.topStats}>
                    {item.frecuencia} veces • {item.porcentaje}%
                  </Text>
                </View>
                <View style={styles.topBarContainer}>
                  <View style={styles.topBar}>
                    <LinearGradient
                      colors={theme.gradients.primary}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.topBarFill, 
                        { width: `${Math.min(item.porcentaje * 2, 100)}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Distribución por Hora */}
        {stats.por_hora && Object.keys(stats.por_hora).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕐 Distribución por Hora</Text>
            {Object.entries(stats.por_hora)
              .sort(([,a], [,b]) => b.cantidad - a.cantidad)
              .slice(0, 12)
              .map(([hora, info]) => {
                const maxCantidad = Math.max(...Object.values(stats.por_hora).map(h => h.cantidad));
                const porcentaje = Math.round((info.cantidad / maxCantidad) * 100);
                const animalIcon = getAnimalIcon(info.animal_frecuente.nombre);

                return (
                  <View key={hora} style={styles.hourItem}>
                    <View style={styles.hourHeader}>
                      <View style={styles.hourTimeContainer}>
                        <Text style={styles.hourTimeIcon}>🕐</Text>
                        <Text style={styles.hourTime}>{hora}</Text>
                      </View>
                      <Text style={styles.hourCount}>{info.cantidad}</Text>
                    </View>
                    
                    <View style={styles.hourProgressContainer}>
                      <View style={styles.hourProgressBar}>
                        <LinearGradient
                          colors={theme.gradients.primary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.hourProgressFill, { width: `${porcentaje}%` }]}
                        />
                      </View>
                    </View>
                    
                    <View style={styles.hourAnimalContainer}>
                      <Text style={styles.hourAnimalIcon}>{animalIcon}</Text>
                      <Text style={styles.hourAnimalName}>{info.animal_frecuente.nombre}</Text>
                      <View style={styles.hourAnimalBadge}>
                        <Text style={styles.hourAnimalNumber}>#{info.animal_frecuente.numero}</Text>
                      </View>
                      <Text style={styles.hourAnimalStats}>
                        {info.animal_frecuente.frecuencia}x ({info.animal_frecuente.porcentaje}%)
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        {/* Rango de Fechas */}
        {stats.rango_fechas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Rango de Datos</Text>
            <View style={styles.dateRangeCard}>
              <View style={styles.dateRangeRow}>
                <Text style={styles.dateRangeLabel}>Desde:</Text>
                <Text style={styles.dateRangeValue}>{stats.rango_fechas.desde}</Text>
              </View>
              <View style={styles.dateRangeDivider} />
              <View style={styles.dateRangeRow}>
                <Text style={styles.dateRangeLabel}>Hasta:</Text>
                <Text style={styles.dateRangeValue}>{stats.rango_fechas.hasta}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
  loadingIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
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
  refreshButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  refreshIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statValue: {
    fontSize: 40,
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textWhite,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.semibold,
    opacity: 0.9,
  },
  lastResultCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  lastResultHeader: {
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
  lastResultDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  lastResultTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  lastResultBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  lastResultNumero: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.colored,
  },
  lastResultNumeroText: {
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.textWhite,
  },
  lastResultAnimalContainer: {
    flex: 1,
  },
  lastResultAnimalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  lastResultAnimalIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  lastResultAnimalLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lastResultAnimal: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  topItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  topRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  topRankText: {
    color: theme.colors.textWhite,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.extrabold,
  },
  topNumero: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNumeroText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  topInfo: {
    flex: 1,
  },
  topAnimalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  topAnimalIcon: {
    fontSize: 18,
    marginRight: theme.spacing.xs,
  },
  topAnimal: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  topStats: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  topBarContainer: {
    width: 70,
  },
  topBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  topBarFill: {
    height: '100%',
  },
  dateRangeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  dateRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRangeDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  dateRangeLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  dateRangeValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  // Estilos para distribución por hora
  hourItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  hourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  hourTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  hourTimeIcon: {
    fontSize: 16,
  },
  hourTime: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  hourCount: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  hourProgressContainer: {
    marginBottom: theme.spacing.sm,
  },
  hourProgressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  hourProgressFill: {
    height: '100%',
  },
  hourAnimalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  hourAnimalIcon: {
    fontSize: 18,
  },
  hourAnimalName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  hourAnimalBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  hourAnimalNumber: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textWhite,
  },
  hourAnimalStats: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
