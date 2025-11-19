const { spawn } = require('child_process');
const path = require('path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];
let shuttingDown = false;

const registerChild = (child, name) => {
  children.push({ child, name });

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`\n[dev] Процесс ${name} завершился (${reason}). Останавливаем окружение.`);
    shutdown(code === 0 ? 0 : 1);
  });
};

const shutdown = (exitCode = 0) => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  for (const { child, name } of children) {
    if (!child.killed) {
      try {
        child.kill('SIGINT');
      } catch (error) {
        console.error(`[dev] Не удалось остановить ${name}:`, error.message);
      }
    }
  }

  // Небольшая задержка, чтобы дочерние процессы успели завершиться корректно
  setTimeout(() => process.exit(exitCode), 200);
};

const startServer = () => {
  const serverPath = path.join(__dirname, '..', 'server', 'index.js');
  const child = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: process.env,
  });
  registerChild(child, 'сервер авторизации');
};

const startClient = () => {
  const child = spawn(npmCommand, ['run', 'client'], {
    stdio: 'inherit',
    env: process.env,
  });
  registerChild(child, 'клиентское приложение');
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => shutdown(0));

startServer();
startClient();
