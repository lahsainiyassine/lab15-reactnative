# Lab 15 : Sécurisation d'une application React Native : authentification JWT, stockage sécurisé et gestion des sessions

- **URL de la plateforme** : https://mliaedu.toubkalit.com/student/courses/38/labs/554
- **Formation** : React Native

---

## 1. Objectifs
- Comprendre les principes fondamentaux d'authentification et d'autorisation (tokens JWT).
- Utiliser **`expo-secure-store`** pour stocker les tokens JWT de façon chiffrée (Keychain iOS / Keystore Android).
- Configurer les intercepteurs Axios pour injecter automatiquement l'en-tête `Authorization: Bearer <token>` et intercepter les erreurs 401 (expiration de session).
- Créer un contexte d'authentification global (`AuthContext` & `AuthProvider`) avec persistance et restauration automatique de session.
- Mettre en place un routage sécurisé et conditionnel avec **React Navigation** (`AppNavigator`).
- Implémenter les écrans de Connexion (`LoginScreen`), Inscription (`RegisterScreen`) et Tableau de bord protégé (`DashboardScreen`).

---

## 2. Dépendances requises
```bash
npx expo install expo-secure-store
npm install axios @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
```

---

## 3. Structure des fichiers
```text
tp15/
  src/
    services/
      api.js
    context/
      AuthContext.js
    navigation/
      AppNavigator.js
    screens/
      LoginScreen.js
      RegisterScreen.js
      DashboardScreen.js
  App.js
  package.json
```

---

## 4. Service API & Intercepteurs : `src/services/api.js`
```javascript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.escuelajs.co/api/v1'; // API de démonstration REST

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur de requête : injecte le token JWT
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erreur lecture token:', error);
  }
  return config;
});

// Intercepteur de réponse : gère l'expiration (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('jwt_token');
      console.warn('Session expirée ou non autorisée.');
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 5. Contexte d'Authentification : `src/context/AuthContext.js`
```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restauration de session au démarrage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt_token');
        if (token) {
          // Simulation ou appel réel pour valider le profil utilisateur
          setUser({ name: 'Étudiant Connecté', email: 'etudiant@toubkalit.com', role: 'student' });
          setIsAuthenticated(true);
        }
      } catch (e) {
        await SecureStore.deleteItemAsync('jwt_token');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      // Démonstration avec stockage du token sécurisé
      const mockToken = 'jwt_token_sample_' + Date.now();
      await SecureStore.setItemAsync('jwt_token', mockToken);
      setUser({ name: email.split('@')[0], email, role: 'student' });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Identifiants invalides');
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('jwt_token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const register = async (name, email, password) => {
    // Appel d'inscription
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 6. Navigateur conditionnel : `src/navigation/AppNavigator.js`
```javascript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
```

---

## 7. Écrans Login, Register, Dashboard
*(Voir les fichiers dans `src/screens/` pour le code détaillé).*

---

## 8. Intégration globale dans `App.js`
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
```
