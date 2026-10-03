// ======================================================
// CareScope Analytics
// Patient Details
// ======================================================


let currentPatient = null;

let currentPatientId = null;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePatientDetails();

    }
);


// ======================================================
// INITIALIZE
// ======================================================

function initializePatientDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    currentPatientId =
        params.get("id");


    if (!currentPatientId) {

        showError(
            "Patient ID is missing from the URL."
        );

        return;

    }


    setupActionButtons();

    loadPatientDetails();

}


// ======================================================
// ACTION BUTTONS
// ======================================================

function setupActionButtons() {

    const editButton =
        document.getElementById(
            "editPatientBtn"
        );


    const editButtonBottom =
        document.getElementById(
            "editPatientBtnBottom"
        );


    const dischargeButton =
        document.getElementById(
            "dischargePatientBtn"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            editPatient
        );

    }


    if (editButtonBottom) {

        editButtonBottom.addEventListener(
            "click",
            editPatient
        );

    }


    if (dischargeButton) {

        dischargeButton.addEventListener(
            "click",
            dischargePatient
        );

    }

}


// ======================================================
// LOAD PATIENT
// ======================================================

async function loadPatientDetails() {

    showLoading(true);

    hideError();


    try {

        const response =
            await apiRequest(
                `/patients/${encodeURIComponent(currentPatientId)}`
            );


        console.log(
            "Patient Details API:",
            response
        );


        const patient =
            response.patient ||
            response.data ||
            response;


        if (!patient) {

            throw new Error(
                "Patient record was not returned."
            );

        }


        currentPatient =
            patient;


        renderPatient(patient);


        showLoading(false);


        const content =
            document.getElementById(
                "patientDetailsContent"
            );


        if (content) {

            content.style.display =
                "flex";

        }

    }

    catch (error) {

        console.error(
            "Failed to load patient:",
            error
        );


        showLoading(false);


        showError(
            error.message ||
            "Unable to load patient details."
        );

    }

}


// ======================================================
// RENDER PATIENT
// ======================================================

function renderPatient(patient) {


    // ==================================================
    // BASIC VALUES
    // ==================================================

    const patientId =
        patient.patientId ||
        patient._id ||
        "N/A";


    const firstName =
        patient.firstName || "";


    const lastName =
        patient.lastName || "";


    const fullName =
        `${firstName} ${lastName}`
            .trim() ||
        "Unknown Patient";


    const status =
        patient.status ||
        "Healthy";


    const department =
        patient.department ||
        "Not assigned";


    const doctor =
        patient.assignedDoctor ||
        "Not assigned";


    // ==================================================
    // HERO
    // ==================================================

    setText(
        "patientName",
        fullName
    );


    setText(
        "patientId",
        `Patient ID: ${patientId}`
    );


    setText(
        "patientDepartment",
        department
    );


    setText(
        "patientDoctor",
        doctor
    );


    setText(
        "patientAdmission",
        formatDate(
            patient.admissionDate
        )
    );


    setText(
        "patientStatus",
        status
    );


    // ==================================================
    // PERSONAL INFORMATION
    // ==================================================

    setText(
        "detailPatientId",
        patientId
    );


    setText(
        "detailFullName",
        fullName
    );


    setText(
        "detailAge",
        patient.age !== undefined &&
        patient.age !== null
            ? `${patient.age} years`
            : "Not available"
    );


    setText(
        "detailGender",
        patient.gender ||
        "Not available"
    );


    setText(
        "detailDob",
        formatDate(
            (patient.dateOfBirth || patient.dob)
        )
    );


    setText(
        "detailBloodGroup",
        patient.bloodGroup ||
        "Not available"
    );


    // ==================================================
    // CONTACT
    // ==================================================

    setText(
        "detailPhone",
        patient.phone ||
        "Not available"
    );


    setText(
        "detailEmail",
        patient.email ||
        "Not available"
    );


    setText(
        "detailAddress",
        patient.address ||
        "Not available"
    );


    // ==================================================
    // MEDICAL INFORMATION
    // ==================================================

    setText(
        "detailDiagnosis",
        patient.diagnosis ||
        patient.condition ||
        "No diagnosis recorded."
    );


    setText(
        "detailMedications",
        formatList(
            patient.medications
        )
    );


    setText(
        "detailAllergies",
        formatList(
            patient.allergies
        )
    );


    setText(
        "detailHistory",
        formatList(
            patient.medicalHistory
        )
    );


    // ==================================================
    // HOSPITAL INFORMATION
    // ==================================================

    setText(
        "detailDepartment",
        department
    );


    setText(
        "detailDoctor",
        doctor
    );


    setText(
        "detailAdmissionDate",
        formatDate(
            patient.admissionDate
        )
    );


    setText(
        "detailDischargeDate",
        formatDate(
            patient.dischargeDate
        )
    );


    // ==================================================
    // EMERGENCY CONTACT
    // ==================================================

    const emergency =
        patient.emergencyContact || {
            name: patient.emergencyContactName,
            phone: patient.emergencyContactNumber
        };


    setText(
        "detailEmergencyName",
        emergency.name ||
        patient.emergencyName ||
        "Not available"
    );


    setText(
        "detailEmergencyRelation",
        emergency.relationship ||
        patient.emergencyRelationship ||
        "Not available"
    );


    setText(
        "detailEmergencyPhone",
        emergency.phone ||
        patient.emergencyPhone ||
        "Not available"
    );


    // ==================================================
    // STATUS COLOR
    // ==================================================

    updateStatusStyle(
        status
    );


    // ==================================================
    // REPORTS
    // ==================================================

    renderReports(
        patient.reports ||
        []
    );

}


