// Configuration for Soda-Chlorate Employee Portal

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://api.soda-chlorate.com', // Замените на ваш реальный URL
        VERSION: 'v1',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },

    // Application Settings
    APP: {
        NAME: 'Soda-Chlorate Employee Portal',
        VERSION: '1.0.0',
        LANGUAGE: 'ru',
        TIMEZONE: 'Europe/Moscow'
    },

    // UI Configuration
    UI: {
        LOADING_DELAY: 300, // Минимальное время показа загрузки (мс)
        NOTIFICATION_DURATION: 5000, // Длительность показа уведомлений (мс)
        ANIMATION_DURATION: 300, // Длительность анимаций (мс)
        DEBOUNCE_DELAY: 500 // Задержка для debounce функций (мс)
    },

    // Data Configuration
    DATA: {
        SCHEDULE_WEEKS_AHEAD: 4, // Количество недель вперед для загрузки расписания
        SALARY_HISTORY_MONTHS: 12, // Количество месяцев истории зарплаты
        NEWS_ITEMS_PER_PAGE: 10, // Количество новостей на странице
        CACHE_DURATION: 300000 // Длительность кеширования данных (мс) - 5 минут
    },

    // Error Messages (Russian)
    ERRORS: {
        NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
        SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
        AUTH_ERROR: 'Ошибка авторизации. Войдите в систему заново.',
        VALIDATION_ERROR: 'Ошибка валидации данных.',
        TIMEOUT_ERROR: 'Превышено время ожидания ответа сервера.',
        UNKNOWN_ERROR: 'Произошла неизвестная ошибка.'
    },

    // Success Messages (Russian)
    SUCCESS: {
        DATA_LOADED: 'Данные успешно загружены.',
        DATA_SAVED: 'Данные успешно сохранены.',
        PROFILE_UPDATED: 'Профиль успешно обновлен.',
        LOGIN_SUCCESS: 'Вход выполнен успешно.'
    },

    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            ME: '/auth/me'
        },
        EMPLOYEE: {
            PROFILE: '/employees',
            SCHEDULE: '/employees/{id}/schedule',
            SALARY: '/employees/{id}/salary',
            DOCUMENTS: '/employees/{id}/documents'
        },
        SCHEDULE: {
            LIST: '/schedule',
            CREATE: '/schedule',
            UPDATE: '/schedule/{id}',
            DELETE: '/schedule/{id}'
        },
        SALARY: {
            INFO: '/salary/{id}',
            HISTORY: '/salary/{id}/history',
            PAYSLIP: '/salary/{id}/payslip/{month}'
        },
        NEWS: {
            LIST: '/news',
            ITEM: '/news/{id}',
            CATEGORIES: '/news/categories'
        }
    },

    // Local Storage Keys
    STORAGE: {
        AUTH_TOKEN: 'soda_chlorate_auth_token',
        USER_DATA: 'soda_chlorate_user_data',
        CACHE_PREFIX: 'soda_chlorate_cache_',
        SETTINGS: 'soda_chlorate_settings'
    },

    // Date Formats
    DATE_FORMATS: {
        API: 'YYYY-MM-DD',
        DISPLAY: 'DD.MM.YYYY',
        DATETIME: 'DD.MM.YYYY HH:mm',
        TIME: 'HH:mm'
    },

    // Validation Rules
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
        PASSWORD_MIN_LENGTH: 6
    }
};

// Функция для получения конфигурации
function getConfig() {
    return CONFIG;
}

// Функция для получения значения конфигурации по пути
function getConfigValue(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
}

// Функция для обновления конфигурации
function updateConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
    target[lastKey] = value;
}

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.getConfig = getConfig;
    window.getConfigValue = getConfigValue;
    window.updateConfig = updateConfig;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        getConfig,
        getConfigValue,
        updateConfig
    };
}