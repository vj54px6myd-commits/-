// Employee Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupSchedule();
    setupDateSelector();
    loadInitialData();
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
function loadInitialData() {
    // Simulate loading data
    console.log('Загрузка данных сотрудника...');
    
    // You can add API calls here to load real data
    // For now, we're using static data defined in HTML
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