
document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector(".patient-table tbody");
    const search = document.getElementById("patientSearch");
    let addButton = document.getElementById("addPatientBtn");

    if (!table) return;

    // Defensive fallback: always provide Add Patient on the patients page.
    if (!addButton) {
        const hero = document.querySelector(".hero .hero-right");
        if (hero) {
            hero.innerHTML = `<button id="addPatientBtn" type="button"><i class="fa-solid fa-user-plus"></i> Add Patient</button>`;
            addButton = document.getElementById("addPatientBtn");
        }
    }

    let patients = [];

    const esc = (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const statusClass = (status) => {
        const v = String(status || "").toLowerCase();
        if (v.includes("critical")) return "critical";
        if (v.includes("recover")) return "processing";
        if (v.includes("discharg")) return "completed";
        return "pending";
    };

    const render = (list = patients) => {
        table.innerHTML = list.length ? list.map(p => `
            <tr>
                <td>${esc(p.patientId)}</td>
                <td>
                    <div class="patient">
                        <img src="${esc(p.profileImage || "https://i.pravatar.cc/60?img=12")}" alt="">
                        <div><h4>${esc(`${p.firstName || ""} ${p.lastName || ""}`.trim())}</h4></div>
                    </div>
                </td>
                <td>${esc(p.age)}</td>
                <td>${esc(p.gender)}</td>
                <td>${esc(p.department)}</td>
                <td>${esc(p.assignedDoctor)}</td>
                <td><span class="status-badge ${statusClass(p.status)}">${esc(p.status)}</span></td>
                <td><button type="button" class="table-btn" data-view="${esc(p._id)}">View</button></td>
            </tr>
        `).join("") : `
            <tr><td colspan="8" style="text-align:center;padding:30px;">No patients found.</td></tr>
        `;

        table.querySelectorAll("[data-view]").forEach(btn => {
            btn.addEventListener("click", () => {
                location.href = `patient-details.html?id=${encodeURIComponent(btn.dataset.view)}`;
            });
        });
    };

    const deptSelect = document.querySelector(".appointment-form select");
    const applyFilters = () => {
        const q = (search?.value || "").trim().toLowerCase();
        const dept = deptSelect && !/^all/i.test(deptSelect.value) ? deptSelect.value : "";
        render(patients.filter(p =>
            (!dept || p.department === dept) &&
            `${p.patientId} ${p.firstName} ${p.lastName} ${p.department} ${p.assignedDoctor}`.toLowerCase().includes(q)
        ));
    };

    const loadStats = async () => {
        try {
            const res = await apiRequest("/patients/stats");
            const st = res.statistics || {};
            const cards = [...document.querySelectorAll(".cards .card h2")];
            const vals = [st.totalPatients, st.totalPatients - (st.discharged || 0), null, st.critical];
            cards.forEach((h, i) => { if (vals[i] !== null && vals[i] !== undefined && !Number.isNaN(vals[i])) h.textContent = vals[i]; });
            const sub = document.querySelector(".chart-card .card-header p");
            document.querySelectorAll(".card-header p").forEach(p => {
                if (/registered patients/i.test(p.textContent)) p.textContent = `${st.totalPatients ?? patients.length} Registered Patients`;
            });
        } catch (_) { /* stats are optional */ }
    };

    const exportCsv = () => {
        const rows = [["ID","First Name","Last Name","Age","Gender","Department","Doctor","Status"],
            ...patients.map(p => [p.patientId,p.firstName,p.lastName,p.age,p.gender,p.department,p.assignedDoctor,p.status])];
        const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = "patients.csv";
        document.body.appendChild(a); a.click(); a.remove();
    };
    document.querySelectorAll(".card-header .btn-light").forEach(b => {
        const t = b.textContent.trim().toLowerCase();
        if (t === "export") b.addEventListener("click", exportCsv);
        if (t === "filter") b.addEventListener("click", () => search?.focus());
    });
    deptSelect?.addEventListener("change", applyFilters);

    const load = async () => {
        try {
            const data = await apiRequest("/patients?limit=100");
            patients = data.patients || [];
            render();
            loadStats();
        } catch (error) {
            table.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;">${esc(error.message)}</td></tr>`;
        }
    };

    search?.addEventListener("input", applyFilters);

    addButton?.addEventListener("click", () => {
        const dialog = document.createElement("dialog");
        dialog.className = "patient-modal";
        dialog.innerHTML = `
            <div class="patient-modal-header">
                <div>
                    <span class="modal-kicker">Patient Management</span>
                    <h3>Add New Patient</h3>
                    <p>Enter the patient's basic information below.</p>
                </div>
                <button type="button" class="modal-close" aria-label="Close">&times;</button>
            </div>

            <form class="patient-form">
                <div class="form-grid">
                    <label>
                        <span>First Name *</span>
                        <input name="firstName" placeholder="Enter first name" required>
                    </label>
                    <label>
                        <span>Last Name *</span>
                        <input name="lastName" placeholder="Enter last name" required>
                    </label>
                    <label>
                        <span>Age *</span>
                        <input name="age" type="number" min="0" max="150" placeholder="Age" required>
                    </label>
                    <label>
                        <span>Gender *</span>
                        <select name="gender" required>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label>
                        <span>Blood Group</span>
                        <select name="bloodGroup"><option value="">Select (optional)</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
                    </label>
                    <label>
                        <span>Phone *</span>
                        <input name="phone" type="tel" placeholder="Phone number" required>
                    </label>
                    <label>
                        <span>Email</span>
                        <input name="email" type="email" placeholder="Email address">
                    </label>
                    <label>
                        <span>Department *</span>
                        <input name="department" placeholder="e.g. Cardiology" required>
                    </label>
                    <label>
                        <span>Assigned Doctor *</span>
                        <input name="assignedDoctor" placeholder="e.g. Dr. Emma Watson" required>
                    </label>
                    <label>
                        <span>Status</span>
                        <select name="status">
                            <option value="Healthy">Healthy</option>
                            <option value="Recovering">Recovering</option>
                            <option value="Observation">Observation</option>
                            <option value="Critical">Critical</option>
                            <option value="Discharged">Discharged</option>
                        </select>
                    </label>
                    <label class="full-width">
                        <span>Diagnosis</span>
                        <textarea name="diagnosis" rows="3" placeholder="Enter diagnosis / notes"></textarea>
                    </label>
                </div>

                <div class="modal-actions">
                    <button type="button" class="modal-cancel">Cancel</button>
                    <button type="submit" class="modal-save">
                        <i class="fa-solid fa-user-plus"></i> Save Patient
                    </button>
                </div>
            </form>
        `;

        document.body.appendChild(dialog);

        const form = dialog.querySelector(".patient-form");
        const close = () => {
            if (dialog.open) dialog.close();
            dialog.remove();
        };

        dialog.querySelector(".modal-close")?.addEventListener("click", close);
        dialog.querySelector(".modal-cancel")?.addEventListener("click", close);
        dialog.addEventListener("click", event => {
            if (event.target === dialog) close();
        });

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            Object.keys(data).forEach(k => { if (typeof data[k] === "string") data[k] = data[k].trim(); if (data[k] === "") delete data[k]; });
            data.age = Number(data.age);
            data.patientId = `PAT${Date.now().toString().slice(-6)}`;

            const saveButton = form.querySelector(".modal-save");
            saveButton.disabled = true;
            saveButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            try {
                await apiRequest("/patients", {
                    method: "POST",
                    body: JSON.stringify(data)
                });
                close();
                await load();
            } catch (error) {
                alert(error.message || "Could not save patient.");
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="fa-solid fa-user-plus"></i> Save Patient';
            }
        });

        dialog.addEventListener("cancel", event => {
            event.preventDefault();
            close();
        });

        dialog.showModal();
        dialog.querySelector('input[name="firstName"]')?.focus();
    });

    load();
});
