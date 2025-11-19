const http = require('http');
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.HOLDING_API_PORT || process.env.PORT || 4000);
const DB_PATH = process.env.HOLDING_DB_PATH || path.join(__dirname, '..', 'data', 'holding.db');
const REQUEST_LIMIT_BYTES = 1024 * 50;

const ensureDatabase = () => {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`\n[holding-api] SQLite файл не найден: ${DB_PATH}`);
    console.error('Укажите путь через переменную HOLDING_DB_PATH или разместите базу в ./data/holding.db');
    process.exit(1);
  }
};

ensureDatabase();

const escapeLiteral = (value) => {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  return `'${String(value).replace(/'/g, "''")}'`;
};

const execSql = (sql, { expectRows = false } = {}) => {
  const args = expectRows ? ['-json', DB_PATH, sql] : [DB_PATH, sql];
  try {
    const output = execFileSync('sqlite3', args, { encoding: 'utf8' }).trim();
    if (!expectRows) {
      return output;
    }
    if (!output) {
      return [];
    }
    try {
      return JSON.parse(output);
    } catch (error) {
      console.error('[holding-api] Ошибка разбора JSON ответа sqlite3:', error.message);
      return [];
    }
  } catch (error) {
    console.error('[holding-api] Ошибка sqlite3:', error.message);
    throw new Error('DB_QUERY_FAILED');
  }
};

const readUserByLogin = (login) => {
  const sql = `
    SELECT id, full_name, login, password_hash, last_login_at
    FROM holding_users
    WHERE lower(login) = lower(${escapeLiteral(login)})
    LIMIT 1;
  `;
  const rows = execSql(sql, { expectRows: true });
  return rows[0] || null;
};

const readUserById = (id) => {
  const sql = `
    SELECT id, full_name, login, password_hash, last_login_at
    FROM holding_users
    WHERE id = ${Number(id)}
    LIMIT 1;
  `;
  const rows = execSql(sql, { expectRows: true });
  return rows[0] || null;
};

const updateLastLogin = (userId, timestamp) => {
  const sql = `
    UPDATE holding_users
    SET last_login_at = ${escapeLiteral(timestamp)}
    WHERE id = ${Number(userId)};
  `;
  execSql(sql);
};

const updatePasswordHash = (userId, hash) => {
  const sql = `
    UPDATE holding_users
    SET password_hash = ${escapeLiteral(hash)}
    WHERE id = ${Number(userId)};
  `;
  execSql(sql);
};

const normalizeUser = (record) => ({
  id: record.id,
  name: record.full_name || 'Оператор производственного холдинга',
  login: record.login,
  lastLoginAt: record.last_login_at,
});

const hashPassword = (password) =>
  `sha256:${crypto.createHash('sha256').update(password).digest('hex')}`;

const verifyPassword = (record, candidate) => {
  if (!candidate) {
    return false;
  }

  const stored = record.password_hash;
  if (!stored) {
    return candidate === record.login;
  }

  if (stored.startsWith('sha256:')) {
    const expected = stored.slice(7);
    const computed = crypto.createHash('sha256').update(candidate).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(computed, 'hex'));
    } catch (error) {
      return false;
    }
  }

  return candidate === stored;
};

const sendJson = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  });
  res.end(body);
};

const parseRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > REQUEST_LIMIT_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.connection.destroy();
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('INVALID_JSON'));
      }
    });
  });

const handleLogin = async (req, res) => {
  try {
    const body = await parseRequestBody(req);
    const login = (body.login || '').trim();
    const password = body.password || '';

    if (!login || !password) {
      sendJson(res, 400, { ok: false, message: 'Укажите логин и пароль' });
      return;
    }

    const record = readUserByLogin(login);
    if (!record || !verifyPassword(record, password)) {
      sendJson(res, 401, { ok: false, message: 'Неверный логин или пароль' });
      return;
    }

    const timestamp = new Date().toISOString();
    updateLastLogin(record.id, timestamp);

    sendJson(res, 200, {
      ok: true,
      user: normalizeUser({ ...record, last_login_at: timestamp }),
    });
  } catch (error) {
    console.error('[holding-api] Ошибка входа:', error.message);
    const status = error.message === 'PAYLOAD_TOO_LARGE' ? 413 : error.message === 'INVALID_JSON' ? 400 : 500;
    sendJson(res, status, { ok: false, message: 'Сервер авторизации недоступен' });
  }
};

const handlePasswordChange = async (req, res) => {
  try {
    const body = await parseRequestBody(req);
    const userId = Number(body.userId);
    const currentPassword = body.currentPassword || '';
    const newPassword = body.newPassword || '';

    if (!userId || !currentPassword || !newPassword) {
      sendJson(res, 400, { ok: false, message: 'Укажите все необходимые данные' });
      return;
    }

    if (newPassword.length < 8) {
      sendJson(res, 400, { ok: false, message: 'Новый пароль должен содержать минимум 8 символов' });
      return;
    }

    const record = readUserById(userId);
    if (!record || !verifyPassword(record, currentPassword)) {
      sendJson(res, 401, { ok: false, message: 'Текущий пароль указан неверно' });
      return;
    }

    const hashed = hashPassword(newPassword);
    updatePasswordHash(record.id, hashed);
    sendJson(res, 200, { ok: true, message: 'Пароль обновлен' });
  } catch (error) {
    console.error('[holding-api] Ошибка смены пароля:', error.message);
    const status = error.message === 'PAYLOAD_TOO_LARGE' ? 413 : error.message === 'INVALID_JSON' ? 400 : 500;
    sendJson(res, status, { ok: false, message: 'Не удалось обработать запрос' });
  }
};

const resolvePathname = (reqUrl) => {
  try {
    return new URL(reqUrl, 'http://localhost').pathname;
  } catch (error) {
    return reqUrl;
  }
};

const server = http.createServer((req, res) => {
  const pathname = resolvePathname(req.url || '/');

  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    handleLogin(req, res);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/change-password') {
    handlePasswordChange(req, res);
    return;
  }

  sendJson(res, 404, { ok: false, message: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`[holding-api] Сервер авторизации запущен на порту ${PORT}`);
  console.log(`[holding-api] Используемая база данных: ${DB_PATH}`);
});
