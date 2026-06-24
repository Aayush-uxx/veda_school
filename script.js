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

const CLASSES = [
    'Grade 1-A', 'Grade 1-B',
    'Grade 2-A', 'Grade 2-B',
    'Grade 3-A', 'Grade 3-B',
    'Grade 4-A', 'Grade 4-B',
    'Grade 5-A', 'Grade 5-B'
];

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
var selectedGradesList = [];

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
    var name = document.getElementById('tName').value.trim();
    var subject = document.getElementById('tSubject').value;
    var priority = document.getElementById('tPriority').value;
    var grade = document.getElementById('tGrade').value;

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
        id: Date.now(),
        name: name,
        subject: subject,
        priority: priority,
        grade: grade,
        days: selectedDays,
        periods: selectedPeriods
    });

    document.getElementById('tName').value = '';

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
    html += '<tr style="background: rgba(0,0,0,0.1);">';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">#</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">Teacher</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">Subject</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">Grade</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">Priority</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">Days</th>';
    html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.2);">Periods</th>';
    html += '<th style="padding: 8px; text-align: center; border-bottom: 2px solid rgba(0,0,0,0.2);">Action</th>';
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
        
        var priorityText = t.priority === 'high' ? 'High' : (t.priority === 'medium' ? 'Medium' : 'Low');
        
        html += '<tr style="border-bottom: 1px solid rgba(0,0,0,0.08);">';
        html += '<td style="padding: 8px; color: rgba(0,0,0,0.5);">' + (i + 1) + '</td>';
        html += '<td style="padding: 8px; font-weight: 600;">' + t.name + '</td>';
        html += '<td style="padding: 8px;">' + SNAME[t.subject] + '</td>';
        html += '<td style="padding: 8px; font-weight: 500; color: #4CAF50;">' + t.grade + '</td>';
        html += '<td style="padding: 8px;">' + priorityText + '</td>';
        html += '<td style="padding: 8px; font-size: 12px;">' + t.days.join(', ') + '</td>';
        html += '<td style="padding: 8px; font-size: 12px;">' + periodNames.join(', ') + '</td>';
        html += '<td style="padding: 8px; text-align: center;">';
        html += '<button onclick="removeTeacher(' + t.id + ')" style="background: rgba(255,59,48,0.2); color: #ff6b6b; border: 1px solid rgba(255,59,48,0.3); padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">Remove</button>';
        html += '</td>';
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';
    
    html += '<div style="margin-top: 10px; color: rgba(0,0,0,0.6); font-size: 13px;">';
    html += 'Total Teachers: <strong style="color: black;">' + teachers.length + '</strong>';
    html += '</div>';

    el.innerHTML = html;
}

