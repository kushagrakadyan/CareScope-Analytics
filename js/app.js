// ===============================
// CareScope Analytics - app.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // Navigation active effect
    const links = document.querySelectorAll(".sidebar nav a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // Buttons
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            console.log(button.innerText + " clicked");
        });
    });

    // Search
    document.querySelectorAll(".search-box input").forEach(input => {
        input.addEventListener("input", function () {
            console.log("Searching:", this.value);
        });
    });

    console.log("CareScope Analytics Loaded Successfully");
});