// ================== DOM ELEMENTS ==================
const dashboard = document.getElementById("dashboard");
const logBox = document.getElementById("logBox");
const outsideTemp = document.getElementById("outsideTemp");
const weather = document.getElementById("weather");
const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const manualBtn = document.getElementById("manual");
const modeIndicator = document.getElementById("modeIndicator");
const viewToggleBtn = document.getElementById("viewToggleBtn");

// ================== CONFIG ==================
const API_KEY = "af92777221c1474959c0f0dbc813c5db";
const city = "Johannesburg";

// ================== STATE ==================
let isUser = false;        // false = admin, true = user
let alarmOn = false;
let history = [];
const historyMax = 50;     // max entries for temp trend
let pies = {};
let isAuto = true;

// Disable manual controls initially
increaseBtn.disabled = true;
decreaseBtn.disabled = true;

// ================== DATA ==================
const apartments = [
    { id:101, gasOn:true, rooms:[ {room:1,pressure:60,temp:30}, {room:2,pressure:70,temp:35}, {room:3,pressure:50,temp:28}, {room:4,pressure:65,temp:40} ] },
    { id:102, gasOn:true, rooms:[ {room:1,pressure:72,temp:45}, {room:2,pressure:68,temp:38}, {room:3,pressure:55,temp:32}, {room:4,pressure:60,temp:36} ] },
    { id:103, gasOn:true, rooms:[ {room:1,pressure:50,temp:30}, {room:2,pressure:65,temp:40}, {room:3,pressure:70,temp:42}, {room:4,pressure:55,temp:35} ] },
    { id:104, gasOn:true, rooms:[ {room:1,pressure:80,temp:60}, {room:2,pressure:75,temp:50}, {room:3,pressure:68,temp:45}, {room:4,pressure:70,temp:48} ] }
];

// ================== VIEW TOGGLE ==================
function updateView() {
    const adminSection = document.querySelector(".admin");
    const manualControls = document.querySelector(".manual-controls");

    if (isUser) {
        if (adminSection) adminSection.style.display = "none";
        if (manualControls) manualControls.style.display = "none";
        modeIndicator.textContent = "⚙️ USER DASHBOARD";
        modeIndicator.style.color = "#22c55e";
        viewToggleBtn.textContent = "Switch to Admin View";
        ///here///
        // USER VIEW ENHANCEMENTS
addLog("👤 User view active");

// Calculate overall building risk
const allRooms = apartments.flatMap(a => a.rooms).filter(r => r.temp !== null);

if (allRooms.length > 0) {
    const avgRisk = allRooms.reduce((sum, r) => sum + calculateRisk(r.pressure, r.temp), 0) / allRooms.length;

    let status = "🟢 SAFE";
    if (avgRisk > 85) status = "🔴 DANGER";
    else if (avgRisk > 70) status = "🟠 HIGH RISK";
    else if (avgRisk > 50) status = "🟡 MODERATE";

    modeIndicator.textContent = `👤 USER DASHBOARD MODE INDICATOR| ${status}`;
}

// Optional: safety tip
const tips = [
    "💡 Check gas connections regularly",
    "💡 Keep windows ventilated",
    "💡 Report unusual smells immediately"
];

addLog(tips[Math.floor(Math.random() * tips.length)]);

// Force automation ON for safety
isAuto = true;
    } else {
        if (adminSection) adminSection.style.display = "block";
        if (manualControls) manualControls.style.display = "flex";
        modeIndicator.textContent = isAuto ? "⚙️ AUTO MODE" : "✋ MANUAL MODE";
        modeIndicator.style.color = isAuto ? "green" : "orange";
        viewToggleBtn.textContent = "Switch to User View";
    }
}
viewToggleBtn.addEventListener("click", () => { isUser = !isUser; updateView(); });
updateView();

// ================== WEATHER ==================
function getWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            outsideTemp.textContent = data.main.temp.toFixed(1);
            weather.textContent = data.weather[0].description;
        })
        .catch(() => addLog("⚠️ Weather fetch failed"));
}

// ================== RISK CALCULATION ==================
function calculateRisk(pressure, temp) {
    return (pressure * 0.6) + (temp * 0.4);
}

// ================== ROOM SIMULATION ==================
function simulateRoom(room) {
    room.pressure += Math.random() * 10 - 5;
    room.temp += Math.random() * 6 - 3;

    let status = "Normal", className = "normal";

    if (room.pressure > 95 || room.temp > 85) {
        status = "Emergency"; className = "emergency";
        triggerAlarm();
    } else if (room.pressure > 85 || room.temp > 70) {
        status = "Critical"; className = "critical";
    } else if (room.pressure > 65) {
        status = "Warning"; className = "warning";
    }

    return { status, className };
}

