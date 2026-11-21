import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt_token');
        if (token) {
          setUser({ name: 'Étudiant Démo', email: 'etudiant@toubkalit.com', role: 'student' });
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
    if (!email || !password) {
      throw new Error('Veuillez saisir votre email et mot de passe.');
    }
    const mockToken = 'jwt_token_sample_' + Date.now();
    await SecureStore.setItemAsync('jwt_token', mockToken);
    setUser({ name: email.split('@')[0], email, role: 'student' });
    setIsAuthenticated(true);
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
    if (!name || !email || !password) {
      throw new Error('Tous les champs sont obligatoires');
    }
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
