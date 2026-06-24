const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PERIODS = [
    { id: 1,  name: 'Period 1',    time: '10:00–10:45', isBreak: false },
    { id: 2,  name: 'Period 2',    time: '10:45–11:30', isBreak: false },
    { id: 3,  name: 'Short Break', time: '11:30–11:45', isBreak: true  },
    { id: 4,  name: 'Period 3',    time: '11:45–12:30', isBreak: false },
    { id: 5,  name: 'Period 4',    time: '12:30–1:15',  isBreak: false },
    { id: 6,  name: 'Lunch Break', time: '1:15–2:00',   isBreak: true  },
    { id: 7,  name: 'Period 5',    time: '2:00–2:45',   isBreak: false },
    { id: 8,  name: 'Period 6',    time: '2:45–3:30',   isBreak: false },
    { id: 9,  name: 'Short Break', time: '3:30–3:45',   isBreak: true  },
    { id: 10, name: 'Period 7',    time: '3:45–4:30',   isBreak: false },
];

const CLASS_PERIODS = PERIODS.filter(function(period) {
    return !period.isBreak;
});

const CLASSES  = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
const SUBJECTS = ['math', 'english', 'nepali', 'science', 'social', 'other'];

const SNAME = {
    math:    'Math',
    english: 'English',
    nepali:  'Nepali',
    science: 'Science',
    social:  'Social',
    other:   'Other'
};

var teachers = [];
var schedule = null;

function saveData() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

function loadData() {
    var savedTeachers = localStorage.getItem('teachers');
    var savedSchedule = localStorage.getItem('schedule');

    if (savedTeachers) {
        teachers = JSON.parse(savedTeachers);
    }

    if (savedSchedule) {
        schedule = JSON.parse(savedSchedule);
        document.getElementById('viewBox').style.display = '';
    }

    renderTeachers();

    if (schedule) {
        renderTable();
    }
}

function addTeacher() {
    var name     = document.getElementById('tName').value.trim();
    var subject  = document.getElementById('tSubject').value;
    var priority = document.getElementById('tPriority').value;

    if (!name) {
        alert('Enter teacher name');
        return;
    }

    var selectedDays = [];
    for (var i = 0; i < DAYS.length; i++) {
        var checkbox = document.getElementById('day-' + DAYS[i]);
        if (checkbox && checkbox.checked) {
            selectedDays.push(DAYS[i]);
        }
    }

    var selectedPeriods = [];
    for (var i = 0; i < CLASS_PERIODS.length; i++) {
        var checkbox = document.getElementById('period-' + CLASS_PERIODS[i].id);
        if (checkbox && checkbox.checked) {
            selectedPeriods.push(CLASS_PERIODS[i].id);
        }
    }

    if (selectedDays.length < 3) {
        alert('Select at least 3 days');
        return;
    }
    if (selectedDays.length > 6) {
        alert('Select at most 6 days');
        return;
    }

    if (selectedPeriods.length < 3) {
        alert('Select at least 3 periods');
        return;
    }
    if (selectedPeriods.length > 5) {
        alert('Select at most 5 periods');
        return;
    }

    teachers.push({
        id:       Date.now(),
        name:     name,
        subject:  subject,
        priority: priority,
        days:     selectedDays,
        periods:  selectedPeriods
    });

    document.getElementById('tName').value = '';

    // uncheck all boxes after adding
    for (var i = 0; i < DAYS.length; i++) {
        var checkbox = document.getElementById('day-' + DAYS[i]);
        if (checkbox) checkbox.checked = false;
    }
    for (var i = 0; i < CLASS_PERIODS.length; i++) {
        var checkbox = document.getElementById('period-' + CLASS_PERIODS[i].id);
        if (checkbox) checkbox.checked = false;
    }

    renderTeachers();
    saveData();
}

function removeTeacher(teacherId) {
    teachers = teachers.filter(function(t) { return t.id !== teacherId; });
    renderTeachers();
    saveData();
}