// ======================================================
// STATUS STYLE
// ======================================================

function updateStatusStyle(status) {

    const element =
        document.getElementById(
            "patientStatus"
        );


    if (!element) {
        return;
    }


    const normalized =
        String(status)
            .toLowerCase();


    element.className =
        "patient-status";


    if (
        normalized.includes("critical")
    ) {

        element.classList.add(
            "status-critical"
        );

    }

    else if (
        normalized.includes("recover")
    ) {

        element.classList.add(
            "status-recovering"
        );

    }

    else if (
        normalized.includes("discharg")
    ) {

        element.classList.add(
            "status-discharged"
        );

    }

    else {

        element.classList.add(
            "status-healthy"
        );

    }

}


// ======================================================
// REPORTS
// ======================================================

function renderReports(reports) {

    const container =
        document.getElementById(
            "reportsContainer"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(reports) ||
        reports.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-file-circle-check"></i>

                <p>
                    No medical reports available.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    reports.forEach(
        (report) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "report-item";


            const reportName =
                report.title ||
                report.name ||
                report.reportName ||
                "Medical Report";


            const reportDate =
                formatDate(
                    report.createdAt ||
                    report.date
                );


            const reportUrl =
                report.fileUrl ||
                report.url ||
                "#";


            item.innerHTML = `

                <div class="report-left">

                    <div class="report-icon">

                        <i class="fa-solid fa-file-pdf"></i>

                    </div>

                    <div>

                        <p class="report-name">
                            ${escapeHTML(reportName)}
                        </p>

                        <p class="report-date">
                            ${escapeHTML(reportDate)}
                        </p>

                    </div>

                </div>


                ${
                    reportUrl !== "#"
                        ? `
                            <a
                                href="${escapeHTML(reportUrl)}"
                                target="_blank"
                                class="report-view"
                            >
                                View
                            </a>
                        `
                        : ""
                }

            `;


            container.appendChild(
                item
            );

        }
    );

}


// ======================================================
// EDIT PATIENT
// ======================================================

function editPatient() {

    if (!currentPatient) {

        alert(
            "Patient information is not loaded yet."
        );

        return;

    }


    /*
     * Edit page will be implemented next.
     *
     * For now we keep the patient ID ready
     * for the next module.
     */

    window.location.href =
        `edit-patient.html?id=${encodeURIComponent(currentPatientId)}`;

}


// ======================================================
// DISCHARGE PATIENT
// ======================================================

async function dischargePatient() {

    if (!currentPatientId) {

        return;

    }


    const confirmed =
        window.confirm(
            "Are you sure you want to discharge this patient?"
        );


    if (!confirmed) {

        return;

    }


    const button =
        document.getElementById(
            "dischargePatientBtn"
        );


    if (button) {

        button.disabled = true;

        button.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i>
             Discharging...`;

    }


    try {

        const response =
            await apiRequest(
                `/patients/${encodeURIComponent(currentPatientId)}/discharge`,
                {
                    method: "PUT"
                }
            );


        console.log(
            "Discharge response:",
            response
        );


        alert(
            "Patient discharged successfully."
        );


        await loadPatientDetails();

    }

    catch (error) {

        console.error(
            "Discharge Error:",
            error
        );


        alert(
            error.message ||
            "Unable to discharge patient."
        );

    }


    finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                `<i class="fa-solid fa-right-from-bracket"></i>
                 Discharge`;

        }

    }

}


// ======================================================
// LOADING
// ======================================================

function showLoading(show) {

    const loading =
        document.getElementById(
            "detailsLoading"
        );


    if (!loading) {
        return;
    }


    loading.style.display =
        show
            ? "flex"
            : "none";

}


// ======================================================
// ERROR
// ======================================================

function showError(message) {

    const errorBox =
        document.getElementById(
            "detailsError"
        );


    const messageElement =
        document.getElementById(
            "errorMessage"
        );


    const content =
        document.getElementById(
            "patientDetailsContent"
        );


    if (content) {

        content.style.display =
            "none";

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    if (errorBox) {

        errorBox.style.display =
            "block";

    }

}


// ======================================================
// HIDE ERROR
// ======================================================

function hideError() {

    const errorBox =
        document.getElementById(
            "detailsError"
        );


    if (errorBox) {

        errorBox.style.display =
            "none";

    }

}


// ======================================================
// SET TEXT
// ======================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(value) {

    if (!value) {

        return "Not available";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ======================================================
// FORMAT LIST
// ======================================================

function formatList(value) {

    if (!value) {

        return "No information recorded.";

    }


    if (Array.isArray(value)) {

        if (value.length === 0) {

            return "No information recorded.";

        }


        return value.join(", ");

    }


    if (
        typeof value === "object"
    ) {

        return Object.values(value)
            .join(", ");

    }


    return String(value);

}


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}