// Employee Portal JavaScript
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
    
    // Get shift data by shift code
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
    function showNotification(message, type = 'info') {
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
        showNotification('Добро пожаловать в личный кабинет Soda-Chlorate!', 'success');
    }, 1000);
    
    // Add search functionality for news
    function addNewsSearch() {
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
    function addSalaryExport() {
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
    function addThemeToggle() {
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
            background-color: #1f2937;
            color: #f9fafb;
        }
        
        .dark-theme .container {
            background-color: #111827;
        }
        
        .dark-theme .nav {
            background-color: #1f2937;
            border-bottom-color: #374151;
        }
        
        .dark-theme .nav-item {
            color: #d1d5db;
        }
        
        .dark-theme .nav-item:hover {
            background-color: #374151;
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
            background-color: #1f2937;
            border-color: #374151;
        }
        
        .dark-theme .breakdown-item {
            background-color: #374151;
        }
        
        .dark-theme .breakdown-item.total {
            background-color: #1e3a8a;
        }
        
        .dark-theme .modal-content {
            background-color: #1f2937;
        }
        
        .dark-theme .modal-body {
            background-color: #1f2937;
        }
        
        .dark-theme .modal-footer {
            background-color: #374151;
        }
    `;
    document.head.appendChild(darkThemeStyle);
});

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
    
    // Add employee button
    function setupAddEmployee() {
        const addBtn = document.getElementById('addEmployeeBtn');
        if (!addBtn) return;
        
        addBtn.addEventListener('click', function() {
            showNotification('Функция добавления сотрудника будет доступна в следующем обновлении', 'info');
        });
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
            <h1><i class="fas fa-flask"></i> Soda-Chlorate</h1>
            <p>Добро пожаловать в личный кабинет сотрудника</p>
            <p>Войдите в систему или зарегистрируйтесь для доступа к персональной информации</p>
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
    // Auth modal tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        console.log('Форма регистрации найдена, добавляем обработчик');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.error('Форма регистрации не найдена!');
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

function switchAuthTab(tabName) {
    // Update tabs
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update forms
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.classList.remove('active');
        if (form.id === tabName + 'Form') {
            form.classList.add('active');
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Check if user exists in employees database
    const employees = typeof EMPLOYEES_DATABASE !== 'undefined' ? EMPLOYEES_DATABASE : [];
    const user = employees.find(emp => emp.email === email);
    
    if (!user) {
        showNotification('Пользователь с таким email не найден', 'error');
        return;
    }
    
    // Simple password check (in real app, this would be hashed)
    if (password !== 'password123') { // Default password for demo
        showNotification('Неверный пароль', 'error');
        return;
    }
    
    // Login successful
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        department: user.department,
        departmentName: user.departmentName,
        avatar: user.avatar
    };
    
    // Save user session
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showNotification('Добро пожаловать, ' + user.name + '!', 'success');
    hideAuthModal();
    showMainApp(userData);
}

function handleRegister(e) {
    e.preventDefault();
    
    console.log('Начало регистрации...');
    
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const position = document.getElementById('regPosition').value;
    const department = document.getElementById('regDepartment').value;
    const shift = document.getElementById('regShift').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const agreement = document.getElementById('regAgreement').checked;
    
    console.log('Данные формы:', { firstName, lastName, email, position, department, phone, agreement });
    
    // Check if all form elements exist
    const requiredFields = ['regFirstName', 'regLastName', 'regEmail', 'regPosition', 'regDepartment', 'regPhone', 'regPassword', 'regConfirmPassword'];
    const missingFields = requiredFields.filter(fieldId => !document.getElementById(fieldId));
    
    if (missingFields.length > 0) {
        console.error('Отсутствуют поля формы:', missingFields);
        showNotification('Ошибка формы. Обновите страницу и попробуйте снова.', 'error');
        return;
    }
    
    // Validation
    if (!firstName || !lastName || !email || !position || !department || !shift || !phone || !password || !confirmPassword) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    
    if (!agreement) {
        showNotification('Необходимо согласиться с политикой конфиденциальности', 'error');
        return;
    }
    
    if (!email.includes('@soda-chlorate.ru')) {
        showNotification('Используйте корпоративный email (@soda-chlorate.ru)', 'error');
        return;
    }
    
    // Check if user already exists
    const employees = getEmployeesData();
    const existingUser = employees.find(emp => emp.email === email);
    
    if (existingUser) {
        showNotification('Пользователь с таким email уже зарегистрирован', 'error');
        return;
    }
    
    // Create new user with salary structure
    const shiftData = getShiftData(shift);
    const newUser = {
        id: employees.length + 1,
        name: firstName + ' ' + lastName,
        position: position,
        department: department,
        departmentName: getDepartmentName(department),
        shift: shift,
        shiftName: shiftData.name,
        email: email,
        phone: phone,
        status: 'working',
        statusName: 'На работе',
        schedule: shiftData.time,
        avatar: firstName.charAt(0) + lastName.charAt(0),
        hireDate: new Date().toISOString().split('T')[0],
        salary: {
            baseSalary: 50000,
            bonus: 0,
            nightShift: 0,
            hazardPay: 0,
            overtime: 0,
            holidayWork: 0,
            total: 50000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 0,
            holiday: 0
        }
    };
    
    // In a real app, this would be saved to a database
    // For demo purposes, we'll save to localStorage
    try {
        const newEmployees = [...employees, newUser];
        localStorage.setItem('employeesDatabase', JSON.stringify(newEmployees));
        console.log('Сотрудник сохранен в localStorage:', newUser);
        
        showNotification('Регистрация успешна! Добро пожаловать в команду!', 'success');
        hideAuthModal();
        
        // Auto-login after registration
        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            position: newUser.position,
            department: newUser.department,
            departmentName: newUser.departmentName,
            avatar: newUser.avatar
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('Пользователь авторизован:', userData);
        showMainApp(userData);
    } catch (error) {
        console.error('Ошибка при сохранении сотрудника:', error);
        showNotification('Ошибка при сохранении данных. Попробуйте еще раз.', 'error');
    }
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
    const rates = {
        baseHourly: employee.salary.baseSalary / 160, // Base hourly rate
        nightMultiplier: 1.2, // 20% extra for night work
        hazardMultiplier: 1.15, // 15% extra for hazardous work
        overtimeMultiplier: 1.5, // 50% extra for overtime
        holidayMultiplier: 2.0 // 100% extra for holiday work
    };
    
    // Calculate shift-specific adjustments
    let shiftAdjustment = 0;
    if (employee.shift === 'night') {
        // Night shift gets 20% extra for all regular hours
        shiftAdjustment = Math.round(employee.workHours.regular * rates.baseHourly * 0.2);
    } else if (employee.shift === 'morning') {
        // Morning shift gets 10% extra for all regular hours
        shiftAdjustment = Math.round(employee.workHours.regular * rates.baseHourly * 0.1);
    }
    
    const calculated = {
        baseSalary: employee.salary.baseSalary,
        bonus: employee.salary.bonus,
        nightShift: Math.round(employee.workHours.night * rates.baseHourly * (rates.nightMultiplier - 1)) + shiftAdjustment,
        hazardPay: Math.round(employee.workHours.regular * rates.baseHourly * (rates.hazardMultiplier - 1)),
        overtime: Math.round(employee.workHours.overtime * rates.baseHourly * (rates.overtimeMultiplier - 1)),
        holidayWork: Math.round(employee.workHours.holiday * rates.baseHourly * (rates.holidayMultiplier - 1))
    };
    
    calculated.total = calculated.baseSalary + calculated.bonus + calculated.nightShift + 
                      calculated.hazardPay + calculated.overtime + calculated.holidayWork;
    
    return calculated;
}

// Update salary when switching to salary section
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for salary section
    const salaryNavItem = document.querySelector('[data-section="salary"]');
    if (salaryNavItem) {
        salaryNavItem.addEventListener('click', function() {
            setTimeout(() => {
                updatePersonalSalary();
            }, 100);
        });
    }
});