const routes = {
    "/": "index.html",
    "/login": "index.html",
    "/register": "index.html",
    "/admin-dashboard": "templates/Admin-Dashboard.html",
    "/equipment-dashboard": "templates/Equipment-Dashboard.html", // Combined dashboard
    "/404": "templates/404.html",
};

export const navigateTo = (path) => {
    const route = routes[path] || routes["/404"];
    fetch(route)
        .then((response) => response.text())
        .then((html) => {
            document.getElementById("app").innerHTML = html;
            window.history.pushState({}, path, window.location.origin + path);

            // Trigger data loading after navigation
            if (path === "/admin-dashboard") {
                loadAvailableEquipment();
                loadCurrentLoans();
                loadLoanHistory();
            } else if (path === "/equipment-dashboard") {
                loadAvailableEquipment(); // Load equipment data for the equipment dashboard
                loadBorrowedEquipment(); // Load borrowed equipment for the user
            }
        })
        .catch((error) => {
            console.error("Error loading page:", error);
            navigateTo("/404");
        });
};

window.onpopstate = () => {
    navigateTo(window.location.pathname);
};

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute("href"));
        }
    });

    navigateTo(window.location.pathname);
});