function renderTeachers() {
    var el = document.getElementById('teacherList');

    if (!teachers.length) {
        el.innerHTML = '<p>No teachers yet.</p>';
        return;
    }

    var html = '';
    html += '<table style="width:100%; border-collapse: collapse; font-size: 13px;">';
    html += '<thead>';
    html += '<tr style="background: rgba(255,255,255,0.1);">';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.2);">#</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.2);">Teacher</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.2);">Subject</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.2);">Priority</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.2);">Days</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.2);">Periods</th>';
    html += '<th style="padding: 8px; text-align: center; border-bottom: 2px solid rgba(255,255,255,0.2);">Action</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (var i = 0; i < teachers.length; i++) {
        var t = teachers[i];
        
        var periodNames = [];
        for (var j = 0; j < t.periods.length; j++) {
            for (var k = 0; k < PERIODS.length; k++) {
                if (PERIODS[k].id === t.periods[j] && !PERIODS[k].isBreak) {
                    periodNames.push(PERIODS[k].name.replace('Period ', 'P'));
                    break;
                }
            }
        }
        
        var priorityText = t.priority === 'high' ? '🔴 High' : (t.priority === 'medium' ? '🟡 Medium' : '🟢 Low');
        
        html += '<tr style="border-bottom: 1px solid rgb(0, 0, 0);">';
        html += '<td style="padding: 8px; color: rgb(0, 0, 0);">' + (i + 1) + '</td>';
        html += '<td style="padding: 8px; font-weight: 600;">' + t.name + '</td>';
        html += '<td style="padding: 8px;">' + SNAME[t.subject] + '</td>';
        html += '<td style="padding: 8px;">' + priorityText + '</td>';
        html += '<td style="padding: 8px; font-size: 12px;">' + t.days.join(', ') + '</td>';
        html += '<td style="padding: 8px; font-size: 12px;">' + periodNames.join(', ') + '</td>';
        html += '<td style="padding: 8px; text-align: center;">';
        html += '<button onclick="removeTeacher(' + t.id + ')" style="background: rgba(255,59,48,0.2); color: #ff6b6b; border: 1px solid rgba(255,59,48,0.3); padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">✕</button>';
        html += '</td>';
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';
    
    html += '<div style="margin-top: 10px; color: rgb(0, 0, 0); font-size: 13px;">';
    html += 'Total Teachers: <strong style="color: black;">' + teachers.length + '</strong>';
    html += ' | Active: <strong style="color: #6bcb77;">' + teachers.length + '</strong>';
    html += '</div>';

    el.innerHTML = html;
}
function generate() {

    if (!teachers.length) {
        document.getElementById('genMsg').innerHTML = '<div class="warn">Add at least one teacher first.</div>';
        return;
    }

    // sort teachers by priority — high first, medium second, low last
    var priorityValue = { 'high': 1, 'medium': 2, 'low': 3 };
    teachers.sort(function(a, b) {
        return priorityValue[a.priority] - priorityValue[b.priority];
    });

    schedule = {};

    for (var d = 0; d < DAYS.length; d++) {
        var day = DAYS[d];
        schedule[day] = {};

        for (var c = 0; c < CLASSES.length; c++) {
            var className = CLASSES[c];
            schedule[day][className] = {};

            var subjectOrder = [];
            for (var s = 0; s < SUBJECTS.length; s++) {
                var rotatedIndex = (s + c + d) % SUBJECTS.length;
                subjectOrder.push(SUBJECTS[rotatedIndex]);
            }

            for (var p = 0; p < CLASS_PERIODS.length; p++) {
                var period  = CLASS_PERIODS[p];
                var subject = subjectOrder[p % subjectOrder.length];

                var picked = null;
                for (var t2 = 0; t2 < teachers.length; t2++) {
                    var teacher = teachers[t2];

                    var teachesSubject   = teacher.subject === subject;
                    var worksThisDay     = teacher.days.indexOf(day) !== -1;
                    var availThisPeriod  = teacher.periods.indexOf(period.id) !== -1;

                    if (teachesSubject && worksThisDay && availThisPeriod) {
                        picked = teacher;
                        break;
                    }
                }

                if (picked) {
                    schedule[day][className][period.id] = {
                        subject:  subject,
                        teacher:  picked.name,
                        priority: picked.priority
                    };
                } else {
                    schedule[day][className][period.id] = {
                        subject:  subject,
                        teacher:  '—',
                        priority: ''
                    };
                }
            }
        }
    }

    document.getElementById('genMsg').innerHTML = '<div class="ok">Schedule generated!</div>';
    document.getElementById('viewBox').style.display = '';
    renderTable();
    saveData();
}

