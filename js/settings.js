
document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const forms = document.querySelectorAll("form");

    const profileForm = forms[0];
    const passwordForm = forms[1];

    if (profileForm) {
        const inputs = profileForm.querySelectorAll("input");
        if (inputs[0]) inputs[0].value = user.fullName || "";
        if (inputs[1]) inputs[1].value = user.email || "";
        if (inputs[3]) inputs[3].value = user.phone || "";

        profileForm.addEventListener("submit", async e => {
            e.preventDefault();
            try {
                const data = {
                    fullName: inputs[0]?.value.trim(),
                    email: inputs[1]?.value.trim(),
                    phone: inputs[3]?.value.trim()
                };
                const response = await apiRequest("/auth/profile", {
                    method: "PUT",
                    body: JSON.stringify(data)
                });
                if (response.data) localStorage.setItem("user", JSON.stringify(response.data));
                alert("Profile updated successfully.");
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (passwordForm) {
        const inputs = passwordForm.querySelectorAll("input");
        passwordForm.addEventListener("submit", async e => {
            e.preventDefault();
            try {
                await apiRequest("/auth/change-password", {
                    method: "PUT",
                    body: JSON.stringify({
                        currentPassword: inputs[0]?.value,
                        newPassword: inputs[1]?.value,
                        confirmPassword: inputs[2]?.value
                    })
                });
                passwordForm.reset();
                alert("Password changed successfully.");
            } catch (error) {
                alert(error.message);
            }
        });
    }

    document.querySelectorAll("button").forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        if (text === "backup now" || text === "restore") {
            btn.addEventListener("click", () => alert("Database backup/restore is an infrastructure operation. Configure your MongoDB backup provider before using this control."));
        }
        if (text === "open") btn.addEventListener("click", () => location.href = "dashboard.html");
        if (text === "check") btn.addEventListener("click", () => alert("CareScope application is up to date."));
    });
});
