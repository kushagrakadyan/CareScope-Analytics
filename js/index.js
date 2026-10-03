
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener("click", e => e.preventDefault());
    });

    const token = localStorage.getItem("token");
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    if (token) {
        loginLinks.forEach(link => {
            if (/login|get started|dashboard/i.test(link.textContent)) {
                link.href = "dashboard.html";
            }
        });
    }
});
