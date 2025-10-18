// База данных сотрудников Сода-Хлорат
const EMPLOYEES_DATABASE = [
    {
        id: 1,
        employeeNumber: "001", // Табельный номер
        password: "password123", // Пароль для входа
        name: "Аляутдинов Рашид",
        position: "Оператор ДПУ",
        department: "production",
        departmentName: "Производство",
        email: "altdnv01@gmail.com",
        phone: "+7 (495) 123-45-75",
        status: "working",
        statusName: "На работе",
        shift: "morning",
        shiftName: "Утренняя смена",
        schedule: "7:30 - 19:30",
        avatar: "АР",
        hireDate: "2024-01-01",
        accessLevel: "employee", // employee, manager, admin, accountant
        accessLevelName: "Сотрудник",
        salary: {
            baseSalary: 55000, // Индивидуальный оклад
            bonusPercent: 47, // 47% премия (стандарт)
            hazardPay: 8000, // Фиксированная надбавка за вредность
            bonus: 0, // Рассчитывается автоматически (47% от оклада)
            nightShift: 0, // Рассчитывается автоматически (+40% за ночную смену)
            overtime: 0, // Рассчитывается автоматически
            holidayWork: 0, // Рассчитывается автоматически (+100% за праздники)
            total: 0 // Рассчитывается автоматически
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 6,
            holiday: 0
        }
    },
    {
        id: 2,
        employeeNumber: "002", // Табельный номер
        password: "accountant123", // Пароль для входа
        name: "Петрова Анна Сергеевна",
        position: "Главный бухгалтер",
        department: "accounting",
        departmentName: "Бухгалтерия",
        email: "petrova@soda-chlorate.ru",
        phone: "+7 (495) 123-45-76",
        status: "working",
        statusName: "На работе",
        shift: "day",
        shiftName: "Дневная смена",
        schedule: "8:00 - 17:00",
        avatar: "ПА",
        hireDate: "2023-06-01",
        accessLevel: "accountant", // employee, manager, admin, accountant
        accessLevelName: "Бухгалтер",
        salary: {
            baseSalary: 85000, // Индивидуальный оклад
            bonusPercent: 47, // 47% премия (стандарт)
            hazardPay: 0, // Нет надбавки за вредность
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
    }
];

// Экспорт для Node.js (если используется)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPLOYEES_DATABASE;
}