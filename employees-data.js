// База данных сотрудников Сода-Хлорат
const EMPLOYEES_DATABASE = [
    {
        id: 1,
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
        accessLevel: "employee", // employee, manager, admin
        accessLevelName: "Сотрудник",
        salary: {
            baseSalary: 55000,
            bonusPercent: 9, // 9% от базовой зарплаты
            hazardPay: 8000, // Фиксированная надбавка за вредность
            nightShiftMultiplier: 1.2, // +20% за ночную смену
            morningShiftMultiplier: 1.1, // +10% за утреннюю смену
            hazardMultiplier: 1.15, // +15% за вредные условия
            overtimeMultiplier: 1.5, // +50% за переработки
            holidayMultiplier: 2.0, // +100% за работу в праздники
            bonus: 0, // Рассчитывается автоматически
            nightShift: 0, // Рассчитывается автоматически
            overtime: 0, // Рассчитывается автоматически
            holidayWork: 0, // Рассчитывается автоматически
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
        name: "Исмагилова Эльмира",
        position: "Аппаратчик карбонизации",
        department: "production",
        departmentName: "Производство",
        email: "ismglva1982@gmail.com",
        phone: "+7 (495) 123-45-76",
        status: "working",
        statusName: "На работе",
        shift: "night",
        shiftName: "Ночная смена",
        schedule: "19:30 - 7:30",
        avatar: "ИЭ",
        hireDate: "2024-01-01",
        accessLevel: "manager", // employee, manager, admin
        accessLevelName: "Менеджер",
        salary: {
            baseSalary: 52000,
            bonusPercent: 6, // 6% от базовой зарплаты
            hazardPay: 7000, // Фиксированная надбавка за вредность
            nightShiftMultiplier: 1.25, // +25% за ночную смену
            morningShiftMultiplier: 1.1, // +10% за утреннюю смену
            hazardMultiplier: 1.15, // +15% за вредные условия
            overtimeMultiplier: 1.5, // +50% за переработки
            holidayMultiplier: 2.0, // +100% за работу в праздники
            bonus: 0, // Рассчитывается автоматически
            nightShift: 0, // Рассчитывается автоматически
            overtime: 0, // Рассчитывается автоматически
            holidayWork: 0, // Рассчитывается автоматически
            total: 0 // Рассчитывается автоматически
        },
        workHours: {
            regular: 160,
            night: 80,
            overtime: 4,
            holiday: 0
        }
    },
    {
        id: 3,
        name: "Администратор Системы",
        position: "Системный администратор",
        department: "management",
        departmentName: "Управление",
        email: "admin@soda-chlorate.ru",
        phone: "+7 (495) 123-45-00",
        status: "working",
        statusName: "На работе",
        shift: "day",
        shiftName: "Дневная смена",
        schedule: "8:00 - 17:00",
        avatar: "АС",
        hireDate: "2020-01-01",
        accessLevel: "admin", // employee, manager, admin
        accessLevelName: "Администратор",
        salary: {
            baseSalary: 100000,
            bonusPercent: 20, // 20% от базовой зарплаты
            hazardPay: 0, // Нет надбавки за вредность
            nightShiftMultiplier: 1.2, // +20% за ночную смену
            morningShiftMultiplier: 1.1, // +10% за утреннюю смену
            hazardMultiplier: 1.0, // Нет надбавки за вредные условия
            overtimeMultiplier: 1.5, // +50% за переработки
            holidayMultiplier: 2.0, // +100% за работу в праздники
            bonus: 0, // Рассчитывается автоматически
            nightShift: 0, // Рассчитывается автоматически
            overtime: 0, // Рассчитывается автоматически
            holidayWork: 0, // Рассчитывается автоматически
            total: 0 // Рассчитывается автоматически
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 10,
            holiday: 3
        }
    }
];

// Экспорт для Node.js (если используется)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPLOYEES_DATABASE;
}