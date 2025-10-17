// API Module for Soda-Chlorate Employee Portal

class SodaChlorateAPI {
    constructor() {
        // Конфигурация API
        this.baseURL = 'https://api.soda-chlorate.com'; // Замените на ваш реальный URL
        this.apiVersion = 'v1';
        this.timeout = 10000; // 10 секунд
        
        // Токен авторизации (получается при логине)
        this.authToken = localStorage.getItem('authToken') || null;
        
        // Заголовки по умолчанию
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Установка токена авторизации
    setAuthToken(token) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }

    // Получение заголовков с авторизацией
    getHeaders() {
        const headers = { ...this.defaultHeaders };
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        return headers;
    }

    // Базовый метод для HTTP запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${this.apiVersion}${endpoint}`;
        
        const config = {
            method: 'GET',
            headers: this.getHeaders(),
            timeout: this.timeout,
            ...options
        };

        try {
            // Показываем индикатор загрузки
            this.showLoading(true);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('API Request Error:', error);
            this.handleError(error);
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    // Показать/скрыть индикатор загрузки
    showLoading(show) {
        const loadingElement = document.getElementById('loadingIndicator');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    // Обработка ошибок
    handleError(error) {
        console.error('API Error:', error);
        
        // Показываем уведомление пользователю
        this.showNotification('Ошибка загрузки данных. Попробуйте позже.', 'error');
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С РАСПИСАНИЕМ =====
    
    // Получить расписание сотрудника
    async getEmployeeSchedule(employeeId, startDate, endDate) {
        const params = new URLSearchParams({
            employee_id: employeeId,
            start_date: startDate,
            end_date: endDate
        });
        
        return await this.request(`/schedule?${params}`);
    }

    // Обновить расписание
    async updateSchedule(scheduleId, data) {
        return await this.request(`/schedule/${scheduleId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ЗАРПЛАТОЙ =====
    
    // Получить информацию о зарплате
    async getSalaryInfo(employeeId) {
        return await this.request(`/salary/${employeeId}`);
    }

    // Получить историю выплат
    async getSalaryHistory(employeeId, months = 12) {
        const params = new URLSearchParams({
            months: months
        });
        
        return await this.request(`/salary/${employeeId}/history?${params}`);
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С НОВОСТЯМИ =====
    
    // Получить новости компании
    async getCompanyNews(page = 1, limit = 10) {
        const params = new URLSearchParams({
            page: page,
            limit: limit
        });
        
        return await this.request(`/news?${params}`);
    }

    // Получить конкретную новость
    async getNewsItem(newsId) {
        return await this.request(`/news/${newsId}`);
    }

    // ===== МЕТОДЫ АВТОРИЗАЦИИ =====
    
    // Вход в систему
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

    // Выход из системы
    logout() {
        this.authToken = null;
        localStorage.removeItem('authToken');
    }

    // Получить информацию о текущем пользователе
    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С СОТРУДНИКАМИ =====
    
    // Получить список всех сотрудников
    async getEmployees(page = 1, limit = 10, search = '', department = '') {
        const params = new URLSearchParams({
            page: page,
            limit: limit
        });
        
        if (search) params.append('search', search);
        if (department) params.append('department', department);
        
        return await this.request(`/employees?${params}`);
    }

    // Получить информацию о конкретном сотруднике
    async getEmployee(employeeId) {
        return await this.request(`/employees/${employeeId}`);
    }

    // Создать нового сотрудника
    async createEmployee(data) {
        return await this.request('/employees', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Обновить информацию о сотруднике
    async updateEmployee(employeeId, data) {
        return await this.request(`/employees/${employeeId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Удалить сотрудника
    async deleteEmployee(employeeId) {
        return await this.request(`/employees/${employeeId}`, {
            method: 'DELETE'
        });
    }

    // Получить статистику по сотрудникам
    async getEmployeesStats() {
        return await this.request('/employees/stats');
    }

    // Получить отделы
    async getDepartments() {
        return await this.request('/departments');
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ПРОФИЛЕМ =====
    
    // Обновить профиль сотрудника
    async updateProfile(employeeId, data) {
        return await this.request(`/employees/${employeeId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Получить документы сотрудника
    async getEmployeeDocuments(employeeId) {
        return await this.request(`/employees/${employeeId}/documents`);
    }
}

// Создаем глобальный экземпляр API
window.api = new SodaChlorateAPI();

// Экспортируем класс для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SodaChlorateAPI;
}