function renderTable() {
    var selectedClass = document.getElementById('classSelect').value;
    if (!schedule) return;

    var thead = '<thead><tr><th>Period</th><th>Time</th>';
    for (var i = 0; i < DAYS.length; i++) {
        thead += '<th>' + DAYS[i] + '</th>';
    }
    thead += '</tr></thead>';

    var tbody = '<tbody>';

    for (var p = 0; p < PERIODS.length; p++) {
        var period = PERIODS[p];

        if (period.isBreak) {
            var totalCols = DAYS.length + 2;
            tbody += '<tr class="break-row">';
            tbody += '<td colspan="' + totalCols + '">' + period.name + ' (' + period.time + ')</td>';
            tbody += '</tr>';

        } else {
            tbody += '<tr>';
            tbody += '<td>' + period.name + '</td>';
            tbody += '<td>' + period.time + '</td>';

            for (var d = 0; d < DAYS.length; d++) {
                var day   = DAYS[d];
                var entry = schedule[day] && schedule[day][selectedClass] && schedule[day][selectedClass][period.id];

                if (entry && entry.teacher !== '—') {
                    tbody += '<td>';
                    tbody += '<strong>' + SNAME[entry.subject] + '</strong><br>';
                    tbody += entry.teacher + '<br>';
                    tbody += '<small>' + entry.priority + '</small>';
                    tbody += '</td>';
                } else {
                    tbody += '<td>—</td>';
                }
            }

            tbody += '</tr>';
        }
    }

    tbody += '</tbody>';
    document.getElementById('tableOut').innerHTML = '<table>' + thead + tbody + '</table>';
}

function renderAvailableTeachers() {
    var selectedGrade = document.getElementById('gradeSelect').value;
    var selectedDay   = document.getElementById('daySelect').value;

    if (!schedule) {
        document.getElementById('availableOut').innerHTML =
            '<div class="warn">Generate schedule first.</div>';
        return;
    }

    var html = '<h3>Free Teachers for ' + selectedGrade + ' on ' + selectedDay + '</h3>';

    for (var p = 0; p < CLASS_PERIODS.length; p++) {
        var period = CLASS_PERIODS[p];

        var freeTeachers = [];

        for (var t = 0; t < teachers.length; t++) {
            var teacher = teachers[t];

            var worksThisDay =
                teacher.days.indexOf(selectedDay) !== -1;

            var availThisPeriod =
                teacher.periods.indexOf(period.id) !== -1;

            if (!worksThisDay || !availThisPeriod) {
                continue;
            }

            // Check if teacher is already teaching this grade
            var assignedTeacher =
                schedule[selectedDay][selectedGrade][period.id].teacher;

            if (assignedTeacher !== teacher.name) {
                freeTeachers.push(
                    teacher.name + ' (' + SNAME[teacher.subject] + ')'
                );
            }
        }

        html += '<div>';
        html += '<strong>' + period.name + ' ' + period.time + ':</strong> ';

        if (freeTeachers.length) {
            html += freeTeachers.join(', ');
        } else {
            html += '<span style="color:#999">No free teachers</span>';
        }

        html += '</div>';
    }

    document.getElementById('availableOut').innerHTML = html;
}

window.onload = function () {
    loadData();
    
};
function toggleWideMode() {
    var isChecked = document.getElementById('wideModeToggle').checked;
    if (isChecked) {
        document.body.classList.add('wide-mode');
        localStorage.setItem('wideMode', 'true');
    } else {
        document.body.classList.remove('wide-mode');
        localStorage.setItem('wideMode', 'false');
    }
}

function loadWideMode() {
    var wideMode = localStorage.getItem('wideMode');
    if (wideMode === 'true') {
        document.getElementById('wideModeToggle').checked = true;
        document.body.classList.add('wide-mode');
    }
}
