const BRAND = {
  name: "Сода-Хлорат",
  colors: { primary: "#0a2540", accent: "#123c69" },
};

const state = {
  activeTab: "schedule",
  schedule: generateSampleSchedule(),
  salary: generateSampleSalary(),
  news: generateSampleNews(),
};

function qs(selector, root = document) { return root.querySelector(selector); }
function qsa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

window.addEventListener("DOMContentLoaded", () => {
  qs("#year").textContent = new Date().getFullYear();
  bindTabs();
  render();
});

function bindTabs() {
  const buttons = qsa(".nav-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      state.activeTab = tab;
      buttons.forEach(b => b.classList.toggle("is-active", b === btn));

      qsa(".panel").forEach(p => p.toggleAttribute("hidden", p.id !== `panel-${tab}`));
      render();
    });
  });
}

function render() {
  if (state.activeTab === "schedule") renderSchedule();
  if (state.activeTab === "salary") renderSalary();
  if (state.activeTab === "news") renderNews();
}

// Schedule
function renderSchedule() {
  const root = qs("#schedule-container");
  root.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "week-grid";

  state.schedule.forEach(day => {
    const card = document.createElement("div");
    card.className = "day-card";

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = formatDate(day.date);

    const shift = document.createElement("div");
    shift.className = "shift";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = day.shiftName;

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = `${day.start} – ${day.end}`;

    shift.append(name, time);
    card.append(date, shift);
    grid.append(card);
  });

  root.append(grid);
}

// Salary
function renderSalary() {
  const summaryRoot = qs("#salary-summary");
  const historyRoot = qs("#salary-history");
  summaryRoot.innerHTML = "";
  historyRoot.innerHTML = "";

  const { currentMonth, accrued, paid, balance, history } = state.salary;

  const cards = [
    { label: "Текущий месяц", value: currentMonth },
    { label: "Начислено", value: formatCurrency(accrued) },
    { label: "Выплачено", value: formatCurrency(paid) },
  ];

  cards.forEach(c => summaryRoot.append(createSummaryCard(c.label, c.value)));

  history.forEach(item => {
    const row = document.createElement("div");
    row.className = "history-item";

    const left = document.createElement("div");
    left.innerHTML = `<div class="date">${formatDate(item.date)}</div><div class="note">${item.note}</div>`;

    const right = document.createElement("div");
    right.className = "amount";
    right.textContent = `${item.type === 'credit' ? '+' : '−'} ${formatCurrency(item.amount)}`;

    row.append(left, right);
    historyRoot.append(row);
  });
}

function createSummaryCard(label, value) {
  const card = document.createElement("div");
  card.className = "summary-card";
  card.innerHTML = `<div class="label">${label}</div><div class="value">${value}</div>`;
  return card;
}

// News
function renderNews() {
  const root = qs("#news-feed");
  root.innerHTML = "";

  state.news.forEach(n => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.setAttribute("aria-labelledby", `news-${n.id}-title`);

    const img = document.createElement("img");
    img.src = n.image;
    img.alt = n.imageAlt;

    const content = document.createElement("div");
    content.className = "content";

    const title = document.createElement("div");
    title.className = "title";
    title.id = `news-${n.id}-title`;
    title.textContent = n.title;

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = formatDate(n.date);

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = n.text;

    content.append(title, date, text);
    card.append(img, content);
    root.append(card);
  });
}

// Sample data generators
function generateSampleSchedule() {
  const today = new Date();
  const start = startOfWeek(today);
  const shifts = [
    { name: "Смена A", start: "08:00", end: "16:00" },
    { name: "Смена B", start: "16:00", end: "00:00" },
    { name: "Смена C", start: "00:00", end: "08:00" },
  ];

  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(start, i);
    const s = shifts[i % shifts.length];
    return { date, shiftName: s.name, start: s.start, end: s.end };
  });
}

function generateSampleSalary() {
  const month = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(new Date());
  const history = [
    { date: addDays(new Date(), -2), note: "Премия за безопасность", amount: 5000, type: 'credit' },
    { date: addDays(new Date(), -10), note: "Аванс", amount: 20000, type: 'debit' },
    { date: addDays(new Date(), -25), note: "Начисление за часы", amount: 42000, type: 'credit' },
  ];
  const accrued = history.filter(h => h.type === 'credit').reduce((s, x) => s + x.amount, 0);
  const paid = history.filter(h => h.type === 'debit').reduce((s, x) => s + x.amount, 0);
  const balance = accrued - paid;
  return { currentMonth: capitalize(month), accrued, paid, balance, history };
}

function generateSampleNews() {
  return [
    { id: 1, title: "Запуск новой линии по производству хлората", date: addDays(new Date(), -1), text: "Успешно провели испытания и запустили линию.", image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1200&auto=format&fit=crop", imageAlt: "Производственная линия" },
    { id: 2, title: "Обновление стандартов охраны труда", date: addDays(new Date(), -5), text: "Просим сотрудников ознакомиться с новыми инструкциями.", image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200&auto=format&fit=crop", imageAlt: "Средства защиты" },
    { id: 3, title: "День открытых дверей для семей", date: addDays(new Date(), -12), text: "Провели экскурсию по предприятию для родственников.", image: "https://images.unsplash.com/photo-1503798395360-0e1efbe30f65?q=80&w=1200&auto=format&fit=crop", imageAlt: "Гости на экскурсии" },
  ];
}

// Utils
function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function formatDate(date) {
  const d = (date instanceof Date) ? date : new Date(date);
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(d);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday-first
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
