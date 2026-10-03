
(function () {
    const token = localStorage.getItem("token");
    const page = window.location.pathname.split("/").pop() || "index.html";
    const publicPages = new Set(["", "index.html", "login.html"]);

    if (!token && !publicPages.has(page)) {
        window.location.href = "login.html";
        return;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        document.querySelectorAll("[data-user-name]").forEach(el => {
            el.textContent = user.fullName || "CareScope User";
        });
        document.querySelectorAll("[data-user-role]").forEach(el => {
            el.textContent = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User";
        });

        const profileName = document.getElementById("profileName");
        if (profileName && user.fullName) profileName.textContent = user.fullName;

        document.querySelectorAll("[data-logout]").forEach(btn => {
            btn.addEventListener("click", async () => {
                try {
                    if (typeof apiRequest === "function" && token) {
                        await apiRequest("/auth/logout", { method: "POST" });
                    }
                } catch (_) {}
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "login.html";
            });
        });
    });
})();
