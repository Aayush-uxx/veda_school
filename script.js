const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const PERIODS = [
  { id:1, name:'Period 1',    time:'10:00-10:45', isBreak:false },
  { id:2, name:'Period 2',    time:'10:45-11:30', isBreak:false },
  { id:3, name:'Short Break', time:'11:30-11:45', isBreak:true  },
  { id:4, name:'Period 3',    time:'11:45-12:30', isBreak:false },
  { id:5, name:'Period 4',    time:'12:30-1:15',  isBreak:false },
  { id:6, name:'Lunch Break', time:'1:15-2:00',   isBreak:true  },
  { id:7, name:'Period 5',    time:'2:00-2:45',   isBreak:false },
  { id:8, name:'Period 6',    time:'2:45-3:30',   isBreak:false },
  { id:9, name:'Short Break', time:'3:30-3:45',   isBreak:true  },
  { id:10, name:'Period 7',   time:'3:45-4:30',   isBreak:false },
];
let teacher = [];
function addTeacher() {
  const periodExists = teacher.some(t => t.period === Period);
  if (periodExists) {
      document.getElementById("error").
      alert("This period already has a teacher!");
      return;
  }
  const Name = document.getElementById("tName").value.trim();
const Subject = document.getElementById("tSubject").value;
const Type = document.getElementById("tType").value;
const Period = document.getElementById("tPeriod").value;
  if (!Name || !Subject || !Type || !Period) {
    const valid = document.getElementById("error");
    return (valid.innerHTML = "All fields are required");
  } else {
    document.getElementById("error").innerHTML = "";
  }
  teacher.push({
    name: Name,
    subject: Subject,
    type: Type,
    period: `Period ${Period}`,
  });
  const tList = document.getElementById("teacherList");
  tList.innerHTML =teacher.map(t=>`<div>${t.name} ${t.subject} ${t.type} ${t.period}<br><div>`).join("") ;
  document.getElementById("teacherForm").reset();
}
function generate(){
  const message = document.getElementById("genMsg");
  if(teacher.length==0){
    message.innerHTML=`No teachers are Added !`
    return;
  }
  let html =  `
  <table>
    <thead>
       <tr>
          <th> Day/Periods </th>
          ${
            PERIODS.map(p => `<th>${p.name} <br> ${p.time}</th>`).join("")
          }
       </tr>
    </thead>
    <tbody>
          ${
            DAYS.map(day => `<tr>
              <td>${day}</td>
              ${
                PERIODS.map(p => `<td>${p.name}</td>`).join("")
              }
            </tr>`).join("")
          }
    </tbody>
  </table>
  `

  message.innerHTML = html;
}
