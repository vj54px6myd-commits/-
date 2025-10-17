// Sample data for testing Soda-Chlorate Employee Portal

const SAMPLE_EMPLOYEES = [
    {
        id: 1,
        name: 'Иван',
        surname: 'Петров',
        email: 'ivan.petrov@soda-chlorate.com',
        phone: '+7 (495) 123-45-67',
        position: 'Главный инженер-химик',
        department: 'production',
        hire_date: '2020-03-15',
        salary: 120000,
        status: 'active',
        notes: 'Опытный специалист по производству хлората натрия'
    },
    {
        id: 2,
        name: 'Мария',
        surname: 'Сидорова',
        email: 'maria.sidorova@soda-chlorate.com',
        phone: '+7 (495) 123-45-68',
        position: 'Менеджер по качеству',
        department: 'quality',
        hire_date: '2019-07-22',
        salary: 95000,
        status: 'active',
        notes: 'Отвечает за контроль качества продукции'
    },
    {
        id: 3,
        name: 'Алексей',
        surname: 'Козлов',
        email: 'alexey.kozlov@soda-chlorate.com',
        phone: '+7 (495) 123-45-69',
        position: 'Логист',
        department: 'logistics',
        hire_date: '2021-01-10',
        salary: 75000,
        status: 'active',
        notes: 'Координирует поставки сырья и отгрузку готовой продукции'
    },
    {
        id: 4,
        name: 'Елена',
        surname: 'Морозова',
        email: 'elena.morozova@soda-chlorate.com',
        phone: '+7 (495) 123-45-70',
        position: 'HR-менеджер',
        department: 'hr',
        hire_date: '2018-11-05',
        salary: 85000,
        status: 'active',
        notes: 'Занимается подбором персонала и HR-процессами'
    },
    {
        id: 5,
        name: 'Дмитрий',
        surname: 'Волков',
        email: 'dmitry.volkov@soda-chlorate.com',
        phone: '+7 (495) 123-45-71',
        position: 'Директор по производству',
        department: 'management',
        hire_date: '2017-05-20',
        salary: 150000,
        status: 'active',
        notes: 'Руководит всеми производственными процессами'
    },
    {
        id: 6,
        name: 'Анна',
        surname: 'Новикова',
        email: 'anna.novikova@soda-chlorate.com',
        phone: '+7 (495) 123-45-72',
        position: 'Лаборант',
        department: 'quality',
        hire_date: '2022-09-01',
        salary: 60000,
        status: 'vacation',
        notes: 'Проводит лабораторные анализы продукции'
    },
    {
        id: 7,
        name: 'Сергей',
        surname: 'Федоров',
        email: 'sergey.fedorov@soda-chlorate.com',
        phone: '+7 (495) 123-45-73',
        position: 'Оператор производства',
        department: 'production',
        hire_date: '2021-06-15',
        salary: 70000,
        status: 'active',
        notes: 'Работает на основном производственном оборудовании'
    },
    {
        id: 8,
        name: 'Ольга',
        surname: 'Соколова',
        email: 'olga.sokolova@soda-chlorate.com',
        phone: '+7 (495) 123-45-74',
        position: 'Бухгалтер',
        department: 'management',
        hire_date: '2019-02-28',
        salary: 80000,
        status: 'active',
        notes: 'Ведет финансовый учет компании'
    },
    {
        id: 9,
        name: 'Михаил',
        surname: 'Лебедев',
        email: 'mikhail.lebedev@soda-chlorate.com',
        phone: '+7 (495) 123-45-75',
        position: 'Инженер по безопасности',
        department: 'production',
        hire_date: '2020-10-12',
        salary: 90000,
        status: 'active',
        notes: 'Отвечает за технику безопасности на производстве'
    },
    {
        id: 10,
        name: 'Татьяна',
        surname: 'Кузнецова',
        email: 'tatyana.kuznetsova@soda-chlorate.com',
        phone: '+7 (495) 123-45-76',
        position: 'Менеджер по продажам',
        department: 'management',
        hire_date: '2021-03-08',
        salary: 85000,
        status: 'inactive',
        notes: 'Работает с клиентами и партнерами'
    }
];

const SAMPLE_DEPARTMENTS = [
    { id: 'production', name: 'Производство', description: 'Основное производство химической продукции' },
    { id: 'quality', name: 'Контроль качества', description: 'Контроль качества и лабораторные исследования' },
    { id: 'logistics', name: 'Логистика', description: 'Поставки сырья и отгрузка готовой продукции' },
    { id: 'hr', name: 'HR', description: 'Управление персоналом и HR-процессы' },
    { id: 'management', name: 'Управление', description: 'Руководство и административные функции' }
];

