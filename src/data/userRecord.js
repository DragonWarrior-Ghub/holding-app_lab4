const LOCAL_USER_RECORD_KEY = 'holdingUserRecordData';

export const DEFAULT_USER = {
  id: 'operator-1',
  name: 'Оператор производственного холдинга',
  login: 'operator@holding',
  password: null,
  lastLoginAt: null,
};

export const normalizeUserRecord = (rawRecord) => {
  const source = rawRecord && typeof rawRecord === 'object' ? rawRecord : DEFAULT_USER;
  const login = (source.login || DEFAULT_USER.login).trim();

  return {
    ...DEFAULT_USER,
    ...source,
    login,
    password: source.password ?? login,
  };
};

export const readUserRecord = () => {
  if (typeof window === 'undefined') {
    return normalizeUserRecord(DEFAULT_USER);
  }

  const stored = window.localStorage.getItem(LOCAL_USER_RECORD_KEY);
  if (!stored) {
    return normalizeUserRecord(DEFAULT_USER);
  }

  try {
    const parsed = JSON.parse(stored);
    return normalizeUserRecord(parsed);
  } catch (error) {
    window.localStorage.removeItem(LOCAL_USER_RECORD_KEY);
    return normalizeUserRecord(DEFAULT_USER);
  }
};

export const persistUserRecord = (record) => {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    ...record,
    password: record.password ?? null,
  };

  window.localStorage.setItem(LOCAL_USER_RECORD_KEY, JSON.stringify(payload));
};
