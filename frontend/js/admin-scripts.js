const API_BASE_URL = "http://localhost:8080/api";

// Add Equipment Form Submission
document.getElementById("addEquipmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const inventarnummer = document.getElementById("inventarnummer").value;
    const bezeichnung = document.getElementById("bezeichnung").value;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/equipment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inventarnummer: inventarnummer,
                bezeichnung: bezeichnung,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("addEquipmentMessage").textContent = "Equipment added successfully!";
            // Refresh the available equipment table
            loadAvailableEquipment();
        } else {
            document.getElementById("addEquipmentMessage").textContent = data.message || "Failed to add equipment.";
        }
    } catch (error) {
        console.error("Error adding equipment:", error);
        document.getElementById("addEquipmentMessage").textContent = "An error occurred. Please try again.";
    }
});

// Load Available Equipment
async function loadAvailableEquipment() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/equipment`);
        const data = await response.json();

        const tableBody = document.getElementById("availableEquipmentTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear existing rows

        // Populate the table with equipment data
        data.forEach(equipment => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = equipment.id;
            row.insertCell().textContent = equipment.inventarnummer;
            row.insertCell().textContent = equipment.bezeichnung;
        });
    } catch (error) {
        console.error("Error loading available equipment:", error);
    }
}

// Load Current Loans
async function loadCurrentLoans() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/ausleihen/current`);
        const data = await response.json();

        const tableBody = document.getElementById("currentLoansTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear existing rows

        data.forEach(loan => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = loan.id;
            row.insertCell().textContent = loan.benutzer.benutzername;
            row.insertCell().textContent = loan.equipment.bezeichnung;
            row.insertCell().textContent = new Date(loan.ausleihe).toLocaleString();
        });
    } catch (error) {
        console.error("Error loading current loans:", error);
    }
}

// Load Loan History
async function loadLoanHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/ausleihen/history`);
        const data = await response.json();

        const tableBody = document.getElementById("loanHistoryTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear existing rows

        data.forEach(log => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = log.id;
            row.insertCell().textContent = log.benutzername;
            row.insertCell().textContent = log.equipmentbezeichnung;
            row.insertCell().textContent = new Date(log.ausleihdatum).toLocaleString();
            row.insertCell().textContent = log.rueckgabedatum ? new Date(log.rueckgabedatum).toLocaleString() : "Not returned";
        });
    } catch (error) {
        console.error("Error loading loan history:", error);
    }
}

// Load all data when the page loads
window.onload = () => {
    loadAvailableEquipment();
    loadCurrentLoans();
    loadLoanHistory();
};