import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Factory, Truck, DollarSign, AlertTriangle, Settings, Users, Package, FileText } from 'lucide-react';

const HoldingDashboard = ({ user, onLogout, onPasswordChange }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const forcePasswordChange = Boolean(user?.needsPasswordReset);

  useEffect(() => {
    if (forcePasswordChange) {
      setCurrentPage('dashboard');
    }
  }, [forcePasswordChange]);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part.trim()[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ПХ';

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwordSaving) {
      return;
    }

    setPasswordFeedback(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordFeedback({ ok: false, message: 'Новый пароль должен содержать не менее 8 символов' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordFeedback({ ok: false, message: 'Новый пароль и подтверждение не совпадают' });
      return;
    }

    setPasswordSaving(true);
    try {
      const result = await onPasswordChange(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordFeedback(result);

      if (result.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const lastLoginText = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString('ru-RU')
    : 'Нет данных';

  // Данные для графиков
  const productionData = [
    { month: 'Янв', добыча: 145000, переработка: 138000, план: 150000 },
    { month: 'Фев', добыча: 152000, переработка: 145000, план: 150000 },
    { month: 'Мар', добыча: 148000, переработка: 142000, план: 150000 },
    { month: 'Апр', добыча: 161000, переработка: 155000, план: 160000 },
    { month: 'Май', добыча: 158000, переработка: 152000, план: 160000 },
    { month: 'Июн', добыча: 165000, переработка: 159000, план: 160000 },
  ];

  const efficiencyData = [
    { name: 'Рудник №1', эффективность: 87 },
    { name: 'Рудник №2', эффективность: 92 },
    { name: 'Рудник №3', эффективность: 78 },
    { name: 'Завод №1', эффективность: 94 },
    { name: 'Завод №2', эффективность: 89 },
  ];

  const costData = [
    { category: 'Персонал', value: 420 },
    { category: 'Логистика', value: 280 },
    { category: 'Энергия', value: 195 },
    { category: 'Ремонт', value: 145 },
    { category: 'Прочее', value: 90 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Навигационное меню
  const menuItems = [
    { id: 'dashboard', label: 'Главная панель', icon: <TrendingUp size={18} /> },
    { id: 'production', label: 'Производство', icon: <Factory size={18} /> },
    { id: 'logistics', label: 'Логистика', icon: <Truck size={18} /> },
    { id: 'finances', label: 'Финансы', icon: <DollarSign size={18} /> },
    { id: 'equipment', label: 'Оборудование', icon: <Settings size={18} /> },
    { id: 'warehouses', label: 'Склады', icon: <Package size={18} /> },
    { id: 'personnel', label: 'Персонал', icon: <Users size={18} /> },
    { id: 'analytics', label: 'Аналитика', icon: <FileText size={18} /> },
    { id: 'market', label: 'Рынок сбыта', icon: <TrendingUp size={18} /> },
    { id: 'alerts', label: 'Уведомления', icon: <AlertTriangle size={18} /> },
  ];

  // Страница 1: Главная панель
  const DashboardPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Общая выработка</p>
              <p className="text-3xl font-bold mt-2">165,000 т</p>
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <TrendingUp size={16} className="mr-1" /> +8.2% к плану
              </p>
            </div>
            <Factory className="text-blue-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Операц. издержки</p>
              <p className="text-3xl font-bold mt-2">1,130 млн ₽</p>
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <TrendingDown size={16} className="mr-1" /> -5.3% к прошлому месяцу
              </p>
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">КПД оборудования</p>
              <p className="text-3xl font-bold mt-2">88%</p>
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <TrendingUp size={16} className="mr-1" /> +3.1% к прошлому месяцу
              </p>
            </div>
            <Settings className="text-orange-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Активные алерты</p>
              <p className="text-3xl font-bold mt-2">7</p>
              <p className="text-orange-500 text-sm mt-1">3 критических</p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Динамика производства</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="добыча" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="переработка" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="план" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Эффективность предприятий</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="эффективность" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Страница 2: Производство
  const ProductionPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мониторинг производства</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Рудник №1 (Норильск)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Выработка сегодня:</span>
              <span className="font-semibold">2,847 т</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">План выполнен:</span>
              <span className="font-semibold text-green-600">103%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Смены:</span>
              <span className="font-semibold">3/3 активны</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Работает</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Рудник №2 (Мурманск)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Выработка сегодня:</span>
              <span className="font-semibold">3,124 т</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">План выполнен:</span>
              <span className="font-semibold text-green-600">108%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Смены:</span>
              <span className="font-semibold">3/3 активны</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Работает</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Рудник №3 (Воркута)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Выработка сегодня:</span>
              <span className="font-semibold">1,956 т</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">План выполнен:</span>
              <span className="font-semibold text-orange-600">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Смены:</span>
              <span className="font-semibold">2/3 активны</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">Ремонт №2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Завод №1 (Тула)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Переработано:</span>
              <span className="font-semibold">7,842 т</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Загрузка линий:</span>
              <span className="font-semibold">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Выход продукции:</span>
              <span className="font-semibold text-green-600">96.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Завод №2 (Воронеж)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Переработано:</span>
              <span className="font-semibold">6,934 т</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Загрузка линий:</span>
              <span className="font-semibold">89%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Выход продукции:</span>
              <span className="font-semibold text-green-600">95.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Страница 3: Логистика
  const LogisticsPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление логистикой</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Активные маршруты</p>
          <p className="text-2xl font-bold mt-2">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">В пути (тонн)</p>
          <p className="text-2xl font-bold mt-2">12,450</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Стоимость доставки</p>
          <p className="text-2xl font-bold mt-2">8.4 млн ₽</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Задержки</p>
          <p className="text-2xl font-bold mt-2 text-orange-600">2</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Текущие перевозки</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Маршрут</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Объем, т</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Прибытие</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Прогресс</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-3">Рудник №1 → Завод №1</td>
              <td className="px-4 py-3">2,840</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">В пути</span></td>
              <td className="px-4 py-3">25.10.2025 14:30</td>
              <td className="px-4 py-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">Рудник №2 → Завод №2</td>
              <td className="px-4 py-3">3,120</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">В пути</span></td>
              <td className="px-4 py-3">25.10.2025 18:00</td>
              <td className="px-4 py-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '42%'}}></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">Завод №1 → Склад СПб</td>
              <td className="px-4 py-3">1,950</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Задержка</span></td>
              <td className="px-4 py-3">25.10.2025 10:00</td>
              <td className="px-4 py-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Оптимизация маршрутов</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-2">Экономия за месяц:</p>
            <p className="text-3xl font-bold text-green-600">-4.2 млн ₽</p>
            <p className="text-sm text-gray-500 mt-1">За счет оптимизации маршрутов</p>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Сокращение времени доставки:</p>
            <p className="text-3xl font-bold text-blue-600">-12%</p>
            <p className="text-sm text-gray-500 mt-1">В среднем по всем маршрутам</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Страница 4: Финансы
  const FinancesPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Финансовая аналитика</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Выручка за месяц</p>
          <p className="text-3xl font-bold mt-2">2,847 млн ₽</p>
          <p className="text-green-500 text-sm mt-1">+12.4% к прошлому месяцу</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Чистая прибыль</p>
          <p className="text-3xl font-bold mt-2">456 млн ₽</p>
          <p className="text-green-500 text-sm mt-1">+8.7% к прошлому месяцу</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Рентабельность</p>
          <p className="text-3xl font-bold mt-2">16.0%</p>
          <p className="text-green-500 text-sm mt-1">+1.2% к прошлому месяцу</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Структура затрат</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Сравнение затрат (млн ₽)</h3>
          <div className="space-y-3">
            {costData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{item.category}</span>
                  <span className="text-sm font-semibold">{item.value} млн ₽</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{width: `${(item.value / 420) * 100}%`, backgroundColor: COLORS[index]}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Ключевые показатели экономии</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600">Снижение затрат на логистику</p>
            <p className="text-2xl font-bold text-green-600">-5.3%</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">Оптимизация ремонтов</p>
            <p className="text-2xl font-bold text-blue-600">-3.8%</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-600">Энергоэффективность</p>
            <p className="text-2xl font-bold text-orange-600">-2.1%</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-600">Общая экономия</p>
            <p className="text-2xl font-bold text-purple-600">127 млн ₽</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Страница 5: Оборудование
  const EquipmentPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мониторинг оборудования</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Всего единиц</p>
          <p className="text-2xl font-bold mt-2">1,247</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">В работе</p>
          <p className="text-2xl font-bold mt-2 text-green-600">1,183</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">На ремонте</p>
          <p className="text-2xl font-bold mt-2 text-orange-600">47</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Простой</p>
          <p className="text-2xl font-bold mt-2 text-red-600">17</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Критическое оборудование</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Название</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Локация</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Состояние</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Наработка</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">ТО через</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-3">EQ-1047</td>
              <td className="px-4 py-3">Экскаватор ЭКГ-8И</td>
              <td className="px-4 py-3">Рудник №1</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Исправно</span></td>
              <td className="px-4 py-3">4,234 ч</td>
              <td className="px-4 py-3">156 ч</td>
            </tr>
            <tr>
              <td className="px-4 py-3">EQ-1052</td>
              <td className="px-4 py-3">Дробилка КСД-2200</td>
              <td className="px-4 py-3">Завод №1</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Внимание</span></td>
              <td className="px-4 py-3">8,942 ч</td>
              <td className="px-4 py-3">24 ч</td>
            </tr>
            <tr>
              <td className="px-4 py-3">EQ-2034</td>
              <td className="px-4 py-3">Конвейер ЛК-1400</td>
              <td className="px-4 py-3">Рудник №3</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Ремонт</span></td>
              <td className="px-4 py-3">12,456 ч</td>
              <td className="px-4 py-3">Просрочено</td>
            </tr>
            <tr>
              <td className="px-4 py-3">EQ-3018</td>
              <td className="px-4 py-3">Флотомашина ФМ-32</td>
              <td className="px-4 py-3">Завод №2</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Исправно</span></td>
              <td className="px-4 py-3">2,847 ч</td>
              <td className="px-4 py-3">342 ч</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">КПД по предприятиям</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="эффективность" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Предстоящие ТО</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <div>
                <p className="font-semibold">Дробилка КСД-2200</p>
                <p className="text-sm text-gray-600">Завод №1</p>
              </div>
              <span className="text-orange-600 font-semibold">24 ч</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div>
                <p className="font-semibold">Экскаватор ЭКГ-12</p>
                <p className="text-sm text-gray-600">Рудник №2</p>
              </div>
              <span className="text-blue-600 font-semibold">72 ч</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div>
                <p className="font-semibold">Конвейер ЛК-2000</p>
                <p className="text-sm text-gray-600">Рудник №1</p>
              </div>
              <span className="text-blue-600 font-semibold">96 ч</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Страница 6: Склады
  const WarehousesPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление складами</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Всего складов</p>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Общий объем, т</p>
          <p className="text-2xl font-bold mt-2">48,450</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Средняя загрузка</p>
          <p className="text-2xl font-bold mt-2">67%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Критические остатки</p>
          <p className="text-2xl font-bold mt-2 text-red-600">3</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Состояние складов</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Склад</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Локация</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Тип</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Загрузка</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Объем, т</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-3">Склад-01</td>
              <td className="px-4 py-3">Рудник №1</td>
              <td className="px-4 py-3">Сырье</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                  <span className="text-sm">82%</span>
                </div>
              </td>
              <td className="px-4 py-3">8,200</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Норма</span></td>
            </tr>
            <tr>
              <td className="px-4 py-3">Склад-03</td>
              <td className="px-4 py-3">Завод №1</td>
              <td className="px-4 py-3">Продукция</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <span className="text-sm">45%</span>
                </div>
              </td>
              <td className="px-4 py-3">4,500</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Низкий</span></td>
            </tr>
            <tr>
              <td className="px-4 py-3">Склад-05</td>
              <td className="px-4 py-3">Рудник №2</td>
              <td className="px-4 py-3">Запчасти</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '18%'}}></div>
                  </div>
                  <span className="text-sm">18%</span>
                </div>
              </td>
              <td className="px-4 py-3">180</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Критический</span></td>
            </tr>
            <tr>
              <td className="px-4 py-3">Склад-07</td>
              <td className="px-4 py-3">Завод №2</td>
              <td className="px-4 py-3">Продукция</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '73%'}}></div>
                  </div>
                  <span className="text-sm">73%</span>
                </div>
              </td>
              <td className="px-4 py-3">7,300</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Норма</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Критические позиции</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="text-sm">Подшипники SKF 22220</span>
              <span className="text-red-600 font-semibold text-sm">8 шт</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="text-sm">Фильтры гидравлические</span>
              <span className="text-red-600 font-semibold text-sm">12 шт</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
              <span className="text-sm">Конвейерная лента</span>
              <span className="text-orange-600 font-semibold text-sm">145 м</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Заказы в пути</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <div>
                <p className="text-sm font-semibold">Заказ #3847</p>
                <p className="text-xs text-gray-600">Запчасти для Рудника №2</p>
              </div>
              <span className="text-blue-600 text-sm">2 дня</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <div>
                <p className="text-sm font-semibold">Заказ #3851</p>
                <p className="text-xs text-gray-600">ГСМ для всех объектов</p>
              </div>
              <span className="text-blue-600 text-sm">5 дней</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Страница 7: Персонал
  const PersonnelPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление персоналом</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Всего сотрудников</p>
          <p className="text-2xl font-bold mt-2">35,000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">На смене сейчас</p>
          <p className="text-2xl font-bold mt-2">11,234</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Производительность</p>
          <p className="text-2xl font-bold mt-2 text-green-600">+8.3%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Текучесть кадров</p>
          <p className="text-2xl font-bold mt-2">4.2%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Распределение по предприятиям</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Рудник №1</span>
                <span className="text-sm font-semibold">8,450 чел.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Рудник №2</span>
                <span className="text-sm font-semibold">9,120 чел.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '26%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Рудник №3</span>
                <span className="text-sm font-semibold">6,780 чел.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{width: '19%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Завод №1</span>
                <span className="text-sm font-semibold">5,340 чел.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Завод №2</span>
                <span className="text-sm font-semibold">4,890 чел.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-600 h-2 rounded-full" style={{width: '14%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Центральный офис</span>
                <span className="text-sm font-semibold">420 чел.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{width: '2%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">График смен</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">1-я смена (06:00 - 14:00)</span>
                <span className="text-green-600 font-semibold">Активна</span>
              </div>
              <p className="text-sm text-gray-600">3,748 человек на линии</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">2-я смена (14:00 - 22:00)</span>
                <span className="text-gray-600 font-semibold">Ожидание</span>
              </div>
              <p className="text-sm text-gray-600">Начало через 2 часа</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">3-я смена (22:00 - 06:00)</span>
                <span className="text-gray-600 font-semibold">Ожидание</span>
              </div>
              <p className="text-sm text-gray-600">Начало через 10 часов</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Ключевые HR-метрики</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">Средняя ЗП</p>
            <p className="text-2xl font-bold">87,500 ₽</p>
            <p className="text-sm text-green-600">+5.2% к прошлому году</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600">Удовлетворенность</p>
            <p className="text-2xl font-bold">7.8/10</p>
            <p className="text-sm text-green-600">+0.4 к прошлому кварталу</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-600">Вакансий открыто</p>
            <p className="text-2xl font-bold">147</p>
            <p className="text-sm text-gray-600">34 критических</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-600">Обучение персонала</p>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-sm text-gray-600">человек в этом месяце</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Страница 8: Аналитика
  const AnalyticsPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Бизнес-аналитика</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Прогресс по целям на год</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Увеличение чистой прибыли</span>
              <span className="font-bold text-green-600">+12.4% (цель: +10-15%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{width: '83%'}}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">8 месяцев до конца года</p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Сокращение операционных издержек</span>
              <span className="font-bold text-green-600">-8.7%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{width: '87%'}}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Целевой показатель: -10%</p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Оптимизация логистики</span>
              <span className="font-bold text-green-600">-12.1%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{width: '96%'}}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Сокращение времени доставки</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Производительность труда</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="добыча" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="план" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-green-700">+8.3%</span> рост производительности за последние 6 месяцев
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Экономический эффект от ИТ</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Автоматизация процессов</p>
              <p className="text-2xl font-bold text-blue-600">34.2 млн ₽</p>
              <p className="text-xs text-gray-500 mt-1">Экономия на ручном труде</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Оптимизация логистики</p>
              <p className="text-2xl font-bold text-green-600">28.7 млн ₽</p>
              <p className="text-xs text-gray-500 mt-1">Сокращение транспортных расходов</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-600">Предиктивное обслуживание</p>
              <p className="text-2xl font-bold text-purple-600">18.4 млн ₽</p>
              <p className="text-xs text-gray-500 mt-1">Снижение простоев оборудования</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Сравнение с рынком</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Показатель</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Наш холдинг</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Средний по РФ</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Международный</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Изменение</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-3">Производительность труда, т/чел</td>
              <td className="px-4 py-3 font-semibold">4.71</td>
              <td className="px-4 py-3">4.35</td>
              <td className="px-4 py-3">5.12</td>
              <td className="px-4 py-3"><span className="text-green-600">+8.3%</span></td>
            </tr>
            <tr>
              <td className="px-4 py-3">EBITDA маржа, %</td>
              <td className="px-4 py-3 font-semibold">28.4</td>
              <td className="px-4 py-3">24.7</td>
              <td className="px-4 py-3">31.2</td>
              <td className="px-4 py-3"><span className="text-green-600">+3.8%</span></td>
            </tr>
            <tr>
              <td className="px-4 py-3">Операционные издержки, ₽/т</td>
              <td className="px-4 py-3 font-semibold">6,847</td>
              <td className="px-4 py-3">7,320</td>
              <td className="px-4 py-3">6,450</td>
              <td className="px-4 py-3"><span className="text-green-600">-6.5%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Страница 9: Рынок сбыта
  const MarketPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мониторинг рынка сбыта</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Текущая цена, $/т</p>
          <p className="text-2xl font-bold mt-2">1,247</p>
          <p className="text-green-500 text-sm mt-1">+2.3% за неделю</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Курс USD/RUB</p>
          <p className="text-2xl font-bold mt-2">96.45</p>
          <p className="text-red-500 text-sm mt-1">+0.8% за день</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Объем продаж, т</p>
          <p className="text-2xl font-bold mt-2">14,567</p>
          <p className="text-gray-500 text-sm mt-1">За текущий месяц</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Выручка, млн ₽</p>
          <p className="text-2xl font-bold mt-2">1,753</p>
          <p className="text-green-500 text-sm mt-1">+15.2% к прошлому месяцу</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Динамика цен на сырье</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { month: 'Янв', цена: 1180 },
              { month: 'Фев', цена: 1195 },
              { month: 'Мар', цена: 1210 },
              { month: 'Апр', цена: 1225 },
              { month: 'Май', цена: 1215 },
              { month: 'Июн', цена: 1247 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="цена" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Структура продаж по регионам</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Европа</span>
                <span className="text-sm font-semibold">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '42%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Азия</span>
                <span className="text-sm font-semibold">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '35%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Россия</span>
                <span className="text-sm font-semibold">18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{width: '18%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Прочие</span>
                <span className="text-sm font-semibold">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '5%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Новости рынка</h3>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Рост спроса в Китае на 8%</p>
              <span className="text-xs text-gray-500">2 часа назад</span>
            </div>
            <p className="text-sm text-gray-700">Китайские производители увеличили закупки на фоне роста промышленного производства...</p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Прогноз: цены вырастут на 5-7% в Q4</p>
              <span className="text-xs text-gray-500">5 часов назад</span>
            </div>
            <p className="text-sm text-gray-700">Аналитики Goldman Sachs прогнозируют рост цен на сырье в четвертом квартале...</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Новые экологические нормы ЕС</p>
              <span className="text-xs text-gray-500">1 день назад</span>
            </div>
            <p className="text-sm text-gray-700">Европейский союз вводит дополнительные требования к экологичности производства...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Крупнейший клиент</h3>
          <p className="text-2xl font-bold text-blue-600">MegaCorp GmbH</p>
          <p className="text-sm text-gray-600 mt-1">23% от общего объема продаж</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Средний контракт</h3>
          <p className="text-2xl font-bold text-green-600">847 тонн</p>
          <p className="text-sm text-gray-600 mt-1">На сумму 102.3 млн ₽</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Активных клиентов</h3>
          <p className="text-2xl font-bold text-purple-600">127</p>
          <p className="text-sm text-gray-600 mt-1">+8 новых в этом месяце</p>
        </div>
      </div>
    </div>
  );

  // Страница 10: Уведомления и алерты
  const AlertsPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Система уведомлений</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Всего алертов</p>
          <p className="text-2xl font-bold mt-2">7</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Критические</p>
          <p className="text-2xl font-bold mt-2 text-red-600">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Требуют внимания</p>
          <p className="text-2xl font-bold mt-2 text-orange-600">4</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Решено сегодня</p>
          <p className="text-2xl font-bold mt-2 text-green-600">12</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Критические уведомления</h3>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-red-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-red-800">Критический уровень запасов</p>
                  <p className="text-sm text-gray-700 mt-1">Склад запчастей Рудник №2: осталось 18% от нормы. Требуется срочный заказ подшипников SKF 22220.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 09:23 • Склады</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Решить
              </button>
            </div>
          </div>

          <div className="p-4 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-red-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-red-800">Просрочено ТО оборудования</p>
                  <p className="text-sm text-gray-700 mt-1">Конвейер ЛК-1400 (Рудник №3) требует немедленного технического обслуживания. Просрочка: 48 часов.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 07:15 • Оборудование</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Решить
              </button>
            </div>
          </div>

          <div className="p-4 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-red-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-red-800">Отклонение от плана производства</p>
                  <p className="text-sm text-gray-700 mt-1">Рудник №3 выполнил только 87% плана за текущую смену. Причина: ремонт оборудования линии №2.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 06:45 • Производство</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Решить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Требуют внимания</h3>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-orange-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-orange-800">Задержка доставки</p>
                  <p className="text-sm text-gray-700 mt-1">Маршрут Завод №1 → Склад СПб задерживается на 4 часа из-за погодных условий.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 11:30 • Логистика</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                Отметить
              </button>
            </div>
          </div>

          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-orange-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-orange-800">Снижение КПД оборудования</p>
                  <p className="text-sm text-gray-700 mt-1">Дробилка КСД-2200 (Завод №1) показывает КПД 78% вместо нормативных 85%. Рекомендуется внеплановая проверка.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 10:15 • Оборудование</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                Отметить
              </button>
            </div>
          </div>

          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-orange-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-orange-800">Повышенный расход электроэнергии</p>
                  <p className="text-sm text-gray-700 mt-1">Завод №2 превысил норму энергопотребления на 12% за последние 3 дня.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 08:40 • Финансы</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                Отметить
              </button>
            </div>
          </div>

          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className="text-orange-500 mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-orange-800">Приближается срок ТО</p>
                  <p className="text-sm text-gray-700 mt-1">Дробилка КСД-2200 (Завод №1) требует технического обслуживания через 24 часа работы.</p>
                  <p className="text-xs text-gray-500 mt-2">Сегодня, 07:00 • Оборудование</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                Отметить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Решенные сегодня</h3>
        <div className="space-y-2">
          <div className="p-3 border-l-4 border-green-500 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <p className="text-sm">Восстановлена работа конвейера на Руднике №1</p>
              </div>
              <span className="text-xs text-gray-500">13:45</span>
            </div>
          </div>
          <div className="p-3 border-l-4 border-green-500 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <p className="text-sm">Пополнены запасы ГСМ на всех объектах</p>
              </div>
              <span className="text-xs text-gray-500">12:20</span>
            </div>
          </div>
          <div className="p-3 border-l-4 border-green-500 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <p className="text-sm">Завершено ТО экскаватора ЭКГ-12 (Рудник №2)</p>
              </div>
              <span className="text-xs text-gray-500">11:05</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Настройки уведомлений</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm">Email-уведомления о критических алертах</span>
            </label>
            <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm">SMS при авариях оборудования</span>
            </label>
            <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm">Push-уведомления о производстве</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Еженедельный отчет</span>
            </label>
            <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm">Уведомления о рыночных трендах</span>
            </label>
            <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm">Алерты о финансовых показателях</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Рендер выбранной страницы
  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'production': return <ProductionPage />;
      case 'logistics': return <LogisticsPage />;
      case 'finances': return <FinancesPage />;
      case 'equipment': return <EquipmentPage />;
      case 'warehouses': return <WarehousesPage />;
      case 'personnel': return <PersonnelPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'market': return <MarketPage />;
      case 'alerts': return <AlertsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Боковая панель навигации */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Производственный</h1>
          <h1 className="text-xl font-bold text-blue-600">Холдинг</h1>
          <p className="text-xs text-gray-500 mt-1">Система управления</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userInitials}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name || 'Оператор системы'}</p>
              <p className="text-xs text-gray-500 break-all">{user?.login}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border-b px-8 py-4 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Последнее обновление: {new Date().toLocaleString('ru-RU')}</p>
            <p className="text-xs text-gray-400">Последний вход: {lastLoginText}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.login}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Выйти
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Экспорт отчета
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {forcePasswordChange && (
            <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl space-y-3">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-orange-500" size={24} />
                <div>
                  <p className="font-semibold text-orange-900">Требуется сменить пароль</p>
                  <p className="text-sm text-orange-800">
                    Для вашей учетной записи еще не задан индивидуальный пароль. Сразу после входа установите новый,
                    используя форму безопасности ниже.
                  </p>
                </div>
              </div>
              <ul className="text-sm text-orange-900 list-disc list-inside space-y-1">
                <li>Текущий пароль временно совпадает с логином: {user?.login}</li>
                <li>Новый пароль должен содержать не менее 8 символов</li>
                <li>После успешного сохранения доступ к панели разблокируется без предупреждений</li>
              </ul>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold">Безопасность профиля</h2>
                <p className="text-sm text-gray-500">Смена пароля для учетной записи {user?.login}</p>
              </div>
              <p className="text-xs text-gray-400">Пароль можно изменять в любой момент</p>
            </div>
            <form className="grid gap-4 md:grid-cols-3" onSubmit={handlePasswordSubmit}>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1" htmlFor="currentPassword">
                  Текущий пароль
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={forcePasswordChange ? 'Пароль совпадает с логином' : '••••••••'}
                  required
                />
                {forcePasswordChange && (
                  <p className="text-xs text-orange-600 mt-1">
                    Временно используйте корпоративный логин в качестве текущего пароля
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1" htmlFor="newPassword">
                  Новый пароль
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Не менее 8 символов"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1" htmlFor="confirmPassword">
                  Подтверждение пароля
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Повторите новый пароль"
                  required
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition ${
                    passwordSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {passwordSaving ? 'Сохраняем...' : 'Сменить пароль'}
                </button>
              </div>
            </form>
            {passwordFeedback && (
              <p
                className={`mt-4 text-sm px-4 py-2 rounded ${
                  passwordFeedback.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {passwordFeedback.message}
              </p>
            )}
          </div>

          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default HoldingDashboard;
