
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    const button = document.getElementById("loginBtn");

    if (!form) return;

    const showMessage = (text, type = "error") => {
        if (!message) return;
        message.textContent = text;
        message.className = `message ${type}`;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            showMessage("Please enter email and password.");
            return;
        }

        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

        try {
            const response = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.data || response.user || {}));

            showMessage("Login successful. Redirecting...", "success");
            window.location.href = "dashboard.html";
        } catch (error) {
            showMessage(error.message || "Login failed.");
        } finally {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
        }
    });
});
