// Employee Portal JavaScript

// Global function for shift data
function getShiftData(shiftCode) {
    const shifts = {
        morning: {
            name: "Утренняя смена",
            time: "7:30 - 19:30"
        },
        night: {
            name: "Ночная смена",
            time: "19:30 - 7:30"
        },
        day: {
            name: "Дневная смена",
            time: "8:00 - 17:00"
        }
    };
    return shifts[shiftCode] || shifts.day;
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication system
    initializeAuth();
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
    
    // Schedule week navigation
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const currentWeekSpan = document.getElementById('currentWeek');
    
    let currentWeek = 0; // 0 = current week, -1 = previous week, 1 = next week
    
    function updateWeekDisplay() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7)); // Monday
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
        
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        
        const startStr = startOfWeek.toLocaleDateString('ru-RU', options);
        const endStr = endOfWeek.toLocaleDateString('ru-RU', options);
        
        currentWeekSpan.textContent = `Неделя ${startStr} - ${endStr}`;
    }
    
    prevWeekBtn.addEventListener('click', function() {
        currentWeek--;
        updateWeekDisplay();
    });
    
    nextWeekBtn.addEventListener('click', function() {
        currentWeek++;
        updateWeekDisplay();
    });
    
    // Initialize week display
    updateWeekDisplay();
    
    // Update schedule based on user's shift
    function updateSchedule() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;
        
        const employees = getEmployeesData();
        const employee = employees.find(emp => emp.id === currentUser.id);
        
        if (!employee) return;
        
        const scheduleDays = document.querySelectorAll('.schedule-day:not(.weekend)');
        
        scheduleDays.forEach((day, index) => {
            const shiftInfo = day.querySelector('.shift-info');
            const shiftTime = shiftInfo.querySelector('.shift-time');
            const shiftType = shiftInfo.querySelector('.shift-type');
            
            if (index < 5) { // Monday to Friday
                // Get shift information from employee data
                const shift = employee.shift || 'day';
                const shiftData = getShiftData(shift);
                
                shiftTime.textContent = shiftData.time;
                shiftType.textContent = shiftData.name;
                
                // Set color based on shift type
                if (shift === 'morning') {
                    day.style.borderLeft = '4px solid #059669'; // Green for morning
                } else if (shift === 'night') {
                    day.style.borderLeft = '4px solid #7c3aed'; // Purple for night
                } else {
                    day.style.borderLeft = '4px solid #3b82f6'; // Blue for day
                }
            }
        });
    }
    
    
    // Simulate real-time updates for salary information
    function updateSalaryInfo() {
        // This would typically fetch data from an API
        updateSchedule();
    }
    
    // Update schedule every hour
    updateSalaryInfo();
    setInterval(updateSalaryInfo, 3600000); // Update every hour
    
    // Add interactive features to news items
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a simple click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Simulate loading states
    function showLoadingState(section) {
        const content = document.querySelector(`#${section} .content-section`);
        if (content) {
            content.style.opacity = '0.5';
            content.style.pointerEvents = 'none';
        }
    }
    
    function hideLoadingState(section) {
        const content = document.querySelector(`#${section} .content-section`);
        if (content) {
            content.style.opacity = '1';
            content.style.pointerEvents = 'auto';
        }
    }
    
    // Simulate data loading when switching sections
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Show loading state
            showLoadingState(targetSection);
            
            // Simulate API call delay
            setTimeout(() => {
                hideLoadingState(targetSection);
            }, 500);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    document.querySelector('[data-section="schedule"]').click();
                    break;
                case '2':
                    document.querySelector('[data-section="salary"]').click();
                    break;
                case '3':
                    document.querySelector('[data-section="news"]').click();
                    break;
            }
        }
    });
    
    // Add notification system
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate some notifications on page load
    setTimeout(() => {
        showNotification('Добро пожаловать в личный кабинет Сода-Хлорат!', 'success');
    }, 1000);
    
    // Add search functionality for news
    window.addNewsSearch = function() {
        const newsSection = document.getElementById('news');
        const sectionHeader = newsSection.querySelector('.section-header');
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Поиск новостей...';
        searchInput.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.9rem;
            width: 200px;
        `;
        
        sectionHeader.appendChild(searchInput);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const newsItems = document.querySelectorAll('.news-item');
            
            newsItems.forEach(item => {
                const title = item.querySelector('.news-title').textContent.toLowerCase();
                const excerpt = item.querySelector('.news-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize news search
    addNewsSearch();
    
    // Add export functionality for salary
    window.addSalaryExport = function() {
        const salarySection = document.getElementById('salary');
        const sectionHeader = salarySection.querySelector('.section-header');
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-secondary';
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Экспорт';
        
        sectionHeader.appendChild(exportBtn);
        
        exportBtn.addEventListener('click', function() {
            showNotification('Функция экспорта будет доступна в следующем обновлении', 'info');
        });
    }
    
    // Initialize salary export
    addSalaryExport();
    
    // Add theme toggle (bonus feature)
    window.addThemeToggle = function() {
        const header = document.querySelector('.header');
        const themeBtn = document.createElement('button');
        themeBtn.className = 'btn btn-secondary';
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeBtn.style.marginLeft = '1rem';
        
        header.querySelector('.header-content').appendChild(themeBtn);
        
        let isDark = false;
        
        themeBtn.addEventListener('click', function() {
            isDark = !isDark;
            document.body.classList.toggle('dark-theme', isDark);
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
    
    // Initialize theme toggle
    addThemeToggle();
    
    // Employees functionality
    initializeEmployees();
    
    // Add dark theme styles
    const darkThemeStyle = document.createElement('style');
    darkThemeStyle.textContent = `
        .dark-theme {
            background-color: #0f172a;
            color: #f8fafc;
        }
        
        .dark-theme .container {
            background-color: #0f172a;
        }
        
        .dark-theme .nav {
            background-color: #1e293b;
            border-bottom-color: #334155;
        }
        
        .dark-theme .nav-item {
            color: #e2e8f0;
        }
        
        .dark-theme .nav-item:hover {
            background-color: #334155;
            color: #60a5fa;
        }
        
        .dark-theme .nav-item.active {
            color: #60a5fa;
            background-color: #1e3a8a;
        }
        
        .dark-theme .schedule-day,
        .dark-theme .salary-details,
        .dark-theme .salary-history,
        .dark-theme .news-item,
        .dark-theme .employee-card,
        .dark-theme .stat-card {
            background-color: #1e293b;
            border-color: #334155;
            color: #f1f5f9;
        }
        
        .dark-theme .breakdown-item {
            background-color: #334155;
            color: #f1f5f9;
        }
        
        .dark-theme .breakdown-item.total {
            background-color: #1e3a8a;
            color: #ffffff;
        }
        
        .dark-theme .modal-content {
            background-color: #1e293b;
            color: #f1f5f9;
        }
        
        .dark-theme .modal-body {
            background-color: #1e293b;
            color: #f1f5f9;
        }
        
        .dark-theme .modal-footer {
            background-color: #334155;
            color: #f1f5f9;
        }
        
        .dark-theme .section-title {
            color: #f1f5f9;
        }
        
        .dark-theme .section-subtitle {
            color: #cbd5e1;
        }
        
        .dark-theme .welcome-content h1 {
            color: #f1f5f9;
        }
        
        .dark-theme .welcome-content p {
            color: #cbd5e1;
        }
        
        .dark-theme .employee-name {
            color: #f1f5f9;
        }
        
        .dark-theme .employee-position {
            color: #cbd5e1;
        }
        
        .dark-theme .employee-department {
            color: #94a3b8;
        }
        
        .dark-theme .news-title {
            color: #f1f5f9;
        }
        
        .dark-theme .news-excerpt {
            color: #cbd5e1;
        }
        
        .dark-theme .news-date {
            color: #94a3b8;
        }
        
        .dark-theme .schedule-time {
            color: #f1f5f9;
        }
        
        .dark-theme .schedule-status {
            color: #cbd5e1;
        }
        
        .dark-theme .salary-amount {
            color: #f1f5f9;
        }
        
        .dark-theme .salary-label {
            color: #cbd5e1;
        }
        
        .dark-theme .breakdown-label {
            color: #f1f5f9;
        }
        
        .dark-theme .breakdown-value {
            color: #f1f5f9;
        }
        
        .dark-theme .stat-value {
            color: #f1f5f9;
        }
        
        .dark-theme .stat-label {
            color: #cbd5e1;
        }
        
        .dark-theme .form-group label {
            color: #f1f5f9;
        }
        
        .dark-theme .form-group input,
        .dark-theme .form-group select {
            background-color: #334155;
            border-color: #475569;
            color: #f1f5f9;
        }
        
        .dark-theme .form-group input:focus,
        .dark-theme .form-group select:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }
        
        .dark-theme .checkbox-label {
            color: #f1f5f9;
        }
        
        .dark-theme .btn {
            color: #f1f5f9;
        }
        
        .dark-theme .btn-primary {
            background-color: #1e3a8a;
            border-color: #1e3a8a;
        }
        
        .dark-theme .btn-primary:hover {
            background-color: #1e40af;
            border-color: #1e40af;
        }
        
        .dark-theme .btn-secondary {
            background-color: #334155;
            border-color: #475569;
        }
        
        .dark-theme .btn-secondary:hover {
            background-color: #475569;
            border-color: #64748b;
        }
        
        .dark-theme .header-content h1 {
            color: #f1f5f9;
        }
        
        .dark-theme .header-content p {
            color: #cbd5e1;
        }
        
        .dark-theme .auth-tab {
            color: #cbd5e1;
        }
        
        .dark-theme .auth-tab.active {
            color: #60a5fa;
        }
        
        .dark-theme .auth-tab:hover {
            color: #f1f5f9;
        }
    `;
    document.head.appendChild(darkThemeStyle);
});

// Add employee button
function setupAddEmployee() {
    const addBtn = document.getElementById('addEmployeeBtn');
    if (!addBtn) return;
    
    addBtn.addEventListener('click', function() {
        if (!hasAccess('manager')) {
            showNotification('У вас нет прав для добавления сотрудников', 'error');
            return;
        }
        
        // Показать форму добавления сотрудника
        showNotification('Функция добавления сотрудника будет доступна в следующем обновлении', 'info');
    });
}

// Employees Management Functions
function initializeEmployees() {
    // Получаем данные сотрудников из localStorage или внешнего файла
    let employees = [];
    
    // Try to get from localStorage first (includes registered users)
    const storedEmployees = localStorage.getItem('employeesDatabase');
    if (storedEmployees) {
        employees = JSON.parse(storedEmployees);
    } else if (typeof EMPLOYEES_DATABASE !== 'undefined') {
        employees = EMPLOYEES_DATABASE;
        // Save to localStorage for future use
        localStorage.setItem('employeesDatabase', JSON.stringify(employees));
    } else {
        // Fallback данные, если внешний файл не загружен
        employees = [
            {
                id: 1,
                name: "Иван Петров",
                position: "Инженер-химик",
                department: "production",
                departmentName: "Производство",
                email: "ivan.petrov@soda-chlorate.ru",
                phone: "+7 (495) 123-45-67",
                status: "working",
                statusName: "На работе",
                schedule: "Пн-Пт: 08:00 - 17:00",
                avatar: "ИП"
            }
        ];
        localStorage.setItem('employeesDatabase', JSON.stringify(employees));
    }
    
    let filteredEmployees = [...employees];
    
    // Render employees
    function renderEmployees(employeesToRender) {
        const grid = document.getElementById('employeesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        employeesToRender.forEach(employee => {
            const card = createEmployeeCard(employee);
            grid.appendChild(card);
        });
    }
    
    // Create employee card
    function createEmployeeCard(employee) {
        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
            <div class="employee-card-header">
                <div class="employee-avatar">${employee.avatar}</div>
                <div class="employee-basic-info">
                    <h4>${employee.name}</h4>
                    <p>${employee.position}</p>
                </div>
                <div class="employee-status-badge status-${employee.status}">
                    ${employee.statusName}
                </div>
            </div>
            <div class="employee-details">
                <div class="employee-detail">
                    <i class="fas fa-envelope"></i>
                    <span>${employee.email}</span>
                </div>
                <div class="employee-detail">
                    <i class="fas fa-phone"></i>
                    <span>${employee.phone}</span>
                </div>
                <div class="employee-detail">
                    <i class="fas fa-clock"></i>
                    <span>${employee.schedule}</span>
                </div>
                <div class="employee-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span class="shift-${employee.shift || 'day'}">${employee.shiftName || 'Смена не указана'}</span>
                </div>
                <div class="employee-department">${employee.departmentName}</div>
            </div>
        `;
        
        // Add click event to open modal
        card.addEventListener('click', () => openEmployeeModal(employee));
        
        return card;
    }
    
    // Open employee modal
    function openEmployeeModal(employee) {
        const modal = document.getElementById('employeeModal');
        const modalTitle = document.getElementById('modalTitle');
        const employeeName = document.getElementById('employeeName');
        const employeePosition = document.getElementById('employeePosition');
        const employeeDepartment = document.getElementById('employeeDepartment');
        const employeeEmail = document.getElementById('employeeEmail');
        const employeePhone = document.getElementById('employeePhone');
        const employeeStatus = document.getElementById('employeeStatus');
        
        modalTitle.textContent = 'Информация о сотруднике';
        employeeName.textContent = employee.name;
        employeePosition.textContent = employee.position;
        employeeDepartment.textContent = employee.departmentName;
        employeeEmail.textContent = employee.email;
        employeePhone.textContent = employee.phone;
        employeeStatus.textContent = employee.statusName;
        employeeStatus.className = `status-badge status-${employee.status}`;
        
        modal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        const modal = document.getElementById('employeeModal');
        modal.style.display = 'none';
    }
    
    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('employeeSearch');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filteredEmployees = employees.filter(employee => 
                employee.name.toLowerCase().includes(searchTerm) ||
                employee.position.toLowerCase().includes(searchTerm) ||
                employee.departmentName.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm)
            );
            renderEmployees(filteredEmployees);
        });
    }
    
    // Department filter
    function setupDepartmentFilter() {
        const departmentFilter = document.getElementById('departmentFilter');
        if (!departmentFilter) return;
        
        departmentFilter.addEventListener('change', function() {
            const selectedDepartment = this.value;
            if (selectedDepartment === '') {
                filteredEmployees = [...employees];
            } else {
                filteredEmployees = employees.filter(employee => 
                    employee.department === selectedDepartment
                );
            }
            renderEmployees(filteredEmployees);
        });
    }
    
    // Modal event listeners
    function setupModalEvents() {
        const modal = document.getElementById('employeeModal');
        const closeBtn = document.querySelector('.close');
        const editBtn = document.getElementById('editEmployeeBtn');
        const contactBtn = document.getElementById('contactEmployeeBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                showNotification('Функция редактирования будет доступна в следующем обновлении', 'info');
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                showNotification('Функция связи будет доступна в следующем обновлении', 'info');
            });
        }
    }
    
    
    // Update statistics
    function updateStatistics() {
        const totalEmployees = employees.length;
        const workingEmployees = employees.filter(emp => emp.status === 'working').length;
        const vacationEmployees = employees.filter(emp => emp.status === 'vacation').length;
        const sickEmployees = employees.filter(emp => emp.status === 'sick').length;
        
        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.stat-card .stat-number');
        if (statCards.length >= 4) {
            statCards[0].textContent = totalEmployees;
            statCards[1].textContent = workingEmployees;
            statCards[2].textContent = vacationEmployees;
            statCards[3].textContent = sickEmployees;
        }
    }
    
    // Initialize all functionality
    renderEmployees(filteredEmployees);
    setupSearch();
    setupDepartmentFilter();
    setupModalEvents();
    setupAddEmployee();
    updateStatistics();
    
    // Add keyboard shortcut for employees section
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === '4') {
            document.querySelector('[data-section="employees"]').click();
        }
    });
}

