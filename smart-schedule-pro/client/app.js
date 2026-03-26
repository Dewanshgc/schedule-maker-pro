let token = localStorage.getItem("token");
const API = "http://localhost:5000/api";

if (token) initApp();

function register() {
fetch(`${API}/auth/register`, {
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
name: name.value,
email: email.value,
password: password.value
})
}).then(()=>alert("Registered"));
}

function login() {
fetch(`${API}/auth/login`, {
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
email: email.value,
password: password.value
})
})
.then(res=>res.json())
.then(data=>{
localStorage.setItem("token",data.token);
token=data.token;
initApp();
});
}

function initApp(){
authSection.style.display="none";
appSection.style.display="block";
loadTasks();
initCalendar();
}

async function loadTasks(){
const res=await fetch(`${API}/tasks`,{
headers:{Authorization:token}
});
const tasks=await res.json();
renderCharts(tasks);
}

function renderCharts(tasks){
const completed=tasks.filter(t=>t.completed).length;
const total=tasks.length;
const percent=total?Math.round(completed/total*100):0;

new Chart(weeklyRing,{
type:"doughnut",
data:{
datasets:[{
data:[percent,100-percent],
backgroundColor:["#00ffcc","#eee"]
}]
},
options:{cutout:"70%"}
});
}

function initCalendar(){
const calendar=new FullCalendar.Calendar(document.getElementById("calendar"),{
initialView:"dayGridMonth"
});
calendar.render();
}

function toggleTheme(){
document.body.classList.toggle("light");
}

function exportExcel(){
fetch(`${API}/tasks`,{headers:{Authorization:token}})
.then(res=>res.json())
.then(tasks=>{
const ws=XLSX.utils.json_to_sheet(tasks);
const wb=XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb,ws,"Tasks");
XLSX.writeFile(wb,"tasks.xlsx");
});
}

function exportPDF(){
fetch(`${API}/tasks`,{headers:{Authorization:token}})
.then(res=>res.json())
.then(tasks=>{
const {jsPDF}=window.jspdf;
const doc=new jsPDF();
tasks.forEach((t,i)=>{
doc.text(`${t.title} - ${t.completed}`,10,10+i*10);
});
doc.save("tasks.pdf");
});
}

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("service-worker.js");
}