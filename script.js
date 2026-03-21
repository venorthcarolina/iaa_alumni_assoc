// ── Tab switching ─────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(sec => {
    sec.classList.toggle('active', sec.id === 'tab-' + tabId);
  });
  if (tabId === 'calendar') renderCalendar();
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ── Events data ───────────────────────────────────────────────
const EVENTS = [
  { year: 2026, month: 3, day: 15, title: 'Cap & Gown Drive Closes', location: 'TBD' },
  { year: 2026, month: 4, day: 19, title: 'Spring Social', location: 'Tap Yard, Raleigh · 1610 Automotive Way, Raleigh, NC 27604 · 2:00 PM EST' },
  { year: 2026, month: 5, day:  2, title: 'Class of 2026 Graduation', location: 'Talley Student Union · 12:30 PM EST' },
];

// ── Calendar state ────────────────────────────────────────────
const today = new Date();
let calYear  = today.getFullYear();
let calMonth = today.getMonth() + 1; // 1-based

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function renderCalendar() {
  document.getElementById('cal-month-label').textContent =
    MONTH_NAMES[calMonth - 1] + ' ' + calYear;

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  // Day headers
  DAY_HEADERS.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-header';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDow = new Date(calYear, calMonth - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();

  // Empty leading cells
  for (let i = 0; i < firstDow; i++) {
    const el = document.createElement('div');
    el.className = 'cal-cell empty';
    grid.appendChild(el);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    const isToday = d === today.getDate() &&
                    calMonth === today.getMonth() + 1 &&
                    calYear  === today.getFullYear();
    cell.className = 'cal-cell' + (isToday ? ' today' : '');

    const numSpan = document.createElement('span');
    numSpan.className = 'cal-day-num';
    numSpan.textContent = d;
    cell.appendChild(numSpan);

    // Add event dots
    EVENTS.filter(e => e.year === calYear && e.month === calMonth && e.day === d)
      .forEach(e => {
        const ev = document.createElement('div');
        ev.className = 'cal-event';
        ev.textContent = e.title;
        ev.title = e.title + ' — ' + e.location;
        cell.appendChild(ev);
      });

    grid.appendChild(cell);
  }

  // ── Upcoming events list ──────────────────────────────────
  const listEl = document.getElementById('event-list');
  listEl.innerHTML = '';

  const upcoming = EVENTS.filter(e => {
    const d = new Date(e.year, e.month - 1, e.day);
    return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }).sort((a, b) => new Date(a.year, a.month-1, a.day) - new Date(b.year, b.month-1, b.day))
    .slice(0, 5);

  if (upcoming.length === 0) {
    listEl.innerHTML = '<p style="color:var(--gray)">No upcoming events scheduled. Check back soon!</p>';
    return;
  }

  upcoming.forEach(e => {
    const item = document.createElement('div');
    item.className = 'event-item';
    item.innerHTML = `
      <div class="event-date-badge">
        <div class="month">${MONTH_NAMES[e.month - 1].slice(0,3)}</div>
        <div class="day">${e.day}</div>
      </div>
      <div class="event-info">
        <h4>${e.title}</h4>
        <p>📍 ${e.location} &nbsp;·&nbsp; ${MONTH_NAMES[e.month-1]} ${e.day}, ${e.year}</p>
      </div>`;
    listEl.appendChild(item);
  });
}

document.getElementById('prev-month').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 1) { calMonth = 12; calYear--; }
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 12) { calMonth = 1; calYear++; }
  renderCalendar();
});

// Render calendar on load if that tab is active
if (document.querySelector('.tab-btn[data-tab="calendar"]').classList.contains('active')) {
  renderCalendar();
}
