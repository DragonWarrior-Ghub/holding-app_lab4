import React, { useEffect, useState } from 'react';
import HoldingDashboard from './components/HoldingDashboard';
import LoginScreen from './components/LoginScreen';
import { persistUserRecord, readUserRecord } from './data/userRecord';

const LOCAL_SESSION_KEY = 'holdingAuthUser';

function App() {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountRecord, setAccountRecord] = useState(null);

  useEffect(() => {
    const storedAccount = readUserRecord();
    setAccountRecord(storedAccount);

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

  const handleLogin = async ({ username, password }) => {
    if (!accountRecord) {
      return { ok: false, message: 'Учетная запись еще не готова. Попробуйте снова.' };
    }

    const trimmedLogin = username.trim();
    if (trimmedLogin.toLowerCase() !== accountRecord.login.toLowerCase()) {
      return { ok: false, message: 'Неверный логин или пароль' };
    }

    if (password !== accountRecord.password) {
      return { ok: false, message: 'Неверный логин или пароль' };
    }

    const loginTimestamp = new Date().toISOString();
    const nextRecord = { ...accountRecord, lastLoginAt: loginTimestamp };
    persistUserRecord(nextRecord);
    setAccountRecord(nextRecord);

    const sessionInfo = {
      id: nextRecord.id,
      name: nextRecord.name,
      login: nextRecord.login,
      lastLoginAt: nextRecord.lastLoginAt,
    };

    window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionInfo));
    setCurrentUser(sessionInfo);
    return { ok: true };
  };

  const handleLogout = () => {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    if (!accountRecord) {
      return { ok: false, message: 'Учетная запись не найдена' };
    }

    if (currentPassword !== accountRecord.password) {
      return { ok: false, message: 'Текущий пароль указан неверно' };
    }

    const nextRecord = { ...accountRecord, password: newPassword };
    persistUserRecord(nextRecord);
    setAccountRecord(nextRecord);

    return { ok: true, message: 'Пароль успешно изменен' };
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