// ================== ALERTS ==================

// 🔓 Unlock audio on first user interaction (fixes browser blocking)
document.body.addEventListener("click", () => {
    const sound = document.getElementById("alarmSound");
    if (sound) {
        sound.play()
            .then(() => {
                sound.pause();
                sound.currentTime = 0;
            })
            .catch(() => {});
    }
}, { once: true });

function triggerAlarm() {
    if (!alarmOn) {
        alarmOn = true;

        const sound = document.getElementById("alarmSound");

        if (sound) {
            sound.currentTime = 0;
            sound.loop = true;

            sound.play().catch(err => {
                console.log("Audio blocked or failed:", err);
            });
        }

        showAlert("🚨 SABZA Gas Emergency!");
    }
}

function silenceAlarm() {
    alarmOn = false;

    const sound = document.getElementById("alarmSound");

    if (sound) {
        sound.pause();
        sound.currentTime = 0; // reset so it can replay
        sound.loop = false;
    }
}

// ================== SYSTEM CONTROL ==================
function shutdownGas() {
    apartments.forEach(a => {
        a.gasOn = false;
        a.rooms.forEach(r => { r.temp = null; r.pressure = null; });
    });
    isAuto = false;
    modeIndicator.textContent = "⛔ SYSTEM OFF";
    modeIndicator.style.color = "red";
    increaseBtn.disabled = true;
    decreaseBtn.disabled = true;
    addLog("🚫 SYSTEM SHUTDOWN");
    updateSystem();
}
function resetSystem() { location.reload(); }

// ================== ALERT UI ==================
function showAlert(msg) {
    const box = document.getElementById("alertBox");
    box.textContent = msg;
    box.style.display = "block";
    setTimeout(() => box.style.display = "none", 4000);
}

// ================== LOG ==================
function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    logBox.innerHTML = `<p>[${time}] ${msg}</p>` + logBox.innerHTML;
}

// ================== MODE TOGGLE ==================
manualBtn.addEventListener("click", () => {
    if (apartments.every(a => !a.gasOn)) { addLog("⚠️ System is OFF"); return; }

    isAuto = !isAuto;

    if (!isAuto) {
        modeIndicator.textContent = "✋ MANUAL MODE";
        modeIndicator.style.color = "orange";
        manualBtn.textContent = "Turn ON Automation";
        increaseBtn.disabled = false;
        decreaseBtn.disabled = false;
        addLog("Manual mode enabled");
    } else {
        modeIndicator.textContent = "⚙️ AUTO MODE";
        modeIndicator.style.color = "green";
        manualBtn.textContent = "Turn OFF Automation";
        increaseBtn.disabled = true;
        decreaseBtn.disabled = true;
        addLog("Automation enabled");
    }
});

// ================== DASHBOARD UPDATE ==================
function updateSystem() {
    dashboard.innerHTML = "";

    apartments.forEach(a => {
        // Calculate apartment risk
        const validRooms = a.rooms.filter(r => r.temp !== null);
        let riskPercent = 0;
        if (validRooms.length > 0) {
            const totalRisk = validRooms.reduce((sum,r)=>sum+calculateRisk(r.pressure,r.temp),0);
            const maxRisk = validRooms.length * 100;
            riskPercent = Math.min(100, Math.round((totalRisk/maxRisk)*100));
        }

        // Apartment card
        let html = `<div class="card"><h3>Apt ${a.id} (${a.gasOn?"Gas ON":"Gas OFF"})</h3>`;
        html += `<div class="risk-bar-container">
                    <label>Gas Leak Risk:</label>
                    <div class="risk-bar">
                        <div class="risk-fill" style="
                            width:${riskPercent}%;
                            background-color:${riskPercent>85?'red':riskPercent>70?'orange':riskPercent>50?'yellow':'green'};
                            transition: width 0.5s ease;
                        "></div>
                    </div>
                    <span>${riskPercent}%</span>
                 </div>`;

        // Rooms
        a.rooms.forEach(r => {
            let res = {status:"Normal",className:"normal"};
            if(!a.gasOn) res = {status:"OFF",className:"off"};
            else if(isAuto) res = simulateRoom(r);
            else {
                if(r.pressure>95||r.temp>85) res={status:"Emergency",className:"emergency"};
                else if(r.pressure>85||r.temp>70) res={status:"Critical",className:"critical"};
                else if(r.pressure>65) res={status:"Warning",className:"warning"};
            }

            const tempDisplay = r.temp===null?"--":r.temp.toFixed(1)+"°C";
            const pressureDisplay = r.pressure===null?"--":r.pressure.toFixed(1)+"%";

            html += `<div class="room">Room ${r.room} | Temp ${tempDisplay} | Pressure ${pressureDisplay} <span class="${res.className}">${res.status}</span></div>`;

            if(r.temp!==null) {
                history.push(r.temp);
                if(history.length>historyMax) history.shift();
            }
        });

        html += "</div>";
        dashboard.innerHTML += html;
    });

    updateCharts();
    updatePieCharts();
}

