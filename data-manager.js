// Data Manager for Soda-Chlorate Employee Portal

class DataManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = getConfigValue('DATA.CACHE_DURATION') || 300000; // 5 минут
        this.isOnline = navigator.onLine;
        
        // Слушаем изменения состояния сети
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
        });
    }

    // Проверка кеша
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < this.cacheTimeout;
    }

    // Получение данных из кеша
    getFromCache(key) {
        if (this.isCacheValid(key)) {
            return this.cache.get(key).data;
        }
        return null;
    }

    // Сохранение в кеш
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Очистка кеша
    clearCache() {
        this.cache.clear();
    }

    // ===== РАБОТА С РАСПИСАНИЕМ =====
    
    async loadSchedule(employeeId, startDate, endDate) {
        const cacheKey = `schedule_${employeeId}_${startDate}_${endDate}`;
        
        // Проверяем кеш
        const cachedData = this.getFromCache(cacheKey);
        if (cachedData && this.isOnline) {
            return cachedData;
        }

        try {
            const data = await window.api.getEmployeeSchedule(employeeId, startDate, endDate);
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            // Если нет сети, возвращаем кешированные данные
            if (!this.isOnline && cachedData) {
                return cachedData;
            }
            throw error;
        }
    }

    // ===== РАБОТА С ЗАРПЛАТОЙ =====
    
    async loadSalaryInfo(employeeId) {
        const cacheKey = `salary_${employeeId}`;
        
        const cachedData = this.getFromCache(cacheKey);
        if (cachedData && this.isOnline) {
            return cachedData;
        }

        try {
            const data = await window.api.getSalaryInfo(employeeId);
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            if (!this.isOnline && cachedData) {
                return cachedData;
            }
            throw error;
        }
    }

    async loadSalaryHistory(employeeId, months = 12) {
        const cacheKey = `salary_history_${employeeId}_${months}`;
        
        const cachedData = this.getFromCache(cacheKey);
        if (cachedData && this.isOnline) {
            return cachedData;
        }

        try {
            const data = await window.api.getSalaryHistory(employeeId, months);
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            if (!this.isOnline && cachedData) {
                return cachedData;
            }
            throw error;
        }
    }

    // ===== РАБОТА С НОВОСТЯМИ =====
    
    async loadNews(page = 1, limit = 10) {
        const cacheKey = `news_${page}_${limit}`;
        
        const cachedData = this.getFromCache(cacheKey);
        if (cachedData && this.isOnline) {
            return cachedData;
        }

        try {
            const data = await window.api.getCompanyNews(page, limit);
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            if (!this.isOnline && cachedData) {
                return cachedData;
            }
            throw error;
        }
    }

    // ===== РАБОТА С ПРОФИЛЕМ =====
    
    async loadUserProfile() {
        const cacheKey = 'user_profile';
        
        const cachedData = this.getFromCache(cacheKey);
        if (cachedData && this.isOnline) {
            return cachedData;
        }

        try {
            const data = await window.api.getCurrentUser();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            if (!this.isOnline && cachedData) {
                return cachedData;
            }
            throw error;
        }
    }

    // ===== СИНХРОНИЗАЦИЯ ОФЛАЙН ДАННЫХ =====
    
    async syncOfflineData() {
        // Здесь можно добавить логику синхронизации данных
        // когда устройство снова подключается к интернету
        console.log('Синхронизация офлайн данных...');
    }

    // ===== УВЕДОМЛЕНИЯ =====
    
    showOfflineNotification() {
        window.api.showNotification('Работа в офлайн режиме. Данные могут быть устаревшими.', 'warning');
    }

    // ===== УТИЛИТЫ =====
    
    formatDate(date, format = 'DISPLAY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        switch (format) {
            case 'API':
                return `${year}-${month}-${day}`;
            case 'DISPLAY':
                return `${day}.${month}.${year}`;
            case 'DATETIME':
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            case 'TIME':
                return `${hours}:${minutes}`;
            default:
                return d.toLocaleDateString('ru-RU');
        }
    }

    formatCurrency(amount, currency = 'RUB') {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    }

    // ===== ОБРАБОТКА ОШИБОК =====
    
    handleError(error, context = '') {
        console.error(`DataManager Error ${context}:`, error);
        
        let message = getConfigValue('ERRORS.UNKNOWN_ERROR');
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            message = getConfigValue('ERRORS.NETWORK_ERROR');
        } else if (error.message.includes('timeout')) {
            message = getConfigValue('ERRORS.TIMEOUT_ERROR');
        } else if (error.message.includes('401')) {
            message = getConfigValue('ERRORS.AUTH_ERROR');
        } else if (error.message.includes('500')) {
            message = getConfigValue('ERRORS.SERVER_ERROR');
        }
        
        window.api.showNotification(message, 'error');
    }
}

// Создаем глобальный экземпляр DataManager
window.dataManager = new DataManager();

// Экспорт для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}