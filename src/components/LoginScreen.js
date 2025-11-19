import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const result = await onLogin({ ...formData });
      if (!result.ok) {
        setError(result.message || 'Не удалось войти в систему');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
            Производственный холдинг
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Вход в систему</h1>
          <p className="text-sm text-gray-500">
            Доступ разрешен только сотрудникам с заранее созданной учетной записью.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Логин
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="operator@holding"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите пароль"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-2.5 rounded-lg font-semibold transition ${
              isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Проверяем данные...' : 'Войти'}
          </button>
        </form>

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            Демонстрационная запись создана администратором: <span className="font-semibold">operator@holding</span>
          </p>
          <p>
            Если пароль не задан, используйте логин в качестве пароля. После входа его можно изменить в разделе безопасности.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
