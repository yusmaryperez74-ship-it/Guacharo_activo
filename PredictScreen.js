import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import { useTheme } from '../contexts/ThemeContext';
import { getAnimalIcon } from '../utils/animalIcons';

export default function PredictScreen() {
  const { theme } = useTheme();
  const [predicciones, setPredicciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estilos dinámicos
  const styles = StyleSheet.create({
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
    loadingContent: {
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    loadingIcon: {
      fontSize: 64,
    },
    loadingText: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.textPrimary,
    },
    loadingSubtext: {
      fontSize: theme.typography.fontSize.md,
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
      maxWidth: '80%',
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
    listContainer: {
      padding: theme.spacing.lg,
    },
    predictionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    rankBadge: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.md,
    },
    rankIcon: {
      fontSize: 20,
      marginBottom: 2,
    },
    rankText: {
      color: theme.colors.textWhite,
      fontWeight: theme.typography.fontWeight.extrabold,
      fontSize: theme.typography.fontSize.xs,
    },
    predictionInfo: {
      flex: 1,
    },
    mainInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
    numeroCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.colored,
    },
    numero: {
      fontSize: theme.typography.fontSize.heading,
      fontWeight: theme.typography.fontWeight.extrabold,
      color: theme.colors.textWhite,
    },
    animalInfo: {
      flex: 1,
    },
    animalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    animalIcon: {
      fontSize: 16,
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
    scores: {
      gap: theme.spacing.sm,
    },
    scoreBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    scoreBarMain: {
      marginBottom: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    scoreLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      width: 70,
      fontWeight: theme.typography.fontWeight.medium,
    },
    scoreLabelMain: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.textPrimary,
    },
    scoreBarBackground: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    scoreBarFill: {
      height: '100%',
      borderRadius: theme.borderRadius.md,
    },
    scoreBarFillMain: {
      height: 10,
    },
    scoreValue: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      width: 38,
      textAlign: 'right',
      fontWeight: theme.typography.fontWeight.bold,
    },
    scoreValueMain: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textPrimary,
    },
  });

  useEffect(() => {
    cargarPredicciones();
  }, []);

  const cargarPredicciones = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);
      
      const response = await fetch(`${config.API_URL}/api/predict?top=10`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setPredicciones(data.predictions);
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
      
    } catch (error) {
      Alert.alert(
        'Error de Conexión', 
        `No se pudieron cargar las predicciones.\n\n${error.message}\n\nVerifica que el backend esté corriendo en:\n${config.API_URL}`
      );
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarPredicciones();
  };

  const renderItem = ({ item, index }) => {
    // Valores seguros con fallbacks
    const numero = item.Numero || 0;
    const animal = item.Animal || 'Desconocido';
    const scoreTotal = item.Score_Total || 0;
    const scoreFrecuencia = item.Score_Frecuencia || 0;
    const scoreRecencia = item.Score_Recencia || 0;
    const scoreTendencia = item.Score_Tendencia || 0;
    
    // Gradientes según el ranking
    const getRankGradient = (rank) => {
      if (rank === 1) return theme.gradients.gold;
      if (rank === 2) return ['#D1D5DB', '#9CA3AF'];
      if (rank === 3) return theme.gradients.sunset;
      return theme.gradients.primary;
    };

    const getScoreColor = (score) => {
      if (score > 0.7) return theme.colors.success;
      if (score > 0.4) return theme.colors.warning;
      return theme.colors.secondary;
    };

    const getRankIcon = (rank) => {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return '⭐';
    };

    const animalIcon = getAnimalIcon(animal);

    return (
      <View style={styles.predictionCard}>
        <LinearGradient
          colors={getRankGradient(index + 1)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rankBadge}
        >
          <Text style={styles.rankIcon}>{getRankIcon(index + 1)}</Text>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </LinearGradient>
        
        <View style={styles.predictionInfo}>
          <View style={styles.mainInfo}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.numeroCircle}
            >
              <Text style={styles.numero}>{numero}</Text>
            </LinearGradient>
            <View style={styles.animalInfo}>
              <View style={styles.animalHeader}>
                <Text style={styles.animalIcon}>{animalIcon}</Text>
                <Text style={styles.animalLabel}>Animal</Text>
              </View>
              <Text style={styles.animal}>{animal}</Text>
            </View>
          </View>
          
          <View style={styles.scores}>
            <ScoreBar 
              label="Total" 
              value={scoreTotal} 
              color={getScoreColor(scoreTotal)}
              isMain={true}
              styles={styles}
            />
            <ScoreBar 
              label="Frecuencia" 
              value={scoreFrecuencia} 
              color={theme.colors.secondary}
              styles={styles}
            />
            <ScoreBar 
              label="Recencia" 
              value={scoreRecencia} 
              color={theme.colors.warning}
              styles={styles}
            />
            <ScoreBar 
              label="Tendencia" 
              value={scoreTendencia} 
              color="#8B5CF6"
              styles={styles}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingIcon}>🔮</Text>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Generando predicciones...</Text>
          <Text style={styles.loadingSubtext}>Analizando datos históricos</Text>
        </View>
      </View>
    );
  }

  if (predicciones.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>No hay predicciones</Text>
        <Text style={styles.emptyText}>
          Asegúrate de que el backend esté corriendo y tenga datos.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarPredicciones}>
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
            <Text style={styles.title}>🔮 Predicciones</Text>
            <Text style={styles.subtitle}>Top {predicciones.length} animales con mayor probabilidad</Text>
          </View>
          <TouchableOpacity onPress={cargarPredicciones} style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <FlatList
        data={predicciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.Numero ? item.Numero.toString() : Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Componente auxiliar para barras de score
function ScoreBar({ label, value, color, isMain = false, styles }) {
  const safeValue = value || 0;
  const percentage = Math.round(safeValue * 100);
  
  return (
    <View style={[styles.scoreBarContainer, isMain && styles.scoreBarMain]}>
      <Text style={[styles.scoreLabel, isMain && styles.scoreLabelMain]}>{label}</Text>
      <View style={styles.scoreBarBackground}>
        <View 
          style={[
            styles.scoreBarFill, 
            { width: `${percentage}%`, backgroundColor: color },
            isMain && styles.scoreBarFillMain
          ]} 
        />
      </View>
      <Text style={[styles.scoreValue, isMain && styles.scoreValueMain]}>{percentage}%</Text>
    </View>
  );
}