// ================== CHARTS ==================
let riskChart,tempChart;

function updateCharts() {
    const risks = apartments.map(a => {
        const valid = a.rooms.filter(r=>r.temp!==null);
        return valid.length===0?0:valid.reduce((sum,r)=>sum+calculateRisk(r.pressure,r.temp),0)/valid.length;
    });

    if(!riskChart){
        riskChart=new Chart(document.getElementById("riskChart"),{
            type:"bar",
            data:{labels:apartments.map(a=>"Apt "+a.id),datasets:[{label:"Risk",data:risks}]}
        });
    } else { riskChart.data.datasets[0].data=risks; riskChart.update(); }

    if(!tempChart){
        tempChart=new Chart(document.getElementById("tempChart"),{
            type:"line",
            data:{labels:history.map((_,i)=>i),datasets:[{label:"Temp Trend",data:history,borderColor:"blue",fill:false}]},
            options:{animation:{duration:0}}
        });
    } else { tempChart.data.datasets[0].data=history; tempChart.update(); }
}

// ================== PIE CHARTS ==================
function updatePieCharts(){
    apartments.forEach(a=>{
        const data = a.rooms.map(r => (r.temp===null||r.pressure===null)?0:calculateRisk(r.pressure,r.temp));
        const id = "pie"+a.id;
        const labels = a.rooms.map(r=>"Room "+r.room);

        if(!pies[id]){
            pies[id] = new Chart(document.getElementById(id),{
                type:"pie",
                data:{labels, datasets:[{data, backgroundColor:["#4ade80","#facc15","#f97316","#ef4444"]}]},
                options:{responsive:true,animation:{duration:500}}
            });
        } else { pies[id].data.datasets[0].data=data; pies[id].update(); }
    });
}

// ================== MANUAL BUTTONS ==================
increaseBtn.addEventListener("click",()=>{
    apartments.forEach(a=>a.rooms.forEach(r=>{
        if(r.temp!==null){ r.pressure=Math.min(110,r.pressure+5); r.temp=Math.min(100,r.temp+3); }
    }));
    addLog("⬆️ Increased values"); updateSystem();
});

decreaseBtn.addEventListener("click",()=>{
    apartments.forEach(a=>a.rooms.forEach(r=>{
        if(r.temp!==null){ r.pressure=Math.max(0,r.pressure-5); r.temp=Math.max(20,r.temp-3); }
    }));
    addLog("⬇️ Decreased values"); updateSystem();
});

// ================== TENANT ISSUE REPORT ==================
document.getElementById("send").addEventListener("click",()=>{
    const issue=document.getElementById("issue").value;
    const email=document.getElementById("adminEmail").value;
    if(!issue||!email){ alert("Please fill in both the issue and admin email."); return; }
    window.location.href=`mailto:${email}?subject=${encodeURIComponent("Tenant Issue Report")}&body=${encodeURIComponent("Issue reported:\n\n"+issue)}`;
});

document.getElementById("emergencyCallBtn").addEventListener("click", () => {

    const confirmCall = confirm("⚠️ Are you sure you want to call Emergency Services?");

    if (confirmCall) {
        window.location.href = "tel:0687629544"; // Fire & Ambulance (SA)
    }
    if (avgRisk > 85 && isUser) {
    document.getElementById("emergencyCallBtn").style.display = "block";
}
const choice = prompt("Call:\n1 - Fire/Ambulance\n2 - Police");

if (choice === "1") window.location.href = "tel:10177";
if (choice === "2") window.location.href = "tel:10111";
showAlert("🚨 Emergency detected! Please call authorities immediately.");
});

// ================== RUN SYSTEM ==================
updateSystem();
setInterval(updateSystem,3000);
getWeather();