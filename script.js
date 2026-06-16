const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const PERIODS = [
  { id:1, name:'Period 1',    time:'10:00–10:45', isBreak:false },
  { id:2, name:'Period 2',    time:'10:45–11:30', isBreak:false },
  { id:3, name:'Short Break', time:'11:30–11:45', isBreak:true  },
  { id:4, name:'Period 3',    time:'11:45–12:30', isBreak:false },
  { id:5, name:'Period 4',    time:'12:30–1:15',  isBreak:false },
  { id:6, name:'Lunch Break', time:'1:15–2:00',   isBreak:true  },
  { id:7, name:'Period 5',    time:'2:00–2:45',   isBreak:false },
  { id:8, name:'Period 6',    time:'2:45–3:30',   isBreak:false },
  { id:9, name:'Short Break', time:'3:30–3:45',   isBreak:true  },
  { id:10, name:'Period 7',   time:'3:45–4:30',   isBreak:false },
];
const CLASS_PERIODS = PERIODS.filter(p => !p.isBreak);
const CLASSES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5'];
const SUBJECTS = ['math','english','nepali','science','social','other'];
const SNAME = { math:'Math', english:'English', nepali:'Nepali', science:'Science', social:'Social', other:'Other' };

let teachers = [];
let schedule = null;

function addTeacher() {
  const name = document.getElementById('tName').value.trim();
  if (!name) { alert('Enter teacher name'); return; }
  const subject = document.getElementById('tSubject').value;
  const type    = document.getElementById('tType').value;
  const max     = +document.getElementById('tMax').value;

  // Available days based on work type
  let days;
  if (type === 'full')      days = [...DAYS];
  else if (type === 'part') days = ['Sunday','Monday','Wednesday']; // 3 days
  else                      days = ['Sunday','Tuesday','Thursday']; // alternate

  teachers.push({ id: Date.now(), name, subject, type, max, days });
  document.getElementById('tName').value = '';
  renderTeachers();
}

function removeTeacher(id) {
  teachers = teachers.filter(t => t.id !== id);
  renderTeachers();
}

function renderTeachers() {
  const el = document.getElementById('teacherList');
  if (!teachers.length) { el.innerHTML = '<p style="color:#999">No teachers yet.</p>'; return; }
  el.innerHTML = teachers.map(t => `
    <div>
      <span><strong>${t.name}</strong> — <span class="tag tag-${t.subject}">${SNAME[t.subject]}</span>
      &nbsp; ${t.type === 'full' ? '🕐 Full Time' : t.type === 'part' ? '⏱ Part Time' : '🔄 Alternate'}
      &nbsp; Max ${t.max} periods/day
      &nbsp; Days: ${t.days.join(', ')}</span>
      <button class="del" onclick="removeTeacher(${t.id})">Remove</button>
    </div>`).join('');
}

function generate() {
  if (!teachers.length) { document.getElementById('genMsg').innerHTML = '<div class="warn">⚠️ Add at least one teacher first.</div>'; return; }

  schedule = {};
  const issues = [];

  // Track how many periods each teacher has per day
  const used = {}; // used[teacherId][day] = count
  teachers.forEach(t => { used[t.id] = {}; DAYS.forEach(d => used[t.id][d] = 0); });

  DAYS.forEach((day, di) => {
    schedule[day] = {};
    CLASSES.forEach((cls, ci) => {
      schedule[day][cls] = {};
      // Rotate subjects across classes and days
      const subjectOrder = SUBJECTS.slice().map((s,i) => SUBJECTS[(i + ci + di) % SUBJECTS.length]);

      CLASS_PERIODS.forEach((period, pi) => {
        const subject = subjectOrder[pi % subjectOrder.length];

        // Find available teacher for this subject on this day
        const pick = teachers.find(t =>
          t.subject === subject &&
          t.days.includes(day) &&
          used[t.id][day] < t.max
        );

        if (pick) {
          schedule[day][cls][period.id] = { teacher: pick.name, subject };
          used[pick.id][day]++;
        } else {
          schedule[day][cls][period.id] = { teacher: '—', subject };
          issues.push(`No teacher for ${SNAME[subject]} on ${day} (${cls})`);
        }
      });
    });
  });

  const uniqueIssues = [...new Set(issues)];
  const msgEl = document.getElementById('genMsg');
  if (uniqueIssues.length) {
    msgEl.innerHTML = `<div class="warn">⚠️ ${uniqueIssues.length} gap(s) found:<br>${uniqueIssues.slice(0,5).map(i=>`• ${i}`).join('<br>')}${uniqueIssues.length>5?`<br>...and ${uniqueIssues.length-5} more`:''}</div>`;
  } else {
    msgEl.innerHTML = '<div class="ok">✅ Schedule generated with no gaps!</div>';
  }

  document.getElementById('viewBox').style.display = '';
  renderTable();
}

function renderTable() {
  const cls = document.getElementById('classSelect').value;
  if (!schedule) return;

  let html = '<table><thead><tr><th>Period</th><th>Time</th>';
  DAYS.forEach(d => { html += `<th>${d}</th>`; });
  html += '</tr></thead><tbody>';

  PERIODS.forEach(p => {
    if (p.isBreak) {
      html += `<tr class="break-row"><td colspan="${DAYS.length+2}">☕ ${p.name} (${p.time})</td></tr>`;
      return;
    }
    html += `<tr><td><strong>${p.name}</strong></td><td style="color:#777">${p.time}</td>`;
    DAYS.forEach(day => {
      const e = schedule[day]?.[cls]?.[p.id];
      if (e) {
        html += `<td><span class="tag tag-${e.subject}">${SNAME[e.subject]}</span><br/><small>${e.teacher}</small></td>`;
      } else {
        html += `<td style="color:#ccc">—</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  document.getElementById('tableOut').innerHTML = html;
}
