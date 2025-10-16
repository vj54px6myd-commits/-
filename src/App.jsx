import React, { useState, useEffect } from 'react'
import { Calendar, DollarSign, Newspaper, Clock, TrendingUp, Users, Award, FileText } from 'lucide-react'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock data for employee
  const employee = {
    name: 'Иванов Иван Петрович',
    position: 'Инженер-технолог',
    department: 'Производственный отдел',
    avatar: 'ИИ'
  }

  // Schedule data
  const schedule = [
    {
      date: 'Понедельник, 16 октября',
      time: '08:00 - 17:00',
      shift: 'Дневная смена',
      location: 'Цех №3'
    },
    {
      date: 'Вторник, 17 октября',
      time: '08:00 - 17:00',
      shift: 'Дневная смена',
      location: 'Цех №3'
    },
    {
      date: 'Среда, 18 октября',
      time: '08:00 - 17:00',
      shift: 'Дневная смена',
      location: 'Цех №3'
    },
    {
      date: 'Четверг, 19 октября',
      time: '20:00 - 05:00',
      shift: 'Ночная смена',
      location: 'Цех №3'
    },
    {
      date: 'Пятница, 20 октября',
      time: 'Выходной',
      shift: '',
      location: ''
    }
  ]

  // Salary data
  const salary = {
    current: '125 450',
    period: 'Октябрь 2025',
    details: [
      { label: 'Основная зарплата', value: '95 000 ₽' },
      { label: 'Премия', value: '15 000 ₽' },
      { label: 'Надбавка за вредность', value: '12 000 ₽' },
      { label: 'Сверхурочные', value: '8 450 ₽' },
      { label: 'Налоги', value: '- 5 000 ₽', isNegative: true }
    ]
  }

  // Company news
  const news = [
    {
      id: 1,
      title: 'Новое оборудование в цехе №3',
      excerpt: 'В рамках модернизации производства установлено новое европейское оборудование для повышения эффективности производства хлора и каустической соды.',
      date: '15 октября 2025',
      category: 'Производство'
    },
    {
      id: 2,
      title: 'Программа повышения квалификации',
      excerpt: 'Открыта запись на курсы повышения квалификации по новым технологиям химического производства. Обучение будет проходить с 1 ноября.',
      date: '12 октября 2025',
      category: 'Обучение'
    },
    {
      id: 3,
      title: 'Результаты работы за III квартал 2025',
      excerpt: 'Компания "Содо-Хлорат" показала отличные результаты за третий квартал. Производительность выросла на 15%, что позволило увеличить премиальный фонд сотрудников.',
      date: '10 октября 2025',
      category: 'Компания'
    },
    {
      id: 4,
      title: 'Требования по технике безопасности',
      excerpt: 'Напоминаем всем сотрудникам о необходимости строгого соблюдения правил техники безопасности при работе с химическими веществами.',
      date: '8 октября 2025',
      category: 'Безопасность'
    }
  ]

  // Statistics
  const stats = [
    { value: '247', label: 'Часов отработано' },
    { value: '98%', label: 'Выполнение плана' },
    { value: '5 лет', label: 'В компании' },
    { value: '12', label: 'Дней отпуска' }
  ]

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Award size={32} color="#001f3f" />
            </div>
            <div>
              <div className="company-name">СОДО-ХЛОРАТ</div>
              <div className="company-subtitle">Портал сотрудника</div>
            </div>
          </div>
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">{employee.name}</div>
              <div className="user-position">{employee.position}</div>
            </div>
            <div className="user-avatar">{employee.avatar}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Statistics Section */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Schedule Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon">
                <Calendar size={28} />
              </div>
              <h2 className="card-title">Мой график</h2>
            </div>
            <div className="card-content">
              <div className="schedule-list">
                {schedule.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-date">{item.date}</div>
                    <div className="schedule-time">
                      <Clock size={16} />
                      {item.time}
                    </div>
                    {item.shift && (
                      <div className="schedule-shift">
                        {item.shift} • {item.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon">
                <DollarSign size={28} />
              </div>
              <h2 className="card-title">Заработная плата</h2>
            </div>
            <div className="card-content">
              <div className="salary-summary">
                <div className="salary-label">К начислению</div>
                <div className="salary-amount">{salary.current} ₽</div>
                <div className="salary-period">{salary.period}</div>
              </div>
              <div className="salary-details">
                {salary.details.map((item, index) => (
                  <div key={index} className="salary-row">
                    <span className="salary-row-label">{item.label}</span>
                    <span 
                      className="salary-row-value" 
                      style={{ color: item.isNegative ? '#d32f2f' : '#001f3f' }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* News Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon">
                <Newspaper size={28} />
              </div>
              <h2 className="card-title">Новости компании</h2>
            </div>
            <div className="card-content">
              <div className="news-list">
                {news.map((item) => (
                  <div key={item.id} className="news-item">
                    <div className="news-header">
                      <span className="news-badge">{item.category}</span>
                      <span className="news-date">{item.date}</span>
                    </div>
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-excerpt">{item.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-button">
            <FileText size={20} />
            Мои документы
          </button>
          <button className="action-button">
            <Users size={20} />
            Коллеги
          </button>
          <button className="action-button">
            <TrendingUp size={20} />
            Отчёты
          </button>
          <button className="action-button">
            <Calendar size={20} />
            Отпуск
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
