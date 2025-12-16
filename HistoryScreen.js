import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import { useTheme } from '../contexts/ThemeContext';
import { getAnimalIcon } from '../utils/animalIcons';

export default function HistoryScreen() {
  const { theme, colors } = useTheme();
  const styles = createStyles(theme);
  const [resultados, setResultados] = useState([]);
  const [filteredResultados, setFilteredResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, animal, numero

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarResultados();
  }, [searchQuery, resultados, selectedFilter]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/history?limit=100`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setResultados(data.results);
        setFilteredResultados(data.results);
      } else {
        throw new Error(data.message);
      }
      
    } catch (error) {
      Alert.alert('Error', `No se pudieron cargar los datos.\n\n${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtrarResultados = () => {
    if (!searchQuery.trim()) {
      setFilteredResultados(resultados);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = resultados.filter(item => {
      if (selectedFilter === 'animal') {
        return item.Animal_Gan.toLowerCase().includes(query);
      } else if (selectedFilter === 'numero') {
        return item.Num_Ganador.toString().includes(query);
      } else {
        // Buscar en ambos
        return (
          item.Animal_Gan.toLowerCase().includes(query) ||
          item.Num_Ganador.toString().includes(query) ||
          item.Fecha.includes(query)
        );
      }
    });

    setFilteredResultados(filtered);
  };

  // Agrupar resultados por fecha
  const agruparPorFecha = (datos) => {
    const grupos = {};
    datos.forEach(item => {
      const fecha = item.Fecha || 'Sin fecha';
      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }
      grupos[fecha].push(item);
    });

    // Ordenar fechas de más reciente a más antigua
    const fechasOrdenadas = Object.keys(grupos).sort((a, b) => {
      if (a === 'Sin fecha') return 1;
      if (b === 'Sin fecha') return -1;
      return new Date(b.replace(/\//g, '-')) - new Date(a.replace(/\//g, '-'));
    });

    // Crear array plano con headers de fecha
    const resultado = [];
    fechasOrdenadas.forEach(fecha => {
      // Agregar header de fecha
      resultado.push({
        tipo: 'fecha',
        fecha: fecha,
        cantidad: grupos[fecha].length
      });
      
      // Ordenar resultados del día por hora (más reciente primero)
      const resultadosDelDia = grupos[fecha].sort((a, b) => {
        const horaA = a.Hora || '';
        const horaB = b.Hora || '';
        return horaB.localeCompare(horaA);
      });
      
      // Agregar resultados del día
      resultadosDelDia.forEach((item, index) => {
        resultado.push({
          ...item,
          tipo: 'resultado',
          esPrimeroDelDia: index === 0
        });
      });
    });

    return resultado;
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  const exportarDatos = () => {
    const dataText = filteredResultados
      .map(item => `${item.Fecha},${item.Hora},${item.Num_Ganador},${item.Animal_Gan}`)
      .join('\n');
    
    Alert.alert(
      'Exportar Datos',
      `${filteredResultados.length} registros listos para exportar.\n\nFormato: CSV\n\nEn una versión futura podrás guardar el archivo.`,
      [{ text: 'OK' }]
    );
  };

  const renderItem = ({ item, index }) => {
    // Si es un header de fecha
    if (item.tipo === 'fecha') {
      return (
        <View style={styles.fechaHeader}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fechaHeaderGradient}
          >
            <View style={styles.fechaHeaderContent}>
              <Text style={styles.fechaHeaderIcon}>📅</Text>
              <View style={styles.fechaHeaderTexts}>
                <Text style={styles.fechaHeaderTitle}>{item.fecha}</Text>
                <Text style={styles.fechaHeaderSubtitle}>
                  {item.cantidad} sorteo{item.cantidad !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    }

    // Si es un resultado normal
    const gradientColors = index % 3 === 0 
      ? theme.gradients.primary 
      : index % 3 === 1 
      ? theme.gradients.secondary 
      : theme.gradients.mystic;
    
    const animalIcon = getAnimalIcon(item.Animal_Gan);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.hora}>{item.Hora}</Text>
          </View>
          {item.esPrimeroDelDia && (
            <View style={styles.recentBadge}>
              <Text style={styles.recentBadgeText}>Más reciente</Text>
            </View>
          )}
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

  const FilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtrar por</Text>
          
          <TouchableOpacity
            style={[styles.filterOption, selectedFilter === 'all' && styles.filterOptionActive]}
            onPress={() => {
              setSelectedFilter('all');
              setFilterModalVisible(false);
            }}
          >
            <Text style={[styles.filterOptionText, selectedFilter === 'all' && styles.filterOptionTextActive]}>
              🔍 Todo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, selectedFilter === 'animal' && styles.filterOptionActive]}
            onPress={() => {
              setSelectedFilter('animal');
              setFilterModalVisible(false);
            }}
          >
            <Text style={[styles.filterOptionText, selectedFilter === 'animal' && styles.filterOptionTextActive]}>
              🦁 Solo Animales
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, selectedFilter === 'numero' && styles.filterOptionActive]}
            onPress={() => {
              setSelectedFilter('numero');
              setFilterModalVisible(false);
            }}
          >
            <Text style={[styles.filterOptionText, selectedFilter === 'numero' && styles.filterOptionTextActive]}>
              🔢 Solo Números
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando historial...</Text>
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
            <Text style={styles.title}>📜 Historial Completo</Text>
            <Text style={styles.subtitle}>
              {filteredResultados.length} de {resultados.length} resultados
            </Text>
          </View>
          <TouchableOpacity onPress={exportarDatos} style={styles.exportButton}>
            <Text style={styles.exportIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar animal, número o fecha..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Filtro activo */}
        {selectedFilter !== 'all' && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Filtrando por: {selectedFilter === 'animal' ? '🦁 Animales' : '🔢 Números'}
            </Text>
            <TouchableOpacity onPress={() => setSelectedFilter('all')}>
              <Text style={styles.activeFilterClear}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={agruparPorFecha(filteredResultados)}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (item.tipo === 'fecha') {
            return `fecha-${item.fecha}`;
          }
          return `${item.Fecha}-${item.Hora}-${index}`;
        }}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No se encontraron resultados</Text>
          </View>
        }
      />

      <FilterModal />
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
    color: theme.colors.textSecondary,
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
    marginBottom: theme.spacing.md,
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
  exportButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  exportIcon: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  clearIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    padding: theme.spacing.xs,
  },
  filterButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  filterIcon: {
    fontSize: 20,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  activeFilterText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textWhite,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  activeFilterClear: {
    fontSize: 16,
    color: theme.colors.textWhite,
    fontWeight: theme.typography.fontWeight.bold,
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
    alignItems: 'center',
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.colored,
  },
  numero: {
    fontSize: 28,
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
    fontSize: 18,
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
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.xl,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  filterOption: {
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  filterOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  filterOptionText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  filterOptionTextActive: {
    color: theme.colors.textWhite,
  },
  modalCloseButton: {
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  // Estilos para headers de fecha
  fechaHeader: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  fechaHeaderGradient: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  fechaHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  fechaHeaderIcon: {
    fontSize: 24,
  },
  fechaHeaderTexts: {
    flex: 1,
  },
  fechaHeaderTitle: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.xs,
  },
  fechaHeaderSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textWhite,
    opacity: 0.9,
    fontWeight: theme.typography.fontWeight.medium,
  },
  // Badge para resultado más reciente
  recentBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  recentBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textWhite,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
