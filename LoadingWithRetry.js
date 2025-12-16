// components/LoadingWithRetry.js - Loading con información de progreso
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const LoadingWithRetry = ({ 
  message = 'Cargando...', 
  attempt = 1, 
  maxAttempts = 3,
  showProgress = false 
}) => {
  const { theme } = useTheme();

  const getLoadingMessage = () => {
    if (attempt === 1) {
      return 'Conectando con el servidor...';
    } else if (attempt === 2) {
      return 'Despertando servidor (puede tardar)...';
    } else {
      return 'Último intento de conexión...';
    }
  };

  const getProgressMessage = () => {
    if (attempt === 1) {
      return 'Esto puede tardar hasta 60 segundos la primera vez';
    } else if (attempt === 2) {
      return 'El servidor estaba dormido, despertando...';
    } else {
      return 'Verificando conexión...';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary} 
        style={styles.spinner}
      />
      
      <Text style={[styles.mainMessage, { color: theme.colors.text }]}>
        {getLoadingMessage()}
      </Text>
      
      {showProgress && (
        <>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Intento {attempt} de {maxAttempts}
          </Text>
          
          <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            {getProgressMessage()}
          </Text>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: theme.colors.primary,
                  width: `${(attempt / maxAttempts) * 100}%`
                }
              ]} 
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  mainMessage: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default LoadingWithRetry;