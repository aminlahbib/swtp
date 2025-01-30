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
            await loadAvailableEquipment();
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
        tableBody.innerHTML = "";
        // Populate the table with equipment data
        data.forEach(equipment => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = equipment.id;
            row.insertCell().textContent = equipment.inventarnummer;
            row.insertCell().textContent = equipment.bezeichnung;
            // Create delete button
            const actionCell = row.insertCell();
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = async () => {
                if (confirm(`Are you sure you want to delete ${equipment.inventarnummer}?`)) {
                    try {
                        await deleteEquipment(equipment.id);
                        loadAvailableEquipment(); // Refresh the table after deletion
                    } catch (error) {
                        console.error("Error deleting Equipment:", error);
                    }
                }
            };
            actionCell.appendChild(deleteButton);
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
        tableBody.innerHTML = "";

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
        tableBody.innerHTML = "";

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

// Load all Users
async function loadAllUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        const data = await response.json();

        const tableBody = document.getElementById("usersTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.benutzername;
            row.insertCell().textContent = user.nachname;

            // Create delete button
            const actionCell = row.insertCell();
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = async () => {
                if (confirm(`Are you sure you want to delete ${user.benutzername}?`)) {
                    try {
                        await deleteUser(user.id);
                        alert(`User ${user.benutzername} deleted successfully.`);
                        loadAllUsers(); // Refresh the table after deletion
                    } catch (error) {
                        alert(error.message); // Show user-friendly error message
                    }
                }
            };
            actionCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error("Error loading users:", error);
        alert("Failed to load users.");
    }
}

export async function deleteEquipment(equipmentId) {
    return await fetch(`${API_BASE_URL}/admin/equipment/${equipmentId}`, {
        method: "DELETE",
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error(`Failed to DELETE equipment: ${response.statusText}`);
        }
        return response;
    });
}

export async function deleteUser(benutzerId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${benutzerId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete user.");
        }

        return response;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error; // Rethrow so it can be caught by calling function
    }
}



// Load all data when the page loads
window.onload = () => {
    loadAvailableEquipment();
    loadCurrentLoans();
    loadLoanHistory();
    loadAllUsers();
};