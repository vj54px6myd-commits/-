# Настройка API для Soda-Chlorate Employee Portal

## Обзор

Этот документ содержит инструкции по настройке и подключению API для приложения личного кабинета сотрудника Soda-Chlorate.

## Быстрый старт

### 1. Настройка конфигурации

Откройте файл `config.js` и измените следующие параметры:

```javascript
const CONFIG = {
    API: {
        BASE_URL: 'https://your-api-domain.com', // Замените на ваш URL
        VERSION: 'v1',
        TIMEOUT: 10000,
        // ... другие параметры
    }
};
```

### 2. Настройка аутентификации

В файле `api.js` настройте метод аутентификации:

```javascript
// Для JWT токенов
async login(email, password) {
    const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
        this.setAuthToken(response.token);
    }
    
    return response;
}
```

## Типы API

### 1. REST API

#### Структура endpoints:

```
GET  /api/v1/employees/{id}/schedule    - Получить расписание
GET  /api/v1/employees/{id}/salary      - Получить информацию о зарплате
GET  /api/v1/employees/{id}/salary/history - История зарплаты
GET  /api/v1/news                       - Получить новости
POST /api/v1/auth/login                 - Вход в систему
GET  /api/v1/auth/me                    - Информация о текущем пользователе
```

#### Пример ответа для расписания:

```json
{
    "employee_id": 1,
    "start_date": "2024-01-15",
    "end_date": "2024-01-21",
    "shifts": [
        {
            "id": 1,
            "date": "2024-01-15",
            "start_time": "08:00",
            "end_time": "17:00",
            "type": "work",
            "department": "Производство"
        }
    ]
}
```

#### Пример ответа для зарплаты:

```json
{
    "employee_id": 1,
    "current_salary": 75000,
    "bonus": 12500,
    "next_payment": "2024-01-15",
    "currency": "RUB",
    "history": [
        {
            "month": "2023-12",
            "base_salary": 75000,
            "bonus": 10000,
            "total": 85000
        }
    ]
}
```

### 2. GraphQL API

#### Схема:

```graphql
type Employee {
    id: ID!
    name: String!
    email: String!
    schedule(startDate: String!, endDate: String!): [Shift!]!
    salary: SalaryInfo!
}

type Query {
    me: Employee!
    news(page: Int, limit: Int): [NewsItem!]!
}
```

#### Пример запроса:

```javascript
const query = `
    query GetEmployeeData {
        me {
            id
            name
            schedule(startDate: "2024-01-15", endDate: "2024-01-21") {
                date
                startTime
                endTime
                type
            }
            salary {
                currentSalary
                bonus
                nextPayment
            }
        }
    }
`;
```

### 3. WebSocket для реального времени

#### Подключение:

```javascript
const ws = new WebSocket('wss://your-api-domain.com/ws');

ws.onopen = function() {
    // Отправляем токен авторизации
    ws.send(JSON.stringify({
        type: 'auth',
        token: localStorage.getItem('authToken')
    }));
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'schedule_update':
            updateSchedule(data.payload);
            break;
        case 'salary_update':
            updateSalary(data.payload);
            break;
    }
};
```

## Настройка сервера

### Node.js/Express пример:

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware для CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Маршруты API
app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Проверка учетных данных
    if (isValidCredentials(email, password)) {
        const token = jwt.sign(
            { userId: 1, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token: token,
            user: {
                id: 1,
                name: 'Иван Петров',
                email: email
            }
        });
    } else {
        res.status(401).json({ error: 'Неверные учетные данные' });
    }
});

app.get('/api/v1/employees/:id/schedule', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    
    // Получение данных из базы данных
    const schedule = getScheduleFromDB(id, start_date, end_date);
    res.json(schedule);
});

app.listen(3000, () => {
    console.log('API сервер запущен на порту 3000');
});
```

### PHP/Laravel пример:

```php
<?php
// routes/api.php

Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/employees/{id}/schedule', [ScheduleController::class, 'index']);
    Route::get('/employees/{id}/salary', [SalaryController::class, 'index']);
    Route::get('/news', [NewsController::class, 'index']);
});

// app/Http/Controllers/ScheduleController.php
class ScheduleController extends Controller
{
    public function index(Request $request, $id)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        $schedule = Schedule::where('employee_id', $id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();
            
        return response()->json($schedule);
    }
}
```

## Безопасность

### 1. HTTPS

Обязательно используйте HTTPS для всех API запросов:

```javascript
const CONFIG = {
    API: {
        BASE_URL: 'https://api.soda-chlorate.com', // Только HTTPS!
    }
};
```

### 2. JWT токены

```javascript
// Установка токена
localStorage.setItem('authToken', token);

// Использование токена в запросах
headers: {
    'Authorization': `Bearer ${token}`
}
```

### 3. CORS настройки

```javascript
// На сервере
app.use(cors({
    origin: ['https://your-frontend-domain.com'],
    credentials: true
}));
```

## Тестирование API

### 1. Использование Postman

Создайте коллекцию с запросами:

```
POST https://api.soda-chlorate.com/api/v1/auth/login
Body: {
    "email": "test@soda-chlorate.com",
    "password": "password"
}

GET https://api.soda-chlorate.com/api/v1/employees/1/schedule?start_date=2024-01-15&end_date=2024-01-21
Headers: {
    "Authorization": "Bearer YOUR_TOKEN"
}
```

### 2. Использование curl

```bash
# Вход в систему
curl -X POST https://api.soda-chlorate.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@soda-chlorate.com","password":"password"}'

# Получение расписания
curl -X GET "https://api.soda-chlorate.com/api/v1/employees/1/schedule?start_date=2024-01-15&end_date=2024-01-21" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Мониторинг и логирование

### 1. Логирование запросов

```javascript
// В api.js
async request(endpoint, options = {}) {
    console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);
    
    try {
        const response = await fetch(url, config);
        console.log(`API Response: ${response.status}`);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
```

### 2. Мониторинг ошибок

```javascript
// Отправка ошибок в сервис мониторинга
function logError(error, context) {
    // Sentry, LogRocket, или другой сервис
    if (window.Sentry) {
        window.Sentry.captureException(error, {
            tags: { context: context }
        });
    }
}
```

## Развертывание

### 1. Переменные окружения

```bash
# .env
API_BASE_URL=https://api.soda-chlorate.com
JWT_SECRET=your-secret-key
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=soda_chlorate
```

### 2. Docker

```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Nginx конфигурация

```nginx
server {
    listen 80;
    server_name api.soda-chlorate.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Поддержка

Для получения помощи по настройке API обращайтесь к команде разработки Soda-Chlorate.

---

© 2024 Soda-Chlorate. Все права защищены.