const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
const PERIODS = [
  { id:1, name:'Period 1',    time:'10:00-10:45', isBreak:false },
  { id:2, name:'Period 2',    time:'10:45-11:30', isBreak:false },
  { id:3, name:'Short Break', time:'11:30-11:45', isBreak:true  },
  { id:4, name:'Period 3',    time:'11:45-12:30', isBreak:false },
  { id:5, name:'Period 4',    time:'12:30-1:15',  isBreak:false },
  { id:6, name:'Lunch Break', time:'1:15-2:00',   isBreak:true  },
  { id:7, name:'Period 5',    time:'2:00-2:45',   isBreak:false }, 
];
const SUBJECTS = ['Math', 'English', 'Nepali', 'Science', 'Social'];
const CLASS_PERIODS = [1, 2, 4, 5, 7];

function getSubjectForPeriod(gradeIndex, periodId) {
  const periodIndex = CLASS_PERIODS.indexOf(periodId);
  if (periodIndex === -1) return null;
  return SUBJECTS[(periodIndex + gradeIndex) % SUBJECTS.length];
}
let teacher = [];
function loadTeachers() {
  const saved = localStorage.getItem("teachers");
  if (saved) {
    teacher = JSON.parse(saved);
    displayTeachers();
  }
}
function saveTeachers() {
  localStorage.setItem("teachers", JSON.stringify(teacher));
}
function addTeacher() {
  const Name = document.getElementById("tName").value.trim();
  const Subject = document.getElementById("tSubject").value;
  const Grade = document.getElementById("tGrade").value;

  if (!Name || !Subject || !Grade) {
    document.getElementById("error").innerHTML = "Please enter teacher name, select subject and select grade";
    return;
  }

  const conflict = teacher.find(t => t.subject === Subject && t.grade === Grade);
  if (conflict) {
    document.getElementById("error").innerHTML = `${conflict.name} already teaches ${Subject} for ${Grade}`;
    return;
  }

  document.getElementById("error").innerHTML = "";
  teacher.push({ name: Name, subject: Subject, grade: Grade });

  saveTeachers();
  displayTeachers();
  document.getElementById("teacherForm").reset();
}
function displayTeachers() {
  const tList = document.getElementById("teacherList");
  if (teacher.length === 0) {
    tList.innerHTML = "<p>No teachers added yet.</p>";
    return;
  }
  tList.innerHTML = teacher.map((t, index) => `
    <div><strong>${t.subject}</strong> (${t.grade}): ${t.name}
    <button type="button" onclick="removeTeacher(${index})">Remove</button></div>
  `).join("");
}
function removeTeacher(index) {
  teacher.splice(index, 1);
  saveTeachers();
  displayTeachers();
} 
function generate() {
  const message = document.getElementById("genMsg");
  const selectedGrade = document.getElementById("gradeSelect").value;
  if (!selectedGrade) {
    message.innerHTML = "Please select a grade";
    return;
  }
  const gradeTeachers = teacher.filter(t => t.grade === selectedGrade);
  if (gradeTeachers.length === 0) {
    message.innerHTML = `No teachers assigned for ${selectedGrade}!`;
    return;
  }
  const tableExist = document.getElementById("table-" + selectedGrade) 
  if(tableExist){ document.getElementById("error").innerHTML=`Table aready exists`; return;}
  let html = `
  <div id="table-${selectedGrade}">
  <h3>${selectedGrade} Timetable</h3>
  <table>
    <thead>
      <tr>
        <th>Day/Period</th>
        ${PERIODS.map(p => `<th>${p.name}<br><small>${p.time}</small></th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${DAYS.map(day => `<tr>
        <td><strong>${day}</strong></td>
        ${PERIODS.map(period => `<td>${getSubjectAndTeacher(period.id, selectedGrade)}</td>`).join("")}
      </tr>`).join("")}
    </tbody>
  </table>
  </div>`;
  
  message.innerHTML += html;
}
function getSubjectAndTeacher(periodId, grade) {
  const gradeIndex = GRADES.indexOf(grade);
  const subjectName = getSubjectForPeriod(gradeIndex, periodId);
  if (!subjectName) return "Break";
  const teacherForSubject = teacher.find(t => t.subject === subjectName && t.grade === grade);
  return `${subjectName}<br><small>${teacherForSubject ? teacherForSubject.name : '-'}</small>`;
}
window.addEventListener("DOMContentLoaded", loadTeachers);