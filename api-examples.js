// Примеры подключения к различным типам API для Soda-Chlorate

// ===== ПРИМЕР 1: REST API (Node.js/Express) =====

// Серверная часть (Node.js/Express)
/*
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Маршруты API
app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Проверка учетных данных
    if (email === 'employee@soda-chlorate.com' && password === 'password') {
        const token = jwt.sign(
            { userId: 1, email: email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token: token,
            user: {
                id: 1,
                name: 'Иван Петров',
                email: email,
                position: 'Инженер-химик'
            }
        });
    } else {
        res.status(401).json({ error: 'Неверные учетные данные' });
    }
});

app.get('/api/v1/employees/:id/schedule', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    
    // Здесь получаем данные из базы данных
    const schedule = {
        employee_id: id,
        start_date: start_date,
        end_date: end_date,
        shifts: [
            {
                date: '2024-01-15',
                start_time: '08:00',
                end_time: '17:00',
                type: 'work',
                department: 'Производство'
            }
            // ... другие смены
        ]
    };
    
    res.json(schedule);
});

app.get('/api/v1/employees/:id/salary', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    const salaryInfo = {
        employee_id: id,
        current_salary: 75000,
        bonus: 12500,
        next_payment: '2024-01-15',
        currency: 'RUB'
    };
    
    res.json(salaryInfo);
});

app.listen(3000, () => {
    console.log('API сервер запущен на порту 3000');
});
*/

// ===== ПРИМЕР 2: GraphQL API =====

// GraphQL схема
const graphqlSchema = `
type Employee {
    id: ID!
    name: String!
    email: String!
    position: String!
    schedule(startDate: String!, endDate: String!): [Shift!]!
    salary: SalaryInfo!
}

type Shift {
    id: ID!
    date: String!
    startTime: String!
    endTime: String!
    type: ShiftType!
    department: String!
}

type SalaryInfo {
    currentSalary: Float!
    bonus: Float!
    nextPayment: String!
    history: [SalaryHistory!]!
}

type SalaryHistory {
    month: String!
    baseSalary: Float!
    bonus: Float!
    total: Float!
}

enum ShiftType {
    WORK
    BREAK
    OFF
}

type Query {
    me: Employee!
    news(page: Int, limit: Int): [NewsItem!]!
}

type Mutation {
    login(email: String!, password: String!): AuthPayload!
    updateProfile(input: ProfileInput!): Employee!
}

type AuthPayload {
    token: String!
    user: Employee!
}

input ProfileInput {
    name: String
    email: String
    phone: String
}
`;

// GraphQL клиент
class GraphQLClient {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.token = localStorage.getItem('authToken');
    }

    async query(query, variables = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token ? `Bearer ${this.token}` : ''
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        return result.data;
    }

    async getEmployeeSchedule(employeeId, startDate, endDate) {
        const query = `
            query GetSchedule($employeeId: ID!, $startDate: String!, $endDate: String!) {
                employee(id: $employeeId) {
                    schedule(startDate: $startDate, endDate: $endDate) {
                        id
                        date
                        startTime
                        endTime
                        type
                        department
                    }
                }
            }
        `;

        const result = await this.query(query, {
            employeeId: employeeId,
            startDate: startDate,
            endDate: endDate
        });

        return result.employee.schedule;
    }

    async getEmployeeSalary(employeeId) {
        const query = `
            query GetSalary($employeeId: ID!) {
                employee(id: $employeeId) {
                    salary {
                        currentSalary
                        bonus
                        nextPayment
                        history {
                            month
                            baseSalary
                            bonus
                            total
                        }
                    }
                }
            }
        `;

        const result = await this.query(query, { employeeId: employeeId });
        return result.employee.salary;
    }
}

// ===== ПРИМЕР 3: WebSocket для реального времени =====

class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }

    connect() {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
            console.log('WebSocket подключен');
            this.reconnectAttempts = 0;
            this.authenticate();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.ws.onclose = () => {
            console.log('WebSocket отключен');
            this.reconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket ошибка:', error);
        };
    }

    authenticate() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.send({
                type: 'auth',
                token: token
            });
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case 'schedule_update':
                this.updateSchedule(data.payload);
                break;
            case 'salary_update':
                this.updateSalary(data.payload);
                break;
            case 'news_update':
                this.updateNews(data.payload);
                break;
            case 'notification':
                this.showNotification(data.payload);
                break;
        }
    }

    updateSchedule(scheduleData) {
        // Обновляем расписание в реальном времени
        console.log('Обновление расписания:', scheduleData);
    }

    updateSalary(salaryData) {
        // Обновляем информацию о зарплате
        console.log('Обновление зарплаты:', salaryData);
    }

    updateNews(newsData) {
        // Обновляем новости
        console.log('Обновление новостей:', newsData);
    }

    showNotification(notification) {
        window.api.showNotification(notification.message, notification.type);
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Попытка переподключения ${this.reconnectAttempts}`);
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// ===== ПРИМЕР 4: Интеграция с внешними API =====

class ExternalAPIIntegration {
    constructor() {
        this.weatherAPI = 'https://api.openweathermap.org/data/2.5/weather';
        this.weatherAPIKey = 'YOUR_API_KEY';
        this.currencyAPI = 'https://api.exchangerate-api.com/v4/latest/RUB';
    }

    async getWeatherForLocation(lat, lon) {
        try {
            const response = await fetch(
                `${this.weatherAPI}?lat=${lat}&lon=${lon}&appid=${this.weatherAPIKey}&units=metric&lang=ru`
            );
            const data = await response.json();
            return {
                temperature: data.main.temp,
                description: data.weather[0].description,
                icon: data.weather[0].icon
            };
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            return null;
        }
    }

    async getCurrencyRates() {
        try {
            const response = await fetch(this.currencyAPI);
            const data = await response.json();
            return data.rates;
        } catch (error) {
            console.error('Ошибка получения курсов валют:', error);
            return null;
        }
    }
}

// ===== ПРИМЕР 5: Кеширование и офлайн поддержка =====

class CacheManager {
    constructor() {
        this.cacheName = 'soda-chlorate-cache';
        this.cacheVersion = 'v1';
    }

    async openCache() {
        if ('caches' in window) {
            return await caches.open(`${this.cacheName}-${this.cacheVersion}`);
        }
        return null;
    }

    async cacheRequest(request, response) {
        const cache = await this.openCache();
        if (cache) {
            await cache.put(request, response.clone());
        }
    }

    async getCachedResponse(request) {
        const cache = await this.openCache();
        if (cache) {
            return await cache.match(request);
        }
        return null;
    }

    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(name => {
                    if (name.startsWith(this.cacheName)) {
                        return caches.delete(name);
                    }
                })
            );
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ API =====

// Инициализация различных типов API
function initializeAPIs() {
    // REST API
    window.api = new SodaChlorateAPI();
    
    // GraphQL клиент
    window.graphqlClient = new GraphQLClient('https://api.soda-chlorate.com/graphql');
    
    // WebSocket для реального времени
    window.wsManager = new WebSocketManager('wss://api.soda-chlorate.com/ws');
    window.wsManager.connect();
    
    // Внешние API
    window.externalAPI = new ExternalAPIIntegration();
    
    // Кеш менеджер
    window.cacheManager = new CacheManager();
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GraphQLClient,
        WebSocketManager,
        ExternalAPIIntegration,
        CacheManager,
        initializeAPIs
    };
}