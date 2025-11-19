# Производственный холдинг — авторизация через SQLite

SPA общается с локальным HTTP-сервисом (`server/index.js`), который работает поверх вашей SQLite-базы `holding.db`. В таблице `holding_users` уже лежит учетная запись оператора — фронтенд только отправляет логин/пароль и запросы на смену пароля.

> **Важно:** сам файл базы данных не включается в пул-реквест. Поместите его вручную (по умолчанию `./data/holding.db`) либо передайте путь через переменную `HOLDING_DB_PATH`.

### Что внутри
- React-приложение (Create React App + Tailwind UI), которое хранит только активную сессию в `localStorage`.
- Минимальный Node-сервер без внешних зависимостей: он запускает `sqlite3` CLI, сверяет пароль с записью и обновляет `last_login_at`/`password_hash`.
- Автоматический переход на пароль по умолчанию: если поле `password_hash` пустое, вход разрешается с использованием самого логина.

### Формат хранения пароля
- Значение `password_hash` после смены пароля сохраняется в виде `sha256:<HEX>`. Чтобы задать пароль вручную, сформируйте SHA-256-хэш сторонним инструментом (`echo -n "newPass" | sha256sum`) и запишите `sha256:<HASH>` через любой SQLite-клиент.
- Чтобы вернуть пароль «логин = пароль», очистите поле `password_hash` (NULL/пустая строка) — сервер снова примет логин в качестве пароля.

### Первичный вход без пароля
- Когда `password_hash` пустой, API сообщает фронтенду флаг `needsPasswordReset`.
- При первом входе с временным паролем (совпадает с логином) панель показывает предупреждение и просит сразу задать новый пароль в разделе безопасности.
- После успешной смены пароля предупреждение исчезает, а новое значение автоматически хэшируется и сохраняется в SQLite.

### Как запустить

1. Установите зависимости `npm install` (только при первом запуске).
2. Убедитесь, что `sqlite3` CLI доступен в PATH и база лежит по `./data/holding.db` (или задайте путь через `HOLDING_DB_PATH=/abs/path/to/holding.db`).
3. Запустите API `npm run server` — оно слушает порт `4000` (меняется переменной `HOLDING_API_PORT`).
4. В отдельном терминале выполните `npm start`, чтобы открыть клиент на `http://localhost:3000`.
5. Введите корпоративный логин (например, `operator@holding`). Если пароль не задан, используйте сам логин.
6. Сменить пароль можно в разделе безопасности — сервер обновит `password_hash` в базе.

Для продакшен-сборки укажите URL API через `REACT_APP_AUTH_API` и прокиньте HTTP-сервер в reverse-proxy / PaaS.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
