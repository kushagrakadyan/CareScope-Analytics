// ======================================================
// CareScope Analytics - charts.js
// ======================================================

Chart.defaults.font.family = "Inter";
Chart.defaults.color = "#64748b";
Chart.defaults.plugins.legend.position = "bottom";
Chart.defaults.plugins.legend.labels.usePointStyle = true;

// ======================================================
// Patient Growth
// ======================================================

const patientGrowth = document.getElementById("patientGrowthChart");

if (patientGrowth) {
new Chart(patientGrowth, {
type: "line",
data: {
labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
datasets: [{
label: "Patients",
data: [120,180,260,300,410,470,560],
borderColor: "#2563eb",
backgroundColor: "rgba(37,99,235,.15)",
fill: true,
tension: .4
}]
},
options:{
responsive:true,
maintainAspectRatio:false
}
});
}

// ======================================================
// Disease Distribution
// ======================================================

const diseaseChart=document.getElementById("diseaseChart");

if(diseaseChart){

new Chart(diseaseChart,{
type:"doughnut",

data:{

labels:[
"Diabetes",
"Cardiology",
"Neurology",
"Orthopedic",
"Others"
],

datasets:[{

data:[28,22,18,14,18],

backgroundColor:[
"#2563eb",
"#14b8a6",
"#f59e0b",
"#ef4444",
"#8b5cf6"
]

}]

},

options:{
responsive:true,
maintainAspectRatio:false
}

});

}

// ======================================================
// Recovery Trends
// ======================================================

const recovery=document.getElementById("recoveryChart");

