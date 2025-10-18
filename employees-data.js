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
    }
];

// Экспорт для Node.js (если используется)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPLOYEES_DATABASE;
}