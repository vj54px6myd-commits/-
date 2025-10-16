// Employee Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Simulate real-time updates for salary information
    function updateSalaryInfo() {
        // This would typically fetch data from an API
        const currentTime = new Date();
        const hours = currentTime.getHours();
        
        // Simulate different shift times based on current time
        const scheduleDays = document.querySelectorAll('.schedule-day:not(.weekend)');
        
        scheduleDays.forEach((day, index) => {
            const shiftInfo = day.querySelector('.shift-info');
            const shiftTime = shiftInfo.querySelector('.shift-time');
            const shiftType = shiftInfo.querySelector('.shift-type');
            
            if (index < 5) { // Monday to Friday
                if (hours >= 6 && hours < 14) {
                    shiftTime.textContent = '08:00 - 17:00';
                    shiftType.textContent = 'Дневная смена';
                    day.style.borderLeft = '4px solid #059669';
                } else if (hours >= 14 && hours < 22) {
                    shiftTime.textContent = '14:00 - 23:00';
                    shiftType.textContent = 'Вечерняя смена';
                    day.style.borderLeft = '4px solid #dc2626';
                } else {
                    shiftTime.textContent = '22:00 - 07:00';
                    shiftType.textContent = 'Ночная смена';
                    day.style.borderLeft = '4px solid #7c3aed';
                }
            }
        });
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
        .dark-theme .news-item {
            background-color: #1f2937;
            border-color: #374151;
        }
        
        .dark-theme .breakdown-item {
            background-color: #374151;
        }
        
        .dark-theme .breakdown-item.total {
            background-color: #1e3a8a;
        }
    `;
    document.head.appendChild(darkThemeStyle);
});