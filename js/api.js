const API_BASE_URL = window.CARESCOPE_API_URL || `${window.location.origin}/api`;

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { ...(options.body instanceof FormData ? {} : {"Content-Type":"application/json"}), ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try { response = await fetch(`${API_BASE_URL}${endpoint}`, {...options, headers}); }
    catch (error) { throw new Error("Cannot connect to CareScope server. Start it with npm run dev."); }

    const type = response.headers.get("content-type") || "";
    const data = type.includes("application/json") ? await response.json() : {message: await response.text()};
    if (!response.ok) {
        if (response.status === 401 && !location.pathname.endsWith("login.html")) {
            localStorage.removeItem("token"); localStorage.removeItem("user"); location.href="login.html";
        }
        throw new Error(data.message || `Request failed (${response.status})`);
    }
    return data;
}

function apiFileUrl(filePath) {
    if (!filePath) return "";
    if (/^https?:\/\//i.test(filePath)) return filePath;
    return `${window.location.origin}/${String(filePath).replace(/^\/+/,"")}`;
}

function showToast(message, type="success") {
    let box=document.getElementById("csToast");
    if(!box){ box=document.createElement("div"); box.id="csToast"; document.body.appendChild(box); }
    box.textContent=message; box.dataset.type=type; box.classList.add("show");
    clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>box.classList.remove("show"),3200);
}