function generate() {
    if (!teachers.length) {
        document.getElementById('genMsg').innerHTML = '<div class="warn">Add at least one teacher first.</div>';
        return;
    }

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
                var period = CLASS_PERIODS[p];
                var subject = subjectOrder[p % subjectOrder.length];

                var picked = null;
                for (var t2 = 0; t2 < teachers.length; t2++) {
                    var teacher = teachers[t2];

                    var teachesSubject = teacher.subject === subject;
                    var worksThisDay = teacher.days.indexOf(day) !== -1;
                    var availThisPeriod = teacher.periods.indexOf(period.id) !== -1;

                    if (teachesSubject && worksThisDay && availThisPeriod) {
                        picked = teacher;
                        break;
                    }
                }

                if (picked) {
                    schedule[day][className][period.id] = {
                        subject: subject,
                        teacher: picked.name,
                        priority: picked.priority
                    };
                } else {
                    schedule[day][className][period.id] = {
                        subject: subject,
                        teacher: '—',
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
                var day = DAYS[d];
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
    var selectedDay = document.getElementById('daySelect').value;

    if (!schedule) {
        document.getElementById('availableOut').innerHTML =
            '<div class="warn">Generate schedule first.</div>';
        return;
    }

    var html = '<h3>Available Teachers for ' + selectedGrade + ' on ' + selectedDay + '</h3>';
    html += '<table style="width:100%; border-collapse: collapse; font-size: 13px; margin-top: 10px;">';
    html += '<thead>';
    html += '<tr style="background: #4CAF50; color: white;">';
    html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Period</th>';
    html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Time</th>';
    html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Free Teachers</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (var p = 0; p < CLASS_PERIODS.length; p++) {
        var period = CLASS_PERIODS[p];
        var freeTeachers = [];

        for (var t = 0; t < teachers.length; t++) {
            var teacher = teachers[t];

            var worksThisDay = teacher.days.indexOf(selectedDay) !== -1;
            var availThisPeriod = teacher.periods.indexOf(period.id) !== -1;

            if (!worksThisDay || !availThisPeriod) {
                continue;
            }

            var assignedTeacher = schedule[selectedDay][selectedGrade][period.id].teacher;

            if (assignedTeacher !== teacher.name) {
                freeTeachers.push(teacher.name + ' (' + SNAME[teacher.subject] + ')');
            }
        }

        html += '<tr style="border-bottom: 1px solid #ddd;">';
        html += '<td style="padding: 10px; border: 1px solid #ddd; font-weight: 600;">' + period.name + '</td>';
        html += '<td style="padding: 10px; border: 1px solid #ddd;">' + period.time + '</td>';
        html += '<td style="padding: 10px; border: 1px solid #ddd;">';

        if (freeTeachers.length) {
            html += '<span style="display: inline-block; background: #d4edda; color: #155724; padding: 4px 10px; border-radius: 4px; margin: 2px;">';
            html += freeTeachers.join('</span><span style="display: inline-block; background: #d4edda; color: #155724; padding: 4px 10px; border-radius: 4px; margin: 2px;">');
            html += '</span>';
        } else {
            html += '<span style="color: #999; font-style: italic;">No free teachers</span>';
        }

        html += '</td>';
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';

    document.getElementById('availableOut').innerHTML = html;
}

function toggleGrade(grade) {
    var index = selectedGradesList.indexOf(grade);
    if (index === -1) {
        selectedGradesList.push(grade);
    } else {
        selectedGradesList.splice(index, 1);
    }
    renderCumulativeTable();
}

function selectAllGrades() {
    if (selectedGradesList.length === CLASSES.length) {
        selectedGradesList = [];
    } else {
        selectedGradesList = CLASSES.slice();
    }
    renderCumulativeTable();
}

function renderCumulativeTable() {
    if (!schedule) {
        document.getElementById('cumulativeOut').innerHTML = 
            '<div class="warn">Generate the schedule first.</div>';
        return;
    }

    if (selectedGradesList.length === 0) {
        document.getElementById('cumulativeOut').innerHTML = 
            '<div class="info">Select at least one grade to view.</div>';
        return;
    }

    var html = '<h3>Schedule for Selected Grades</h3>';
    html += '<div style="margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">';
    html += '<button onclick="selectAllGrades()" style="padding: 6px 12px; font-size: 13px;">';
    html += selectedGradesList.length === CLASSES.length ? 'Deselect All' : 'Select All';
    html += '</button>';
    html += '</div>';

    html += '<div style="overflow-x: auto;">';
    html += '<table style="width:100%; border-collapse: collapse; font-size: 12px;">';
    html += '<thead>';
    html += '<tr style="background: #4CAF50; color: white;">';
    html += '<th style="padding: 8px; border: 1px solid #ddd;">Period</th>';
    html += '<th style="padding: 8px; border: 1px solid #ddd;">Time</th>';
    
    for (var g = 0; g < selectedGradesList.length; g++) {
        var grade = selectedGradesList[g];
        html += '<th style="padding: 8px; border: 1px solid #ddd;" colspan="2">' + grade + '</th>';
    }
    html += '</tr>';
    
    html += '<tr style="background: rgba(0,0,0,0.05);">';
    html += '<th style="padding: 4px; border: 1px solid #ddd;"></th>';
    html += '<th style="padding: 4px; border: 1px solid #ddd;"></th>';
    for (var g = 0; g < selectedGradesList.length; g++) {
        html += '<th style="padding: 4px; border: 1px solid #ddd; font-size: 10px;">Subject</th>';
        html += '<th style="padding: 4px; border: 1px solid #ddd; font-size: 10px;">Teacher</th>';
    }
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (var p = 0; p < PERIODS.length; p++) {
        var period = PERIODS[p];
        
        html += '<tr>';
        html += '<td style="padding: 8px; border: 1px solid #ddd; font-weight: 600;">' + period.name + '</td>';
        html += '<td style="padding: 8px; border: 1px solid #ddd;">' + period.time + '</td>';
        
        if (period.isBreak) {
            var breakCols = selectedGradesList.length * 2;
            html += '<td colspan="' + breakCols + '" style="padding: 8px; border: 1px solid #ddd; text-align: center; background: #f0f0f0; font-style: italic;">' + period.name + '</td>';
        } else {
            for (var g = 0; g < selectedGradesList.length; g++) {
                var grade = selectedGradesList[g];
                var day = DAYS[0];
                
                var entry = schedule[day] && schedule[day][grade] && schedule[day][grade][period.id];
                
                if (entry && entry.teacher !== '—') {
                    html += '<td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">' + SNAME[entry.subject] + '</td>';
                    html += '<td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-size: 11px;">' + entry.teacher + '</td>';
                } else {
                    html += '<td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #999;">—</td>';
                    html += '<td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #999;">—</td>';
                }
            }
        }
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';
    html += '</div>';

    html += '<div style="margin-top: 15px;">';
    html += '<button onclick="printCumulative()" style="padding: 8px 20px;">Print Schedule</button>';
    html += '</div>';

    document.getElementById('cumulativeOut').innerHTML = html;
}

function printCumulative() {
    var content = document.getElementById('cumulativeOut').innerHTML;
    var printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>School Timetable</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; font-size: 12px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }');
    printWindow.document.write('th { background: #4CAF50; color: white; }');
    printWindow.document.write('.break-row { background: #f0f0f0; font-style: italic; }');
    printWindow.document.write('@media print { button { display: none; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2 style="text-align:center;">School Timetable</h2>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function exportToExcel() {
    if (!schedule) {
        alert('Generate the schedule first.');
        return;
    }

    var selectedGrades = [];
    var checkboxes = document.querySelectorAll('.grade-checkbox:checked');
    if (checkboxes.length > 0) {
        for (var i = 0; i < checkboxes.length; i++) {
            selectedGrades.push(checkboxes[i].value);
        }
    } else {
        selectedGrades = CLASSES.slice();
    }

    var csvContent = '\uFEFF';
    var headers = ['Period', 'Time'];
    
    for (var d = 0; d < DAYS.length; d++) {
        headers.push(DAYS[d]);
    }
    csvContent += headers.join(',') + '\n';

    for (var g = 0; g < selectedGrades.length; g++) {
        var grade = selectedGrades[g];
        csvContent += '\n"' + grade + '"\n';
        
        for (var p = 0; p < PERIODS.length; p++) {
            var period = PERIODS[p];
            var row = [];
            
            if (period.isBreak) {
                row.push(period.name, period.time);
                for (var d = 0; d < DAYS.length; d++) {
                    row.push('---');
                }
            } else {
                row.push(period.name, period.time);
                for (var d = 0; d < DAYS.length; d++) {
                    var day = DAYS[d];
                    var entry = schedule[day] && schedule[day][grade] && schedule[day][grade][period.id];
                    if (entry && entry.teacher !== '—') {
                        row.push(entry.subject.toUpperCase() + ' - ' + entry.teacher);
                    } else {
                        row.push('—');
                    }
                }
            }
            csvContent += row.join(',') + '\n';
        }
        csvContent += '\n';
    }

    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'timetable_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.onload = function () {
    loadData();
};
