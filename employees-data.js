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
            baseSalary: 52000, // Индивидуальный оклад
            bonusPercent: 47, // 47% премия (стандарт)
            hazardPay: 7000, // Фиксированная надбавка за вредность
            bonus: 0, // Рассчитывается автоматически (47% от оклада)
            nightShift: 0, // Рассчитывается автоматически (+40% за ночную смену)
            overtime: 0, // Рассчитывается автоматически
            holidayWork: 0, // Рассчитывается автоматически (+100% за праздники)
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
            baseSalary: 100000, // Индивидуальный оклад
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
            overtime: 10,
            holiday: 3
        }
    }
];

// Экспорт для Node.js (если используется)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPLOYEES_DATABASE;
}