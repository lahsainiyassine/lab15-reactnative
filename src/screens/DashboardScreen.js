import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Espace Sécurisé</Text>
        <Text style={styles.name}>Bienvenue, {user?.name || 'Étudiant'}</Text>
        <Text style={styles.email}>Email : {user?.email}</Text>
        <Text style={styles.badge}>Rôle : {user?.role || 'student'}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Statut de la Session</Text>
          <Text style={styles.infoText}>• Token JWT stocké dans Expo SecureStore (Chiffré)</Text>
          <Text style={styles.infoText}>• En-tête Authorization: Bearer actif</Text>
          <Text style={styles.infoText}>• Rétablissement automatique de session activé</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F1F5F9',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 2,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