// Authentication System
function initializeAuth() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        showMainApp(currentUser);
    } else {
        showWelcomeScreen();
    }
    
    // Setup authentication event listeners
    setupAuthEventListeners();
}

function showWelcomeScreen() {
    // Hide main container
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // Create welcome screen
    const welcomeScreen = document.createElement('div');
    welcomeScreen.className = 'welcome-screen';
    welcomeScreen.innerHTML = `
        <div class="welcome-content">
            <h1><i class="fas fa-flask"></i> Сода-Хлорат</h1>
            <p>Добро пожаловать в личный кабинет сотрудника</p>
            <p>Войдите в систему для доступа к персональной информации</p>
            <div class="welcome-buttons">
                <button class="welcome-btn primary" id="showLoginBtn">
                    <i class="fas fa-sign-in-alt"></i>
                    Войти в систему
                </button>
                <button class="welcome-btn" id="showRegisterBtn">
                    <i class="fas fa-user-plus"></i>
                    Регистрация сотрудника
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(welcomeScreen);
    
    // Add event listeners
    document.getElementById('showLoginBtn').addEventListener('click', () => showAuthModal('login'));
    document.getElementById('showRegisterBtn').addEventListener('click', () => showAuthModal('register'));
}

function showMainApp(user) {
    // Remove welcome screen if exists
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.remove();
    }
    
    // Show main container
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.style.display = 'block';
    }
    
    // Update user info
    updateUserInfo(user);
    
    // Initialize other systems
    initializeEmployees();
    updatePersonalSalary();
    initializeCalculator();
    
    // Update UI based on access level
    updateUIForAccessLevel();
}

function updateUserInfo(user) {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userName) {
        userName.textContent = user.name;
    }
    
    if (userAvatar) {
        userAvatar.innerHTML = `<i class="fas fa-user"></i>`;
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }
}

function setupAuthEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    
    // Close modal
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Login nav item
    const loginNavItem = document.getElementById('loginNavItem');
    if (loginNavItem) {
        loginNavItem.addEventListener('click', () => showAuthModal('login'));
    }
}

function showAuthModal(tab) {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'block';
        switchAuthTab(tab);
    }
}

function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'none';
    }
}


function handleLogin(e) {
    e.preventDefault();
    
    const employeeNumber = document.getElementById('loginEmployeeNumber').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!employeeNumber || !password) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Check if user exists in employees database
    const employees = getEmployeesData();
    const user = employees.find(emp => emp.employeeNumber === employeeNumber);
    
    if (!user) {
        showNotification('Сотрудник с таким табельным номером не найден', 'error');
        return;
    }
    
    // Check password from database
    if (password !== user.password) {
        showNotification('Неверный пароль', 'error');
        return;
    }
    
    // Login successful
    const userData = {
        id: user.id,
        employeeNumber: user.employeeNumber,
        name: user.name,
        email: user.email,
        position: user.position,
        department: user.department,
        departmentName: user.departmentName,
        avatar: user.avatar,
        accessLevel: user.accessLevel,
        accessLevelName: user.accessLevelName
    };
    
    // Save user session
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showNotification('Добро пожаловать, ' + user.name + '!', 'success');
    hideAuthModal();
    showMainApp(userData);
}


function handleLogout() {
    localStorage.removeItem('currentUser');
    showNotification('Вы вышли из системы', 'info');
    showWelcomeScreen();
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function hasAccess(requiredLevel) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const accessLevels = {
        'employee': 1,
        'manager': 2,
        'accountant': 3,
        'admin': 4
    };
    
    const userLevel = accessLevels[currentUser.accessLevel] || 0;
    const required = accessLevels[requiredLevel] || 0;
    
    return userLevel >= required;
}

function updateUIForAccessLevel() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Показать/скрыть кнопку добавления сотрудников
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    if (addEmployeeBtn) {
        if (hasAccess('manager')) {
            addEmployeeBtn.style.display = 'inline-block';
        } else {
            addEmployeeBtn.style.display = 'none';
        }
    }
    
    // Показать/скрыть калькулятор для бухгалтеров
    const calculatorNav = document.getElementById('calculatorNav');
    if (calculatorNav) {
        if (hasAccess('accountant')) {
            calculatorNav.style.display = 'flex';
        } else {
            calculatorNav.style.display = 'none';
        }
    }
    
    // Показать уровень доступа в интерфейсе
    const userInfo = document.querySelector('.user-info');
    if (userInfo && currentUser.accessLevelName) {
        // Удаляем старый бейдж, если есть
        const oldBadge = userInfo.querySelector('.access-level');
        if (oldBadge) {
            oldBadge.remove();
        }
        
        const accessLevelSpan = document.createElement('span');
        accessLevelSpan.className = 'access-level';
        accessLevelSpan.textContent = currentUser.accessLevelName;
        accessLevelSpan.style.cssText = `
            background: ${currentUser.accessLevel === 'admin' ? '#dc2626' : 
                        currentUser.accessLevel === 'manager' ? '#059669' : 
                        currentUser.accessLevel === 'accountant' ? '#7c3aed' : '#6b7280'};
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            margin-left: 8px;
        `;
        userInfo.appendChild(accessLevelSpan);
    }
}

// Функции калькулятора зарплаты
function initializeCalculator() {
    const calculatorForm = document.getElementById('salaryCalculatorForm');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', handleSalaryCalculation);
    }
    
    const exportBtn = document.getElementById('exportCalculation');
    const printBtn = document.getElementById('printCalculation');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCalculation);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printCalculation);
    }
}

function handleSalaryCalculation(e) {
    e.preventDefault();
    
    const formData = {
        employeeName: document.getElementById('calcEmployeeName').value,
        position: document.getElementById('calcPosition').value,
        baseSalary: parseFloat(document.getElementById('calcBaseSalary').value) || 0,
        shift: document.getElementById('calcShift').value,
        hazardPay: parseFloat(document.getElementById('calcHazardPay').value) || 0,
        overtime: parseFloat(document.getElementById('calcOvertime').value) || 0,
        holidayWork: parseFloat(document.getElementById('calcHolidayWork').value) || 0,
        bonusPercent: parseFloat(document.getElementById('calcBonusPercent').value) || 47
    };
    
    if (!formData.employeeName || !formData.position || !formData.baseSalary || !formData.shift) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const calculation = calculateSalaryForCalculator(formData);
    displayCalculationResults(calculation);
}

function calculateSalaryForCalculator(data) {
    const baseSalary = data.baseSalary;
    const baseHourly = baseSalary / 160; // Стоимость часа
    
    // Премия
    const bonus = Math.round(baseSalary * (data.bonusPercent / 100));
    
    // Надбавка за смену
    let shiftPay = 0;
    if (data.shift === 'night') {
        shiftPay = Math.round(baseSalary * 0.4); // +40% за ночную смену
    }
    
    // Переработки
    const overtimePay = Math.round(data.overtime * baseHourly * 0.5); // +50% за переработки
    
    // Праздничные дни
    const holidayPay = Math.round(data.holidayWork * baseHourly * 1.0); // +100% за праздники
    
    // Вредность
    const hazardPay = data.hazardPay;
    
    const total = baseSalary + bonus + shiftPay + hazardPay + overtimePay + holidayPay;
    
    return {
        employeeName: data.employeeName,
        position: data.position,
        baseSalary: baseSalary,
        bonus: bonus,
        shiftPay: shiftPay,
        hazardPay: hazardPay,
        overtimePay: overtimePay,
        holidayPay: holidayPay,
        total: total,
        shift: data.shift
    };
}

function displayCalculationResults(calculation) {
    document.getElementById('resultBaseSalary').textContent = `${calculation.baseSalary.toLocaleString()} ₽`;
    document.getElementById('resultBonus').textContent = `${calculation.bonus.toLocaleString()} ₽`;
    document.getElementById('resultShiftPay').textContent = `${calculation.shiftPay.toLocaleString()} ₽`;
    document.getElementById('resultHazardPay').textContent = `${calculation.hazardPay.toLocaleString()} ₽`;
    document.getElementById('resultOvertime').textContent = `${calculation.overtimePay.toLocaleString()} ₽`;
    document.getElementById('resultHolidayWork').textContent = `${calculation.holidayPay.toLocaleString()} ₽`;
    document.getElementById('resultTotal').textContent = `${calculation.total.toLocaleString()} ₽`;
    
    // Сохраняем расчет для экспорта
    window.lastCalculation = calculation;
}

function exportCalculation() {
    if (!window.lastCalculation) {
        showNotification('Сначала выполните расчет зарплаты', 'error');
        return;
    }
    
    const calculation = window.lastCalculation;
    const exportData = {
        'ФИО сотрудника': calculation.employeeName,
        'Должность': calculation.position,
        'Оклад': `${calculation.baseSalary.toLocaleString()} ₽`,
        'Премия': `${calculation.bonus.toLocaleString()} ₽`,
        'Надбавка за смену': `${calculation.shiftPay.toLocaleString()} ₽`,
        'Вредность': `${calculation.hazardPay.toLocaleString()} ₽`,
        'Переработки': `${calculation.overtimePay.toLocaleString()} ₽`,
        'Праздничные дни': `${calculation.holidayPay.toLocaleString()} ₽`,
        'ИТОГО': `${calculation.total.toLocaleString()} ₽`,
        'Дата расчета': new Date().toLocaleDateString('ru-RU')
    };
    
    const csvContent = Object.entries(exportData)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `расчет_зарплаты_${calculation.employeeName.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Расчет экспортирован в CSV файл', 'success');
}

function printCalculation() {
    if (!window.lastCalculation) {
        showNotification('Сначала выполните расчет зарплаты', 'error');
        return;
    }
    
    const calculation = window.lastCalculation;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Расчет зарплаты - ${calculation.employeeName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #1e40af; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { font-weight: bold; background-color: #e6f3ff; }
            </style>
        </head>
        <body>
            <h1>Расчет заработной платы</h1>
            <p><strong>Сотрудник:</strong> ${calculation.employeeName}</p>
            <p><strong>Должность:</strong> ${calculation.position}</p>
            <p><strong>Дата расчета:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
            
            <table>
                <tr>
                    <th>Компонент</th>
                    <th>Сумма</th>
                </tr>
                <tr>
                    <td>Оклад</td>
                    <td>${calculation.baseSalary.toLocaleString()} ₽</td>
                </tr>
                <tr>
                    <td>Премия</td>
                    <td>${calculation.bonus.toLocaleString()} ₽</td>
                </tr>
                <tr>
                    <td>Надбавка за смену</td>
                    <td>${calculation.shiftPay.toLocaleString()} ₽</td>
                </tr>
                <tr>
                    <td>Вредность</td>
                    <td>${calculation.hazardPay.toLocaleString()} ₽</td>
                </tr>
                <tr>
                    <td>Переработки</td>
                    <td>${calculation.overtimePay.toLocaleString()} ₽</td>
                </tr>
                <tr>
                    <td>Праздничные дни</td>
                    <td>${calculation.holidayPay.toLocaleString()} ₽</td>
                </tr>
                <tr class="total">
                    <td><strong>ИТОГО</strong></td>
                    <td><strong>${calculation.total.toLocaleString()} ₽</strong></td>
                </tr>
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Функция для автоматического добавления сотрудников
function addEmployeeAutomatically(employeeData) {
    try {
        // Валидация обязательных полей
        const requiredFields = ['name', 'email', 'position', 'department', 'shift', 'accessLevel'];
        for (const field of requiredFields) {
            if (!employeeData[field]) {
                throw new Error(`Отсутствует обязательное поле: ${field}`);
            }
        }
        
        // Получаем текущую базу данных
        const employees = getEmployeesData();
        
        // Проверяем уникальность email
        const existingEmployee = employees.find(emp => emp.email === employeeData.email);
        if (existingEmployee) {
            throw new Error(`Сотрудник с email ${employeeData.email} уже существует`);
        }
        
        // Получаем данные смены
        const shiftData = getShiftData(employeeData.shift);
        
        // Создаем нового сотрудника
        const newEmployee = {
            id: employees.length + 1,
            name: employeeData.name,
            position: employeeData.position,
            department: employeeData.department,
            departmentName: getDepartmentName(employeeData.department),
            shift: employeeData.shift,
            shiftName: shiftData.name,
            email: employeeData.email,
            phone: employeeData.phone || '+7 (495) 000-00-00',
            status: employeeData.status || 'working',
            statusName: employeeData.statusName || 'На работе',
            schedule: shiftData.time,
            avatar: employeeData.name.split(' ').map(n => n[0]).join(''),
            hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
            accessLevel: employeeData.accessLevel,
            accessLevelName: employeeData.accessLevel === 'admin' ? 'Администратор' : 
                           employeeData.accessLevel === 'manager' ? 'Менеджер' : 'Сотрудник',
            salary: {
                baseSalary: employeeData.salary?.baseSalary || 50000, // Индивидуальный оклад
                bonusPercent: employeeData.salary?.bonusPercent || 47, // 47% премия (стандарт)
                hazardPay: employeeData.salary?.hazardPay || 0, // Фиксированная надбавка за вредность
                bonus: 0, // Рассчитывается автоматически (47% от оклада)
                nightShift: 0, // Рассчитывается автоматически (+40% за ночную смену)
                overtime: 0, // Рассчитывается автоматически
                holidayWork: 0, // Рассчитывается автоматически (+100% за праздники)
                total: 0 // Рассчитывается автоматически
            },
            workHours: {
                regular: 160,
                night: 0,
                overtime: 0,
                holiday: 0
            }
        };
        
        // Добавляем в базу данных
        const newEmployees = [...employees, newEmployee];
        localStorage.setItem('employeesDatabase', JSON.stringify(newEmployees));
        
        // Обновляем отображение, если мы на странице сотрудников
        if (typeof initializeEmployees === 'function') {
            initializeEmployees();
        }
        
        return {
            success: true,
            message: `Сотрудник ${newEmployee.name} успешно добавлен`,
            employee: newEmployee
        };
        
    } catch (error) {
        return {
            success: false,
            message: `Ошибка при добавлении сотрудника: ${error.message}`,
            employee: null
        };
    }
}

function getDepartmentName(departmentCode) {
    const departments = {
        'production': 'Производство',
        'laboratory': 'Лаборатория',
        'quality': 'Контроль качества',
        'safety': 'Безопасность',
        'management': 'Управление'
    };
    return departments[departmentCode] || 'Неизвестный отдел';
}

// Personal Salary Management
function updatePersonalSalary() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get employee data
    const employees = getEmployeesData();
    const employee = employees.find(emp => emp.id === currentUser.id);
    
    if (!employee || !employee.salary) {
        console.log('Employee salary data not found');
        return;
    }
    
    // Update salary overview
    updateSalaryOverview(employee);
    
    // Update salary breakdown
    updateSalaryBreakdown(employee);
    
    // Update work hours
    updateWorkHours(employee);
    
    // Update salary history
    updateSalaryHistory(employee);
}

function getEmployeesData() {
    const storedEmployees = localStorage.getItem('employeesDatabase');
    if (storedEmployees) {
        return JSON.parse(storedEmployees);
    } else if (typeof EMPLOYEES_DATABASE !== 'undefined') {
        return EMPLOYEES_DATABASE;
    }
    return [];
}

function updateSalaryOverview(employee) {
    const totalSalary = document.getElementById('totalSalary');
    const totalHours = document.getElementById('totalHours');
    const bonusAmount = document.getElementById('bonusAmount');
    const allowanceAmount = document.getElementById('allowanceAmount');
    
    if (totalSalary) {
        totalSalary.textContent = formatCurrency(employee.salary.total);
    }
    
    if (totalHours) {
        const totalWorkHours = employee.workHours.regular + employee.workHours.night + 
                              employee.workHours.overtime + employee.workHours.holiday;
        totalHours.textContent = totalWorkHours + ' ч';
    }
    
    if (bonusAmount) {
        bonusAmount.textContent = formatCurrency(employee.salary.bonus);
    }
    
    if (allowanceAmount) {
        const totalAllowances = employee.salary.nightShift + employee.salary.hazardPay + 
                               employee.salary.overtime + employee.salary.holidayWork;
        allowanceAmount.textContent = formatCurrency(totalAllowances);
    }
}

function updateSalaryBreakdown(employee) {
    const baseSalary = document.getElementById('baseSalary');
    const bonus = document.getElementById('bonus');
    const nightShift = document.getElementById('nightShift');
    const hazardPay = document.getElementById('hazardPay');
    const overtime = document.getElementById('overtime');
    const holidayWork = document.getElementById('holidayWork');
    const totalSalaryBreakdown = document.getElementById('totalSalaryBreakdown');
    
    if (baseSalary) baseSalary.textContent = formatCurrency(employee.salary.baseSalary);
    if (bonus) bonus.textContent = formatCurrency(employee.salary.bonus);
    if (nightShift) nightShift.textContent = formatCurrency(employee.salary.nightShift);
    if (hazardPay) hazardPay.textContent = formatCurrency(employee.salary.hazardPay);
    if (overtime) overtime.textContent = formatCurrency(employee.salary.overtime);
    if (holidayWork) holidayWork.textContent = formatCurrency(employee.salary.holidayWork);
    if (totalSalaryBreakdown) totalSalaryBreakdown.textContent = formatCurrency(employee.salary.total);
}

function updateWorkHours(employee) {
    const regularHours = document.getElementById('regularHours');
    const nightHours = document.getElementById('nightHours');
    const overtimeHours = document.getElementById('overtimeHours');
    const holidayHours = document.getElementById('holidayHours');
    
    if (regularHours) regularHours.textContent = employee.workHours.regular + ' ч';
    if (nightHours) nightHours.textContent = employee.workHours.night + ' ч';
    if (overtimeHours) overtimeHours.textContent = employee.workHours.overtime + ' ч';
    if (holidayHours) holidayHours.textContent = employee.workHours.holiday + ' ч';
}

function updateSalaryHistory(employee) {
    // Generate historical data based on current salary with some variation
    const decSalary = document.getElementById('decSalary');
    const novSalary = document.getElementById('novSalary');
    const octSalary = document.getElementById('octSalary');
    
    if (decSalary) {
        const decAmount = employee.salary.total + Math.floor(Math.random() * 5000) - 2500;
        decSalary.textContent = formatCurrency(Math.max(decAmount, employee.salary.baseSalary));
    }
    
    if (novSalary) {
        const novAmount = employee.salary.total + Math.floor(Math.random() * 3000) - 1500;
        novSalary.textContent = formatCurrency(Math.max(novAmount, employee.salary.baseSalary));
    }
    
    if (octSalary) {
        const octAmount = employee.salary.total + Math.floor(Math.random() * 4000) - 2000;
        octSalary.textContent = formatCurrency(Math.max(octAmount, employee.salary.baseSalary));
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('₽', '₽');
}

// Calculate salary components based on work hours and rates
function calculateSalaryComponents(employee) {
    // Получаем индивидуальные настройки зарплаты
    const salaryConfig = employee.salary || {};
    const baseSalary = salaryConfig.baseSalary || 50000;
    
    // Стандартные коэффициенты согласно требованиям
    const bonusPercent = salaryConfig.bonusPercent || 47; // 47% премия по умолчанию
    const nightMultiplier = 1.4; // +40% за ночную смену
    const holidayMultiplier = 2.0; // +100% за праздничные дни
    const overtimeMultiplier = 1.5; // +50% за переработки (стандартно)
    
    const baseHourly = baseSalary / 160; // Базовая почасовая ставка (оклад / 160 часов)
    
    // Рассчитываем премию (47% от оклада)
    const bonus = Math.round(baseSalary * (bonusPercent / 100));
    
    // Рассчитываем надбавки за смены
    let shiftAdjustment = 0;
    if (employee.shift === 'night') {
        // Ночная смена: +40% к стоимости часа за все рабочие часы
        shiftAdjustment = Math.round(employee.workHours.regular * baseHourly * 0.4);
    }
    // Утренняя и дневная смены без надбавок
    
    // Рассчитываем остальные компоненты
    const nightShift = shiftAdjustment; // Надбавка за ночную смену
    const hazardPay = salaryConfig.hazardPay || 0; // Фиксированная надбавка за вредность
    const overtime = Math.round(employee.workHours.overtime * baseHourly * (overtimeMultiplier - 1));
    const holidayWork = Math.round(employee.workHours.holiday * baseHourly * (holidayMultiplier - 1));
    
    const calculated = {
        baseSalary: baseSalary,
        bonus: bonus,
        nightShift: nightShift,
        hazardPay: hazardPay,
        overtime: overtime,
        holidayWork: holidayWork
    };
    
    calculated.total = calculated.baseSalary + calculated.bonus + calculated.nightShift + 
                      calculated.hazardPay + calculated.overtime + calculated.holidayWork;
    
    return calculated;
}

// Update salary when switching to salary section
// Add event listener for salary section
const salaryNavItem = document.querySelector('[data-section="salary"]');
if (salaryNavItem) {
    salaryNavItem.addEventListener('click', function() {
        setTimeout(() => {
            updatePersonalSalary();
        }, 100);
    });
}