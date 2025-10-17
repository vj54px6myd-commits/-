// Employees Management Module for Soda-Chlorate Employee Portal

class EmployeesManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentSearch = '';
        this.currentDepartment = '';
        this.currentSort = { field: 'name', direction: 'asc' };
        this.employees = [];
        this.totalEmployees = 0;
        this.totalPages = 0;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Поиск
        const searchInput = document.getElementById('employeeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentSearch = searchInput.value;
                this.currentPage = 1;
                this.loadEmployees();
            }, 500));
        }

        // Фильтр по отделам
        const departmentFilter = document.getElementById('departmentFilter');
        if (departmentFilter) {
            departmentFilter.addEventListener('change', () => {
                this.currentDepartment = departmentFilter.value;
                this.currentPage = 1;
                this.loadEmployees();
            });
        }

        // Кнопка добавления сотрудника
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        if (addEmployeeBtn) {
            addEmployeeBtn.addEventListener('click', () => {
                this.showEmployeeForm();
            });
        }

        // Кнопки пагинации
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadEmployees();
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.loadEmployees();
                }
            });
        }

        // Кнопка обновления
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadEmployees();
            });
        }

        // Кнопка экспорта
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportEmployees();
            });
        }

        // Сортировка
        this.setupSorting();

        // Модальные окна
        this.setupModals();
    }

    setupSorting() {
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-sort');
                this.sortEmployees(field);
            });
        });
    }

    setupModals() {
        // Закрытие модальных окон
        const closeModalBtns = document.querySelectorAll('.modal-close');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Закрытие по клику вне модального окна
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Форма сотрудника
        const employeeForm = document.getElementById('employeeForm');
        if (employeeForm) {
            employeeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEmployee();
            });
        }
    }

    async loadEmployees() {
        try {
            this.showLoading(true);
            
            const data = await window.dataManager.loadEmployees(
                this.currentPage,
                this.itemsPerPage,
                this.currentSearch,
                this.currentDepartment
            );

            this.employees = data.employees || [];
            this.totalEmployees = data.total || 0;
            this.totalPages = Math.ceil(this.totalEmployees / this.itemsPerPage);

            this.renderEmployeesTable();
            this.updatePagination();
            this.updateStats();

        } catch (error) {
            console.error('Ошибка загрузки сотрудников:', error);
            window.dataManager.handleError(error, 'loadEmployees');
        } finally {
            this.showLoading(false);
        }
    }

    async loadStats() {
        try {
            const stats = await window.dataManager.loadEmployeesStats();
            this.updateStatsDisplay(stats);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        }
    }

    renderEmployeesTable() {
        const tbody = document.getElementById('employeesTableBody');
        if (!tbody) return;

        if (this.employees.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div style="padding: 2rem; color: #666;">
                            <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <div>Сотрудники не найдены</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.employees.map(employee => `
            <tr>
                <td>
                    <div class="employee-info">
                        <div class="employee-avatar">
                            ${this.getInitials(employee.name, employee.surname)}
                        </div>
                        <div>
                            <div class="employee-name">${employee.name} ${employee.surname}</div>
                            <div class="employee-position">${employee.position}</div>
                        </div>
                    </div>
                </td>
                <td>${employee.position}</td>
                <td>${this.getDepartmentName(employee.department)}</td>
                <td>${employee.email}</td>
                <td>${employee.phone || '-'}</td>
                <td>${this.formatDate(employee.hire_date)}</td>
                <td>
                    <span class="status-badge status-${employee.status || 'active'}">
                        ${this.getStatusText(employee.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn-small" onclick="employeesManager.viewEmployee(${employee.id})" title="Просмотр">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn-small" onclick="employeesManager.editEmployee(${employee.id})" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-small" onclick="employeesManager.deleteEmployee(${employee.id})" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updatePagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationInfo = document.getElementById('paginationInfo');
        const paginationPages = document.getElementById('paginationPages');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }

        if (paginationInfo) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.totalEmployees);
            paginationInfo.textContent = `Показано ${start}-${end} из ${this.totalEmployees}`;
        }

        if (paginationPages) {
            this.renderPaginationPages(paginationPages);
        }
    }

    renderPaginationPages(container) {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="employeesManager.goToPage(${i})">
                    ${i}
                </button>
            `);
        }

        container.innerHTML = pages.join('');
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadEmployees();
    }

    sortEmployees(field) {
        if (this.currentSort.field === field) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = 'asc';
        }

        this.employees.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.currentSort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        this.renderEmployeesTable();
        this.updateSortIndicators();
    }

    updateSortIndicators() {
        const headers = document.querySelectorAll('.sortable');
        headers.forEach(header => {
            const field = header.getAttribute('data-sort');
            const icon = header.querySelector('i');
            
            header.classList.remove('sorted');
            if (icon) {
                icon.className = 'fas fa-sort';
            }

            if (field === this.currentSort.field) {
                header.classList.add('sorted');
                if (icon) {
                    icon.className = this.currentSort.direction === 'asc' 
                        ? 'fas fa-sort-up' 
                        : 'fas fa-sort-down';
                }
            }
        });
    }

    updateStats() {
        const totalEmployeesEl = document.getElementById('totalEmployees');
        const activeEmployeesEl = document.getElementById('activeEmployees');
        const departmentsCountEl = document.getElementById('departmentsCount');

        if (totalEmployeesEl) {
            totalEmployeesEl.textContent = this.totalEmployees;
        }

        if (activeEmployeesEl) {
            const activeCount = this.employees.filter(emp => emp.status === 'active').length;
            activeEmployeesEl.textContent = activeCount;
        }

        if (departmentsCountEl) {
            const uniqueDepartments = new Set(this.employees.map(emp => emp.department)).size;
            departmentsCountEl.textContent = uniqueDepartments;
        }
    }

    async viewEmployee(employeeId) {
        try {
            const employee = await window.dataManager.loadEmployee(employeeId);
            this.showEmployeeModal(employee, false);
        } catch (error) {
            console.error('Ошибка загрузки сотрудника:', error);
            window.dataManager.handleError(error, 'viewEmployee');
        }
    }

    async editEmployee(employeeId) {
        try {
            const employee = await window.dataManager.loadEmployee(employeeId);
            this.showEmployeeForm(employee);
        } catch (error) {
            console.error('Ошибка загрузки сотрудника:', error);
            window.dataManager.handleError(error, 'editEmployee');
        }
    }

    async deleteEmployee(employeeId) {
        if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            return;
        }

        try {
            await window.api.deleteEmployee(employeeId);
            window.api.showNotification('Сотрудник успешно удален', 'success');
            this.loadEmployees();
        } catch (error) {
            console.error('Ошибка удаления сотрудника:', error);
            window.dataManager.handleError(error, 'deleteEmployee');
        }
    }

    showEmployeeModal(employee, isEdit = false) {
        const modal = document.getElementById('employeeModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (modalTitle) {
            modalTitle.textContent = isEdit ? 'Редактировать сотрудника' : 'Информация о сотруднике';
        }

        if (modalBody) {
            modalBody.innerHTML = this.getEmployeeModalContent(employee);
        }

        this.showModal(modal);
    }

    getEmployeeModalContent(employee) {
        return `
            <div class="employee-detail">
                <div class="employee-header">
                    <div class="employee-avatar large">
                        ${this.getInitials(employee.name, employee.surname)}
                    </div>
                    <div class="employee-info">
                        <h3>${employee.name} ${employee.surname}</h3>
                        <p class="employee-position">${employee.position}</p>
                        <span class="status-badge status-${employee.status || 'active'}">
                            ${this.getStatusText(employee.status)}
                        </span>
                    </div>
                </div>
                
                <div class="employee-details">
                    <div class="detail-row">
                        <label>Email:</label>
                        <span>${employee.email}</span>
                    </div>
                    <div class="detail-row">
                        <label>Телефон:</label>
                        <span>${employee.phone || 'Не указан'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Отдел:</label>
                        <span>${this.getDepartmentName(employee.department)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Дата приема:</label>
                        <span>${this.formatDate(employee.hire_date)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Зарплата:</label>
                        <span>${employee.salary ? this.formatCurrency(employee.salary) : 'Не указана'}</span>
                    </div>
                    ${employee.notes ? `
                    <div class="detail-row">
                        <label>Примечания:</label>
                        <span>${employee.notes}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    showEmployeeForm(employee = null) {
        const modal = document.getElementById('employeeFormModal');
        const formTitle = document.getElementById('formModalTitle');
        const form = document.getElementById('employeeForm');

        if (formTitle) {
            formTitle.textContent = employee ? 'Редактировать сотрудника' : 'Добавить сотрудника';
        }

        if (employee) {
            this.populateForm(employee);
        } else {
            form.reset();
        }

        this.showModal(modal);
    }

    populateForm(employee) {
        const fields = ['name', 'surname', 'email', 'phone', 'position', 'department', 'hire_date', 'salary', 'notes'];
        fields.forEach(field => {
            const input = document.getElementById(`employee${field.charAt(0).toUpperCase() + field.slice(1)}`);
            if (input && employee[field]) {
                input.value = employee[field];
            }
        });
    }

    async saveEmployee() {
        const form = document.getElementById('employeeForm');
        const formData = new FormData(form);
        const employeeData = Object.fromEntries(formData.entries());

        try {
            if (employeeData.id) {
                await window.api.updateEmployee(employeeData.id, employeeData);
                window.api.showNotification('Сотрудник успешно обновлен', 'success');
            } else {
                await window.api.createEmployee(employeeData);
                window.api.showNotification('Сотрудник успешно создан', 'success');
            }

            this.closeModal(document.getElementById('employeeFormModal'));
            this.loadEmployees();
        } catch (error) {
            console.error('Ошибка сохранения сотрудника:', error);
            window.dataManager.handleError(error, 'saveEmployee');
        }
    }

    exportEmployees() {
        // Простой экспорт в CSV
        const headers = ['Имя', 'Фамилия', 'Должность', 'Отдел', 'Email', 'Телефон', 'Дата приема', 'Статус'];
        const csvContent = [
            headers.join(','),
            ...this.employees.map(emp => [
                emp.name,
                emp.surname,
                emp.position,
                this.getDepartmentName(emp.department),
                emp.email,
                emp.phone || '',
                this.formatDate(emp.hire_date),
                this.getStatusText(emp.status)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showModal(modal) {
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }

    // Utility functions
    getInitials(name, surname) {
        return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }

    getDepartmentName(department) {
        const departments = {
            'production': 'Производство',
            'quality': 'Контроль качества',
            'logistics': 'Логистика',
            'hr': 'HR',
            'management': 'Управление'
        };
        return departments[department] || department;
    }

    getStatusText(status) {
        const statuses = {
            'active': 'Активен',
            'inactive': 'Неактивен',
            'vacation': 'В отпуске'
        };
        return statuses[status] || 'Активен';
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(amount);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Создаем глобальный экземпляр
window.employeesManager = new EmployeesManager();

// Экспорт для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmployeesManager;
}