// База данных сотрудников Soda-Chlorate
// Для добавления нового сотрудника скопируйте шаблон и заполните данные

// Графики работы
const WORK_SHIFTS = {
    morning: {
        name: "Утренняя смена",
        time: "7:30 - 19:30",
        description: "Утренняя смена (7:30 - 19:30)"
    },
    night: {
        name: "Ночная смена", 
        time: "19:30 - 7:30",
        description: "Ночная смена (19:30 - 7:30)"
    },
    day: {
        name: "Дневная смена",
        time: "8:00 - 17:00", 
        description: "Дневная смена (8:00 - 17:00)"
    }
};

const EMPLOYEES_DATABASE = [
    {
        id: 1,
        name: "Иван Петров",
        position: "Инженер-химик",
        department: "production",
        departmentName: "Производство",
        email: "ivan.petrov@soda-chlorate.ru",
        phone: "+7 (495) 123-45-67",
        status: "working", // working, vacation, sick, offline
        statusName: "На работе",
        shift: "morning", // morning, night, day
        shiftName: "Утренняя смена",
        schedule: "7:30 - 19:30",
        avatar: "ИП",
        hireDate: "2020-03-15",
        salary: {
            baseSalary: 60000,        // Оклад
            bonus: 10000,             // Премия
            nightShift: 5000,         // Надбавка за ночное время
            hazardPay: 8000,          // Надбавка за вредность
            overtime: 3000,           // Переработки
            holidayWork: 2000,        // Работа в праздничные дни
            total: 88000              // Общая сумма (рассчитывается автоматически)
        },
        workHours: {
            regular: 160,             // Обычные часы
            night: 20,                // Ночные часы
            overtime: 8,              // Переработка
            holiday: 4                // Праздничные дни
        }
    },
    {
        id: 2,
        name: "Мария Сидорова",
        position: "Лаборант",
        department: "laboratory",
        departmentName: "Лаборатория",
        email: "maria.sidorova@soda-chlorate.ru",
        phone: "+7 (495) 123-45-68",
        status: "working",
        statusName: "На работе",
        shift: "day",
        shiftName: "Дневная смена",
        schedule: "8:00 - 17:00",
        avatar: "МС",
        hireDate: "2021-07-10",
        salary: {
            baseSalary: 45000,
            bonus: 5000,
            nightShift: 0,
            hazardPay: 3000,
            overtime: 1000,
            holidayWork: 0,
            total: 54000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 4,
            holiday: 0
        }
    },
    {
        id: 3,
        name: "Алексей Козлов",
        position: "Менеджер по качеству",
        department: "quality",
        departmentName: "Контроль качества",
        email: "alexey.kozlov@soda-chlorate.ru",
        phone: "+7 (495) 123-45-69",
        status: "vacation",
        statusName: "В отпуске",
        shift: "night",
        shiftName: "Ночная смена",
        schedule: "19:30 - 7:30",
        avatar: "АК",
        hireDate: "2019-11-20",
        salary: {
            baseSalary: 70000,
            bonus: 15000,
            nightShift: 0,
            hazardPay: 0,
            overtime: 0,
            holidayWork: 0,
            total: 85000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 0,
            holiday: 0
        }
    },
    {
        id: 4,
        name: "Елена Волкова",
        position: "Инженер по безопасности",
        department: "safety",
        departmentName: "Безопасность",
        email: "elena.volkova@soda-chlorate.ru",
        phone: "+7 (495) 123-45-70",
        status: "working",
        statusName: "На работе",
        shift: "day",
        shiftName: "Дневная смена",
        schedule: "8:00 - 17:00",
        avatar: "ЕВ",
        hireDate: "2022-01-15",
        salary: {
            baseSalary: 55000,
            bonus: 8000,
            nightShift: 0,
            hazardPay: 0,
            overtime: 2000,
            holidayWork: 1000,
            total: 66000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 6,
            holiday: 2
        }
    },
    {
        id: 5,
        name: "Дмитрий Новиков",
        position: "Начальник производства",
        department: "management",
        departmentName: "Управление",
        email: "dmitry.novikov@soda-chlorate.ru",
        phone: "+7 (495) 123-45-71",
        status: "sick",
        statusName: "На больничном",
        shift: "morning",
        shiftName: "Утренняя смена",
        schedule: "7:30 - 19:30",
        avatar: "ДН",
        hireDate: "2018-05-10",
        salary: {
            baseSalary: 100000,
            bonus: 20000,
            nightShift: 0,
            hazardPay: 0,
            overtime: 0,
            holidayWork: 0,
            total: 120000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 0,
            holiday: 0
        }
    },
    {
        id: 6,
        name: "Анна Смирнова",
        position: "Химик-аналитик",
        department: "laboratory",
        departmentName: "Лаборатория",
        email: "anna.smirnova@soda-chlorate.ru",
        phone: "+7 (495) 123-45-72",
        status: "working",
        statusName: "На работе",
        shift: "day",
        shiftName: "Дневная смена",
        schedule: "8:00 - 17:00",
        avatar: "АС",
        hireDate: "2021-09-01",
        salary: {
            baseSalary: 50000,
            bonus: 7000,
            nightShift: 0,
            hazardPay: 5000,
            overtime: 1500,
            holidayWork: 500,
            total: 64000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 5,
            holiday: 1
        }
    },
    {
        id: 7,
        name: "Сергей Морозов",
        position: "Оператор установки",
        department: "production",
        departmentName: "Производство",
        email: "sergey.morozov@soda-chlorate.ru",
        phone: "+7 (495) 123-45-73",
        status: "working",
        statusName: "На работе",
        shift: "night",
        shiftName: "Ночная смена",
        schedule: "19:30 - 7:30",
        avatar: "СМ",
        hireDate: "2020-12-03",
        salary: {
            baseSalary: 45000,
            bonus: 5000,
            nightShift: 8000,
            hazardPay: 6000,
            overtime: 2000,
            holidayWork: 1000,
            total: 67000
        },
        workHours: {
            regular: 160,
            night: 40,
            overtime: 8,
            holiday: 2
        }
    },
    {
        id: 8,
        name: "Ольга Лебедева",
        position: "Контролер качества",
        department: "quality",
        departmentName: "Контроль качества",
        email: "olga.lebedeva@soda-chlorate.ru",
        phone: "+7 (495) 123-45-74",
        status: "vacation",
        statusName: "В отпуске",
        shift: "morning",
        shiftName: "Утренняя смена",
        schedule: "7:30 - 19:30",
        avatar: "ОЛ",
        hireDate: "2022-03-20",
        salary: {
            baseSalary: 45000,
            bonus: 6000,
            nightShift: 0,
            hazardPay: 2000,
            overtime: 1000,
            holidayWork: 0,
            total: 54000
        },
        workHours: {
            regular: 160,
            night: 0,
            overtime: 4,
            holiday: 0
        }
    },
    {
        id: 9,
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
            holiday: 2
        }
    },
    {
        id: 10,
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
        salary: {
            baseSalary: 50000,
            bonus: 3000,
            nightShift: 10000,
            hazardPay: 6000,
            overtime: 1500,
            holidayWork: 500,
            total: 71000
        },
        workHours: {
            regular: 160,
            night: 40,
            overtime: 5,
            holiday: 1
        }
    }
    // Добавьте новых сотрудников здесь, используя следующий шаблон:
    /*
    {
        id: 9, // Увеличьте ID на 1
        name: "Имя Фамилия",
        position: "Должность",
        department: "production", // production, laboratory, quality, safety, management
        departmentName: "Название отдела",
        email: "email@soda-chlorate.ru",
        phone: "+7 (495) 123-45-XX",
        status: "working", // working, vacation, sick, offline
        statusName: "На работе", // На работе, В отпуске, На больничном, Не на работе
        shift: "day", // morning, night, day
        shiftName: "Дневная смена", // Утренняя смена, Ночная смена, Дневная смена
        schedule: "8:00 - 17:00", // 7:30 - 19:30, 19:30 - 7:30, 8:00 - 17:00
        avatar: "ИФ", // Инициалы
        hireDate: "2024-01-01",
        salary: {
            baseSalary: 50000,        // Оклад
            bonus: 5000,              // Премия
            nightShift: 0,            // Надбавка за ночное время
            hazardPay: 2000,          // Надбавка за вредность
            overtime: 1000,           // Переработки
            holidayWork: 500,         // Работа в праздничные дни
            total: 58500              // Общая сумма (рассчитывается автоматически)
        },
        workHours: {
            regular: 160,             // Обычные часы
            night: 0,                 // Ночные часы
            overtime: 4,              // Переработка
            holiday: 1                // Праздничные дни
        }
    }
    */
];

// Экспорт данных для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPLOYEES_DATABASE;
}