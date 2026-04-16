const EXAM_TIME = { startHour: 8, endHour: 11 };
const NEPAL_TZ = "Asia/Kathmandu";

const routine = [
  { subject: "English", code: "0041", bsDate: "2083-01-14", date: "2026-04-27" },
  { subject: "Social Studies", code: "9011", bsDate: "2083-01-15", date: "2026-04-28" },
  { subject: "Physics", code: "9131", bsDate: "2083-01-17", date: "2026-04-30" },
  { subject: "Maths", code: "9141", bsDate: "2083-01-20", date: "2026-05-03" },
  { subject: "Chemistry", code: "9111", bsDate: "2083-01-21", date: "2026-05-04" },
  { subject: "Software Engineering & Project", code: "9371", bsDate: "2083-01-23", date: "2026-05-06" },
  { subject: "Contemporary Technology", code: "9361", bsDate: "2083-01-24", date: "2026-05-07" },
  { subject: "Computer Network", code: "9351", bsDate: "2083-01-25", date: "2026-05-08" },
  { subject: "Visual Programming", code: "9341", bsDate: "2083-01-27", date: "2026-05-10" },
];

const $ = (id) => document.getElementById(id);
const dayMs = 24 * 60 * 60 * 1000;

const nepalClock = $("nepal-now");
const nepalDate = $("nepal-date");
const nextSubject = $("next-subject");
const nextDateTime = $("next-datetime");
const themeBtn = $("theme-btn");
const notifyBtn = $("notify-btn");
const routineList = $("routine-list");

const flipUnits = {
  days: document.querySelector('.time-box[data-unit="days"]'),
  hours: document.querySelector('.time-box[data-unit="hours"]'),
  minutes: document.querySelector('.time-box[data-unit="minutes"]'),
  seconds: document.querySelector('.time-box[data-unit="seconds"]'),
};

const toExamStart = (dateISO) => new Date(`${dateISO}T${String(EXAM_TIME.startHour).padStart(2, "0")}:00:00+05:45`);

function toNepaliDigits(value) {
  return String(value).replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
}

function formatNepaliDate(date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-bikram-sambat", {
      timeZone: NEPAL_TZ,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(date);
    const pick = (type) => parts.find((part) => part.type === type)?.value ?? "";
    const monthMap = {
      Baisakh: "बैशाख",
      Jestha: "जेठ",
      Ashadh: "असार",
      Shrawan: "श्रावण",
      Bhadra: "भदौ",
      Ashwin: "असोज",
      Kartik: "कार्तिक",
      Mangsir: "मंसिर",
      Poush: "पुष",
      Magh: "माघ",
      Falgun: "फागुन",
      Chaitra: "चैत्र",
      April: "बैशाख",
      May: "जेठ",
      June: "असार",
      July: "श्रावण",
      August: "भदौ",
      September: "असोज",
      October: "कार्तिक",
      November: "मंसिर",
      December: "पुष",
      January: "माघ",
      February: "फागुन",
      March: "चैत्र",
    };
    const weekdayMap = {
      Sunday: "आइतबार",
      Monday: "सोमबार",
      Tuesday: "मंगलबार",
      Wednesday: "बुधबार",
      Thursday: "बिहिबार",
      Friday: "शुक्रबार",
      Saturday: "शनिबार",
    };
    const weekday = weekdayMap[pick("weekday")] || pick("weekday");
    const month = monthMap[pick("month")] || pick("month");
    const rawYear = Number(pick("year")) || 0;
    const correctedYear = rawYear < 2070 ? rawYear + 57 : rawYear;
    return `${weekday}, ${toNepaliDigits(pick("day"))} ${month} ${toNepaliDigits(correctedYear)}`;
  } catch (error) {
    return "नेपाली मिति उपलब्ध छैन";
  }
}