if(recovery){

new Chart(recovery,{

type:"bar",

data:{

labels:[
"Mon","Tue","Wed","Thu","Fri","Sat","Sun"
],

datasets:[{

label:"Recovered",

data:[45,62,51,74,80,66,92],

backgroundColor:"#14b8a6"

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

});

}

// ======================================================
// Weekly Appointments
// ======================================================

const appointment=document.getElementById("appointmentChart");

if(appointment){

new Chart(appointment,{

type:"line",

data:{

labels:[
"Mon","Tue","Wed","Thu","Fri","Sat","Sun"
],

datasets:[{

label:"Appointments",

data:[
52,
60,
74,
81,
77,
65,
48
],

borderColor:"#2563eb",

backgroundColor:"rgba(37,99,235,.15)",

fill:true,

tension:.4

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

});

}

// ======================================================
// Department Distribution
// ======================================================

const department=document.getElementById("departmentChart");

if(department){

new Chart(department,{

type:"pie",

data:{

labels:[
"Emergency",
"ICU",
"Pediatrics",
"ENT",
"Cardiology"
],

datasets:[{

data:[
24,
19,
18,
17,
22
],

backgroundColor:[
"#2563eb",
"#14b8a6",
"#8b5cf6",
"#f59e0b",
"#ef4444"
]

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

});

}
// ======================================================
// AI Prediction Chart
// ======================================================

const predictionChart = document.getElementById("predictionChart");

if (predictionChart) {
    new Chart(predictionChart, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            datasets: [{
                label: "AI Predicted Patients",
                data: [310, 340, 390, 420, 470, 520, 580, 640],
                borderColor: "#7c3aed",
                backgroundColor: "rgba(124,58,237,.15)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Disease Trend Chart
// ======================================================

const diseaseTrendChart = document.getElementById("diseaseTrendChart");

if (diseaseTrendChart) {
    new Chart(diseaseTrendChart, {
        type: "bar",
        data: {
            labels: [
                "Diabetes",
                "Heart",
                "Cancer",
                "Asthma",
                "Kidney",
                "Other"
            ],
            datasets: [{
                label: "Cases",
                data: [180, 140, 96, 120, 82, 150],
                backgroundColor: [
                    "#2563eb",
                    "#14b8a6",
                    "#f59e0b",
                    "#ef4444",
                    "#7c3aed",
                    "#0ea5e9"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Recovery Analytics
// ======================================================

const analyticsRecoveryChart = document.getElementById("analyticsRecoveryChart");

if (analyticsRecoveryChart) {
    new Chart(analyticsRecoveryChart, {
        type: "line",
        data: {
            labels: [
                "Week 1",
                "Week 2",
                "Week 3",
                "Week 4",
                "Week 5",
                "Week 6"
            ],
            datasets: [{
                label: "Recovery %",
                data: [62, 68, 72, 81, 89, 95],
                borderColor: "#10b981",
                backgroundColor: "rgba(16,185,129,.15)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Department Performance
// ======================================================

const analyticsDepartmentChart = document.getElementById("analyticsDepartmentChart");

if (analyticsDepartmentChart) {
    new Chart(analyticsDepartmentChart, {
        type: "radar",
        data: {
            labels: [
                "Emergency",
                "ICU",
                "ENT",
                "Neurology",
                "Pediatrics",
                "Cardiology"
            ],
            datasets: [{
                label: "Performance",
                data: [90, 83, 74, 80, 88, 94],
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,.20)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Hospital Utilization
// ======================================================

const hospitalUtilizationChart = document.getElementById("hospitalUtilizationChart");

if (hospitalUtilizationChart) {
    new Chart(hospitalUtilizationChart, {
        type: "doughnut",
        data: {
            labels: [
                "Occupied",
                "Available",
                "Reserved"
            ],
            datasets: [{
                data: [68, 24, 8],
                backgroundColor: [
                    "#2563eb",
                    "#14b8a6",
                    "#f59e0b"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Reports Chart
// ======================================================

const reportsChart = document.getElementById("reportsChart");

if (reportsChart) {
    new Chart(reportsChart, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                label: "Generated Reports",
                data: [82, 95, 118, 140, 166, 201],
                backgroundColor: "#2563eb",
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Downloads Chart
// ======================================================

const downloadsChart = document.getElementById("downloadsChart");

if (downloadsChart) {
    new Chart(downloadsChart, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Downloads",
                data: [45, 52, 67, 73, 88, 76, 95],
                borderColor: "#14b8a6",
                backgroundColor: "rgba(20,184,166,.15)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Age Distribution
// ======================================================

const ageChart = document.getElementById("ageChart");

if (ageChart) {
    new Chart(ageChart, {
        type: "pie",
        data: {
            labels: [
                "0-18",
                "19-35",
                "36-50",
                "51-65",
                "65+"
            ],
            datasets: [{
                data: [14, 31, 27, 18, 10],
                backgroundColor: [
                    "#2563eb",
                    "#14b8a6",
                    "#f59e0b",
                    "#7c3aed",
                    "#ef4444"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Gender Distribution
// ======================================================

const genderChart = document.getElementById("genderChart");

if (genderChart) {
    new Chart(genderChart, {
        type: "doughnut",
        data: {
            labels: [
                "Male",
                "Female",
                "Other"
            ],
            datasets: [{
                data: [48, 49, 3],
                backgroundColor: [
                    "#2563eb",
                    "#ec4899",
                    "#14b8a6"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ======================================================
// Patient Recovery Comparison
// ======================================================

const patientRecoveryChart = document.getElementById("patientRecoveryChart");

if (patientRecoveryChart) {
    new Chart(patientRecoveryChart, {
        type: "line",
        data: {
            labels: [
                "Week 1",
                "Week 2",
                "Week 3",
                "Week 4",
                "Week 5",
                "Week 6"
            ],
            datasets: [
                {
                    label: "Recovered",
                    data: [22, 34, 48, 61, 75, 92],
                    borderColor: "#14b8a6",
                    backgroundColor: "rgba(20,184,166,.12)",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Critical",
                    data: [18, 16, 14, 12, 9, 6],
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239,68,68,.12)",
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}