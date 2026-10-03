
document.addEventListener("DOMContentLoaded", async () => {
    const setText = (el, value) => {
        if (el) el.textContent = value;
    };

    const cardByLabel = (label) => {
        return [...document.querySelectorAll(".cards .card")].find(card =>
            card.querySelector("p")?.textContent.trim() === label
        );
    };

    try {
        const [patientStats, todayAppointments, patients, appointments, reports] = await Promise.all([
            apiRequest("/patients/stats"),
            apiRequest("/appointments/today"),
            apiRequest("/patients?limit=5"),
            apiRequest("/appointments?limit=5"),
            apiRequest("/reports?limit=5")
        ]);

        const stats = patientStats.statistics || {};
        const today = todayAppointments.appointments || [];
        const recentPatients = patients.patients || [];
        const recentAppointments = appointments.appointments || [];
        const recentReports = reports.reports || [];

        setText(cardByLabel("Total Patients")?.querySelector("h2"), stats.totalPatients ?? 0);
        setText(cardByLabel("Today's Appointments")?.querySelector("h2"), today.length);

        const tbody = document.querySelector(".table-card table tbody");
        if (tbody) {
            tbody.innerHTML = recentPatients.map((p, i) => `
                <tr>
                    <td>
                        <div class="patient">
                            <img src="${p.profileImage || `https://i.pravatar.cc/60?img=${5+i}`}" alt="">
                            <div>
                                <h4>${p.firstName || ""} ${p.lastName || ""}</h4>
                                <p>ID : ${p.patientId || "N/A"}</p>
                            </div>
                        </div>
                    </td>
                    <td>${p.department || "N/A"}</td>
                    <td><span class="status-badge">${p.status || "Healthy"}</span></td>
                    <td>${p.assignedDoctor || "N/A"}</td>
                    <td><div class="action-btn" data-patient="${p._id}"><i class="fa-solid fa-eye"></i></div></td>
                </tr>
            `).join("");

            tbody.querySelectorAll("[data-patient]").forEach(btn => {
                btn.addEventListener("click", () => location.href = `patient-details.html?id=${btn.dataset.patient}`);
            });
        }

        document.querySelectorAll(".table-header button").forEach(btn => {
            if (btn.textContent.trim().toLowerCase() === "view all") {
                btn.onclick = () => location.href = "patients.html";
            }
        });

        document.querySelectorAll(".hero-right button").forEach(btn => {
            const text = btn.textContent.toLowerCase();
            btn.onclick = () => {
                if (text.includes("patient")) location.href = "patients.html";
                else if (text.includes("schedule")) location.href = "appointments.html";
                else location.href = "reports.html";
            };
        });

        const activity = document.querySelector(".timeline");
        if (activity) {
            const items = [
                ...recentAppointments.map(a => ({
                    title: `Appointment: ${a.status || "Scheduled"}`,
                    body: `${a.patient?.firstName || "Patient"} ${a.patient?.lastName || ""} with ${a.doctor?.fullName || "Doctor"}`
                })),
                ...recentReports.map(r => ({
                    title: `Report: ${r.reportStatus || "Pending"}`,
                    body: r.reportTitle || "Medical report"
                }))
            ].slice(0, 4);

            if (items.length) {
                activity.innerHTML = items.map(x => `<div class="event"><h4>${x.title}</h4><p>${x.body}</p></div>`).join("");
            }
        }
    } catch (error) {
        console.warn("Dashboard live data unavailable:", error.message);
    }
});
