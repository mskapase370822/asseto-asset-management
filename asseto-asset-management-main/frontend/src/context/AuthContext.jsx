import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth.service';
import { getUserProfile } from '../services/user.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await getUserProfile();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadProfile]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      await loadProfile();
    }
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await authService.logout({ refreshToken });
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const register = async (formData) => {
    const { data } = await authService.register(formData);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      await loadProfile();
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
