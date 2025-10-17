// База данных сотрудников Soda-Chlorate
// Для добавления нового сотрудника скопируйте шаблон и заполните данные

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
        schedule: "Пн-Пт: 08:00 - 17:00",
        avatar: "ИП",
        hireDate: "2020-03-15",
        salary: 75000
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
        schedule: "Пн-Пт: 09:00 - 18:00",
        avatar: "МС",
        hireDate: "2021-07-10",
        salary: 55000
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
        schedule: "Пн-Пт: 08:30 - 17:30",
        avatar: "АК",
        hireDate: "2019-11-20",
        salary: 85000
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
        schedule: "Пн-Пт: 08:00 - 17:00",
        avatar: "ЕВ",
        hireDate: "2022-01-15",
        salary: 70000
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
        schedule: "Пн-Пт: 09:00 - 18:00",
        avatar: "ДН",
        hireDate: "2018-05-10",
        salary: 120000
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
        schedule: "Пн-Пт: 08:00 - 17:00",
        avatar: "АС",
        hireDate: "2021-09-01",
        salary: 65000
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
        schedule: "Сменный график",
        avatar: "СМ",
        hireDate: "2020-12-03",
        salary: 60000
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
        schedule: "Пн-Пт: 08:30 - 17:30",
        avatar: "ОЛ",
        hireDate: "2022-03-20",
        salary: 58000
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
        schedule: "Пн-Пт: 08:00 - 17:00",
        avatar: "ИФ", // Инициалы
        hireDate: "2024-01-01",
        salary: 50000
    }
    */
];

// Экспорт данных для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPLOYEES_DATABASE;
}