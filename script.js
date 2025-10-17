// Employee Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupSchedule();
    setupDateSelector();
    setupAPI();
    setupEmployees();
    loadInitialData();
}

// ===== EMPLOYEES SETUP =====

function setupEmployees() {
    // Инициализация модуля сотрудников
    if (window.employeesManager) {
        // Загружаем сотрудников при инициализации
        window.employeesManager.loadEmployees();
        window.employeesManager.loadStats();
    }
}

// ===== API SETUP =====

function setupAPI() {
    // Проверяем наличие токена авторизации
    const token = localStorage.getItem('authToken');
    if (token) {
        window.api.setAuthToken(token);
    } else {
        // Если нет токена, показываем форму входа
        showLoginForm();
    }
}

function showLoginForm() {
    // Создаем модальное окно для входа
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="login-content">
            <h2>Вход в систему</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Пароль:</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="login-btn">Войти</button>
            </form>
        </div>
    `;
    
    // Добавляем стили
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    document.body.appendChild(modal);
    
    // Обработчик формы входа
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await window.api.login(email, password);
            modal.remove();
            loadInitialData();
        } catch (error) {
            window.api.showNotification('Ошибка входа. Проверьте данные.', 'error');
        }
    });
}

// Navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Schedule functionality
function setupSchedule() {
    generateSchedule();
}

function generateSchedule() {
    const scheduleBody = document.getElementById('scheduleBody');
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    const scheduleData = {
        'Понедельник': ['Работа', 'Работа', 'Работа', 'Работа', 'Обед', 'Работа', 'Работа', 'Работа', 'Работа', 'Работа'],
        'Вторник': ['Работа', 'Работа', 'Работа', 'Работа', 'Обед', 'Работа', 'Работа', 'Работа', 'Работа', 'Работа'],
        'Среда': ['Работа', 'Работа', 'Работа', 'Работа', 'Обед', 'Работа', 'Работа', 'Работа', 'Работа', 'Работа'],
        'Четверг': ['Работа', 'Работа', 'Работа', 'Работа', 'Обед', 'Работа', 'Работа', 'Работа', 'Работа', 'Работа'],
        'Пятница': ['Работа', 'Работа', 'Работа', 'Работа', 'Обед', 'Работа', 'Работа', 'Работа', 'Работа', 'Работа'],
        'Суббота': ['Выходной', 'Выходной', 'Выходной', 'Выходной', 'Выходной', 'Выходной', 'Выходной', 'Выходной', 'Выходной', 'Выходной']
    };

    scheduleBody.innerHTML = '';

    timeSlots.forEach((time, timeIndex) => {
        // Time column
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        scheduleBody.appendChild(timeSlot);

        // Day columns
        Object.keys(scheduleData).forEach(day => {
            const workSlot = document.createElement('div');
            const status = scheduleData[day][timeIndex];
            
            if (status === 'Работа') {
                workSlot.className = 'work-slot';
                workSlot.textContent = 'Работа';
            } else if (status === 'Обед') {
                workSlot.className = 'off-slot';
                workSlot.textContent = 'Обед';
            } else {
                workSlot.className = 'off-slot';
                workSlot.textContent = 'Выходной';
            }
            
            scheduleBody.appendChild(workSlot);
        });
    });
}

// Date selector functionality
function setupDateSelector() {
    const prevBtn = document.getElementById('prevWeek');
    const nextBtn = document.getElementById('nextWeek');
    const currentWeekSpan = document.getElementById('currentWeek');
    
    let currentDate = new Date();
    updateWeekDisplay();

    prevBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeekDisplay();
    });

    nextBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeekDisplay();
    });

    function updateWeekDisplay() {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const options = { day: 'numeric', month: 'long' };
        const startStr = startOfWeek.toLocaleDateString('ru-RU', options);
        const endStr = endOfWeek.toLocaleDateString('ru-RU', options);
        
        currentWeekSpan.textContent = `${startStr} - ${endStr}`;
    }
}

// Load initial data
async function loadInitialData() {
    try {
        console.log('Загрузка данных сотрудника...');
        
        // Загружаем данные пользователя
        const userData = await window.dataManager.loadUserProfile();
        updateUserInfo(userData);
        
        // Загружаем расписание
        await loadScheduleData();
        
        // Загружаем данные о зарплате
        await loadSalaryData();
        
        // Загружаем новости
        await loadNewsData();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        window.dataManager.handleError(error, 'loadInitialData');
    }
}

// Обновление информации о пользователе
function updateUserInfo(userData) {
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && userData.name) {
        userNameElement.textContent = userData.name;
    }
}

// Загрузка данных расписания
async function loadScheduleData() {
    try {
        const employeeId = getCurrentEmployeeId();
        const startDate = getWeekStartDate();
        const endDate = getWeekEndDate();
        
        const scheduleData = await window.dataManager.loadSchedule(employeeId, startDate, endDate);
        updateScheduleDisplay(scheduleData);
        
    } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
        // Показываем статическое расписание при ошибке
    }
}

// Загрузка данных о зарплате
async function loadSalaryData() {
    try {
        const employeeId = getCurrentEmployeeId();
        
        const salaryInfo = await window.dataManager.loadSalaryInfo(employeeId);
        updateSalaryDisplay(salaryInfo);
        
        const salaryHistory = await window.dataManager.loadSalaryHistory(employeeId);
        updateSalaryHistory(salaryHistory);
        
    } catch (error) {
        console.error('Ошибка загрузки данных о зарплате:', error);
        // Показываем статические данные при ошибке
    }
}

// Загрузка новостей
async function loadNewsData() {
    try {
        const newsData = await window.dataManager.loadNews(1, 10);
        updateNewsDisplay(newsData);
        
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        // Показываем статические новости при ошибке
    }
}

// Получение ID текущего сотрудника
function getCurrentEmployeeId() {
    // В реальном приложении это должно приходить с сервера
    return localStorage.getItem('employeeId') || '1';
}

// Получение даты начала недели
function getWeekStartDate() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    return window.dataManager.formatDate(startOfWeek, 'API');
}

// Получение даты конца недели
function getWeekEndDate() {
    const startOfWeek = new Date(getWeekStartDate());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return window.dataManager.formatDate(endOfWeek, 'API');
}

// Обновление отображения расписания
function updateScheduleDisplay(scheduleData) {
    // Здесь обновляем расписание на основе данных с API
    console.log('Обновление расписания:', scheduleData);
}

// Обновление отображения зарплаты
function updateSalaryDisplay(salaryInfo) {
    // Обновляем карточки с информацией о зарплате
    if (salaryInfo.currentSalary) {
        const salaryAmount = document.querySelector('.salary-amount');
        if (salaryAmount) {
            salaryAmount.textContent = window.dataManager.formatCurrency(salaryInfo.currentSalary);
        }
    }
}

// Обновление истории зарплаты
function updateSalaryHistory(historyData) {
    // Обновляем таблицу истории зарплаты
    console.log('Обновление истории зарплаты:', historyData);
}

// Обновление отображения новостей
function updateNewsDisplay(newsData) {
    // Обновляем список новостей
    console.log('Обновление новостей:', newsData);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Add some interactive features
function addInteractiveFeatures() {
    // Add click handlers for news items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add hover effects for salary cards
    const salaryCards = document.querySelectorAll('.salary-card');
    salaryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 20px rgba(30, 60, 114, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Initialize interactive features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addInteractiveFeatures();
});

// Add some sample data updates (simulating real-time updates)
function simulateDataUpdates() {
    // Update current time in schedule
    setInterval(() => {
        const now = new Date();
        const currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        // You could highlight the current time slot here
        console.log('Текущее время:', currentTime);
    }, 60000); // Update every minute
}

// Start data updates
simulateDataUpdates();

// Export functions for potential external use
window.EmployeePortal = {
    generateSchedule,
    formatCurrency,
    formatDate
};