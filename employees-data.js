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
        salary: {
            baseSalary: 55000,
            bonus: 5000,
            nightShift: 0,
            hazardPay: 8000,
            overtime: 2000,
            holidayWork: 1000,
            total: 71000
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