const SAMPLE_STATS = {
    total_employees: 10,
    active_employees: 8,
    inactive_employees: 1,
    vacation_employees: 1,
    departments_count: 5,
    average_salary: 89000,
    new_employees_this_month: 0
};

// Функция для загрузки тестовых данных
function loadSampleData() {
    // Переопределяем методы API для использования тестовых данных
    if (window.api) {
        // Переопределяем метод получения сотрудников
        const originalGetEmployees = window.api.getEmployees;
        window.api.getEmployees = async function(page = 1, limit = 10, search = '', department = '') {
            // Имитируем задержку API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let filteredEmployees = [...SAMPLE_EMPLOYEES];
            
            // Фильтрация по поиску
            if (search) {
                const searchLower = search.toLowerCase();
                filteredEmployees = filteredEmployees.filter(emp => 
                    emp.name.toLowerCase().includes(searchLower) ||
                    emp.surname.toLowerCase().includes(searchLower) ||
                    emp.email.toLowerCase().includes(searchLower) ||
                    emp.position.toLowerCase().includes(searchLower)
                );
            }
            
            // Фильтрация по отделу
            if (department) {
                filteredEmployees = filteredEmployees.filter(emp => emp.department === department);
            }
            
            // Пагинация
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
            
            return {
                employees: paginatedEmployees,
                total: filteredEmployees.length,
                page: page,
                limit: limit,
                total_pages: Math.ceil(filteredEmployees.length / limit)
            };
        };
        
        // Переопределяем метод получения статистики
        const originalGetEmployeesStats = window.api.getEmployeesStats;
        window.api.getEmployeesStats = async function() {
            await new Promise(resolve => setTimeout(resolve, 300));
            return SAMPLE_STATS;
        };
        
        // Переопределяем метод получения отделов
        const originalGetDepartments = window.api.getDepartments;
        window.api.getDepartments = async function() {
            await new Promise(resolve => setTimeout(resolve, 200));
            return SAMPLE_DEPARTMENTS;
        };
        
        // Переопределяем метод получения конкретного сотрудника
        const originalGetEmployee = window.api.getEmployee;
        window.api.getEmployee = async function(employeeId) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const employee = SAMPLE_EMPLOYEES.find(emp => emp.id === parseInt(employeeId));
            if (!employee) {
                throw new Error('Сотрудник не найден');
            }
            return employee;
        };
        
        // Переопределяем метод создания сотрудника
        const originalCreateEmployee = window.api.createEmployee;
        window.api.createEmployee = async function(employeeData) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newEmployee = {
                id: Math.max(...SAMPLE_EMPLOYEES.map(emp => emp.id)) + 1,
                ...employeeData,
                status: 'active',
                hire_date: employeeData.hire_date || new Date().toISOString().split('T')[0]
            };
            
            SAMPLE_EMPLOYEES.push(newEmployee);
            SAMPLE_STATS.total_employees++;
            SAMPLE_STATS.active_employees++;
            
            return newEmployee;
        };
        
        // Переопределяем метод обновления сотрудника
        const originalUpdateEmployee = window.api.updateEmployee;
        window.api.updateEmployee = async function(employeeId, employeeData) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const index = SAMPLE_EMPLOYEES.findIndex(emp => emp.id === parseInt(employeeId));
            if (index === -1) {
                throw new Error('Сотрудник не найден');
            }
            
            SAMPLE_EMPLOYEES[index] = { ...SAMPLE_EMPLOYEES[index], ...employeeData };
            return SAMPLE_EMPLOYEES[index];
        };
        
        // Переопределяем метод удаления сотрудника
        const originalDeleteEmployee = window.api.deleteEmployee;
        window.api.deleteEmployee = async function(employeeId) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const index = SAMPLE_EMPLOYEES.findIndex(emp => emp.id === parseInt(employeeId));
            if (index === -1) {
                throw new Error('Сотрудник не найден');
            }
            
            const employee = SAMPLE_EMPLOYEES[index];
            SAMPLE_EMPLOYEES.splice(index, 1);
            SAMPLE_STATS.total_employees--;
            
            if (employee.status === 'active') {
                SAMPLE_STATS.active_employees--;
            }
            
            return { success: true };
        };
    }
}

// Автоматически загружаем тестовые данные при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
});

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
    window.SAMPLE_EMPLOYEES = SAMPLE_EMPLOYEES;
    window.SAMPLE_DEPARTMENTS = SAMPLE_DEPARTMENTS;
    window.SAMPLE_STATS = SAMPLE_STATS;
    window.loadSampleData = loadSampleData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SAMPLE_EMPLOYEES,
        SAMPLE_DEPARTMENTS,
        SAMPLE_STATS,
        loadSampleData
    };
}