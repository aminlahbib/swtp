// Base URL for your backend API
const API_BASE_URL = "http://localhost:8080/api";

// Check if the user is authenticated
const token = localStorage.getItem("token");
if (!token) {
    // Redirect to the login page if no token exists
    window.location.href = "index.html"; // Replace with your login page
}

// Load Available Equipment
async function loadAvailableEquipment() {
    try {
        const response = await fetch(`${API_BASE_URL}/benutzer/equipment`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        const data = await response.json();

        const tableBody = document.getElementById("availableEquipmentTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear existing rows

        data.forEach(equipment => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = equipment.id;
            row.insertCell().textContent = equipment.inventarnummer;
            row.insertCell().textContent = equipment.bezeichnung;

            // Add a "Borrow" button
            const actionCell = row.insertCell();
            const borrowButton = document.createElement("button");
            borrowButton.textContent = "Borrow";
            borrowButton.addEventListener("click", () => borrowEquipment(equipment.id));
            actionCell.appendChild(borrowButton);
        });
    } catch (error) {
        console.error("Error loading available equipment:", error);
    }
}

// Borrow Equipment
async function borrowEquipment(equipmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/benutzer/ausleihen/${equipmentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        if (response.ok) {
            alert("Equipment borrowed successfully!");
            // Refresh the tables
            loadAvailableEquipment();
            loadLoanLog();
        } else {
            const data = await response.json();
            alert(data.message || "Failed to borrow equipment.");
        }
    } catch (error) {
        console.error("Error borrowing equipment:", error);
        alert("An error occurred. Please try again.");
    }
}

// Load Loan Log
async function loadLoanLog() {
    try {
        const response = await fetch(`${API_BASE_URL}/benutzer/ausleihen`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        const data = await response.json();

        const tableBody = document.getElementById("loanLogTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear existing rows

        data.forEach(loan => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = loan.equipment.id;
            row.insertCell().textContent = loan.equipment.inventarnummer;
            row.insertCell().textContent = loan.equipment.bezeichnung;
            row.insertCell().textContent = new Date(loan.ausleihe).toLocaleString();

            // Add a "Return" button
            const actionCell = row.insertCell();
            const returnButton = document.createElement("button");
            returnButton.textContent = "Return";
            returnButton.classList.add("return");
            returnButton.addEventListener("click", () => returnEquipment(loan.equipment.id));
            actionCell.appendChild(returnButton);
        });
    } catch (error) {
        console.error("Error loading loan log:", error);
    }
}

// Return Equipment
async function returnEquipment(equipmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/benutzer/rueckgabe/${equipmentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        if (response.ok) {
            alert("Equipment returned successfully!");
            // Refresh the tables
            loadAvailableEquipment();
            loadLoanLog();
        } else {
            const data = await response.json();
            alert(data.message || "Failed to return equipment.");
        }
    } catch (error) {
        console.error("Error returning equipment:", error);
        alert("An error occurred. Please try again.");
    }
}

// Handle Unauthorized Access
function handleUnauthorized() {
    localStorage.removeItem("token"); // Clear the token
    window.location.href = "index.html"; // Redirect to the login page
}
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("token"); // Clear the token
    window.location.href = "index.html"; // Redirect to the login page
});

// Load all data when the page loads
window.onload = () => {
    loadAvailableEquipment();
    loadLoanLog();
};