function formatNepaliTime(date) {
  return new Intl.DateTimeFormat("ne-NP", {
    timeZone: NEPAL_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function nowInNepalDate() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: NEPAL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const pick = (type) => parts.find((x) => x.type === type)?.value ?? "00";
  return new Date(`${pick("year")}-${pick("month")}-${pick("day")}T${pick("hour")}:${pick("minute")}:${pick("second")}+05:45`);
}

function getUpcomingExam(now) {
  return routine
    .slice()
    .sort((a, b) => toExamStart(a.date) - toExamStart(b.date))
    .find((exam) => toExamStart(exam.date) > now);
}

function setValue(unitEl, nextValue) {
  if (!unitEl) return;
  const top = unitEl.querySelector(".top");
  const current = unitEl.dataset.value || "";
  if (current !== nextValue) {
    unitEl.dataset.value = nextValue;
    top.textContent = nextValue;
  }
}

function updateMainCountdown() {
  const now = nowInNepalDate();
  const upcoming = getUpcomingExam(now);

  if (!upcoming) {
    nextSubject.textContent = "अब परीक्षा बाँकी छैन";
    nextDateTime.textContent = "रुटिन सकिएको छ";
    Object.values(flipUnits).forEach((unit) => setValue(unit, "00"));
    return;
  }

  const diff = toExamStart(upcoming.date) - now;
  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  nextSubject.textContent = `${upcoming.subject} (Computer Engineering)`;
  nextDateTime.textContent = `${toNepaliDigits(upcoming.bsDate)} | ${formatNepaliTime(toExamStart(upcoming.date))} (NPT)`;
  setValue(flipUnits.days, String(days).padStart(2, "0"));
  setValue(flipUnits.hours, String(hours).padStart(2, "0"));
  setValue(flipUnits.minutes, String(minutes).padStart(2, "0"));
  setValue(flipUnits.seconds, String(seconds).padStart(2, "0"));
}

function updateNepalClock() {
  const now = new Date();
  nepalClock.textContent = formatNepaliTime(now);
  nepalDate.textContent = formatNepaliDate(now);
}

function renderRoutineList() {
  const now = nowInNepalDate();
  const list = [...routine].sort((a, b) => toExamStart(a.date) - toExamStart(b.date));
  routineList.innerHTML = list
    .map((item) => {
      const state = toExamStart(item.date) > now ? "बाँकी" : "सकियो";
      return `<div class="routine-item">
        <div class="routine-subject">${item.subject} (${item.code})</div>
        <div class="routine-date">${toNepaliDigits(item.bsDate)} | ${state}</div>
      </div>`;
    })
    .join("");
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    notifyBtn.textContent = "Notifications unavailable";
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    notifyBtn.textContent = "Permission denied";
    return;
  }
  localStorage.setItem("notifyEnabled", "1");
  notifyBtn.textContent = "Reminders enabled";
  scheduleReminder();
}

function scheduleReminder() {
  const now = nowInNepalDate();
  const upcoming = getUpcomingExam(now);
  if (!upcoming) return;
  const reminderAt = toExamStart(upcoming.date).getTime() - 60 * 60 * 1000;
  const wait = reminderAt - now.getTime();
  if (wait > 0 && wait < 2147483647) {
    setTimeout(() => {
      new Notification("NEB Exam Reminder", {
        body: `${upcoming.subject} परीक्षा १ घण्टापछि सुरु हुन्छ`,
      });
    }, wait);
  }
}

function applyTheme(saved) {
  if (saved === "light") document.body.classList.add("light");
  else document.body.classList.remove("light");
}

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
notifyBtn.addEventListener("click", enableNotifications);

applyTheme(localStorage.getItem("theme") || "dark");
if (localStorage.getItem("notifyEnabled") === "1") {
  notifyBtn.textContent = "Reminders enabled";
  scheduleReminder();
}

function tick() {
  updateNepalClock();
  updateMainCountdown();
}

renderRoutineList();
tick();
setInterval(tick, 1000);
setInterval(renderRoutineList, 10000);
