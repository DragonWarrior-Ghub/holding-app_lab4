import React, { useEffect, useState } from 'react';
import HoldingDashboard from './components/HoldingDashboard';
import LoginScreen from './components/LoginScreen';

const LOCAL_SESSION_KEY = 'holdingAuthUser';
const AUTH_API_BASE = process.env.REACT_APP_AUTH_API || '/api';

function App() {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const sessionUser = window.localStorage.getItem(LOCAL_SESSION_KEY);
    if (sessionUser) {
      try {
        setCurrentUser(JSON.parse(sessionUser));
      } catch (error) {
        window.localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    }
    setAuthReady(true);
  }, []);

  const callAuthApi = async (endpoint, payload) => {
    try {
      const response = await fetch(`${AUTH_API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        return { ok: false, message: data.message || 'Не удалось обработать запрос' };
      }
      return data;
    } catch (error) {
      return { ok: false, message: 'Не удалось связаться с сервером авторизации' };
    }
  };

  const handleLogin = async ({ username, password }) => {
    const trimmedLogin = username.trim();
    if (!trimmedLogin || !password) {
      return { ok: false, message: 'Укажите логин и пароль' };
    }

    const result = await callAuthApi('/login', {
      login: trimmedLogin,
      password,
    });

    if (result.ok && result.user) {
      window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(result.user));
      setCurrentUser(result.user);
    }

    return result;
  };

  const handleLogout = () => {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    if (!currentUser) {
      return { ok: false, message: 'Сначала войдите в систему' };
    }

    const result = await callAuthApi('/change-password', {
      userId: currentUser.id,
      currentPassword,
      newPassword,
    });

    if (result.ok) {
      const updatedUser = { ...currentUser, needsPasswordReset: false };
      window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }

    return result;
  };

  if (!authReady) {
    return null;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <HoldingDashboard
      user={currentUser}
      onLogout={handleLogout}
      onPasswordChange={handlePasswordChange}
    />
  );
}

export default App;
