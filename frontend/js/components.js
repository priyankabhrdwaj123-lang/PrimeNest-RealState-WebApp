document.addEventListener("DOMContentLoaded", async () => {
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) {
        return;
    }

    try {
        const response = await fetch("../components/navbar.html");

        if (!response.ok) {
            throw new Error("Navbar load nahi ho paya");
        }

        navbarContainer.innerHTML = await response.text();

        // Current page identify karo
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        // Active menu set karo
        navbarContainer.querySelectorAll(".nav-menu a").forEach(link => {
            const page = link.dataset.page;

            if (page === currentPage) {
                link.classList.add("active");
            }
        });

    } catch (error) {
        console.error("Navbar Error:", error);
    }
});