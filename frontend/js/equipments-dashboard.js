import { showNavbar } from './utilities.js';
import { getAvailableEquipment, getMyBorrowedEquipment, borrowEquipment, returnEquipment } from './api.js';

document.getElementById('equipments-dashboard-script').onload = async function () {
    showNavbar();

    // Display the access token in the body (if needed)
    displayAccessToken();

    // Load equipment data
    await loadEquipmentData();

    // Add event listeners for borrowing and returning equipment
    addEventListeners();
}

async function loadEquipmentData() {
    try {
        // Fetch available equipment
        const availableEquipment = await getAvailableEquipment();
        populateTable("available-equipment-table", availableEquipment);

        // Fetch borrowed equipment for the current user
        const borrowedEquipment = await getMyBorrowedEquipment();
        populateTable("borrowed-equipment-table", borrowedEquipment);
    } catch (error) {
        console.error("Error loading equipment data:", error.message);
        alert("Failed to load equipment data. Please try again.");
    }
}

function populateTable(tableId, data) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        let row = tableBody.insertRow(index);

        // Populate the row with equipment data
        if (tableId === "available-equipment-table") {
            // For available equipment, the item is an Equipment object
            row.insertCell(0).innerHTML = item.inventarnummer; // Inventory number
            row.insertCell(1).innerHTML = item.bezeichnung;   // Equipment name/description
            const actionCell = row.insertCell(2);
            actionCell.innerHTML = `<button id="borrow-${item.id}" class="btn-borrow">Borrow</button>`;
        } else if (tableId === "borrowed-equipment-table") {
            // For borrowed equipment, the item is an Ausleihe object
            row.insertCell(0).innerHTML = item.equipment.inventarnummer; // Access nested Equipment object
            row.insertCell(1).innerHTML = item.equipment.bezeichnung;   // Access nested Equipment object
            const actionCell = row.insertCell(2);
            actionCell.innerHTML = `<button id="return-${item.equipment.id}" class="btn-return">Return</button>`;
        }
    });
}

function addEventListeners() {
    // Add event listeners for borrow buttons
    document.querySelectorAll('.btn-borrow').forEach(button => {
        button.addEventListener('click', async (event) => {
            const equipmentId = event.target.id.split('-')[1]; // Extract equipment ID from button ID
            try {
                await borrowEquipment(equipmentId);
                alert("Equipment borrowed successfully!");
                await loadEquipmentData(); // Refresh the equipment lists
            } catch (error) {
                console.error("Error borrowing equipment:", error.message);
                alert("Failed to borrow equipment. Please try again.");
            }
        });
    });

    // Add event listeners for return buttons
    document.querySelectorAll('.btn-return').forEach(button => {
        button.addEventListener('click', async (event) => {
            const equipmentId = event.target.id.split('-')[1]; // Extract equipment ID from button ID
            try {
                await returnEquipment(equipmentId);
                alert("Equipment returned successfully!");
                await loadEquipmentData(); // Refresh the equipment lists
            } catch (error) {
                console.error("Error returning equipment:", error.message);
                alert(error.message); // Display the backend error message
            }
        });
    });
}

function displayAccessToken() {
    const token = sessionStorage.getItem("authentication_token");
    if (token) {
        const tokenContainer = document.createElement("div");
        tokenContainer.id = "token-container";
        tokenContainer.className = "token-container";
        tokenContainer.innerHTML = `<strong>Access Token:</strong> ${token}`;
        document.getElementById("container").insertBefore(tokenContainer, document.getElementById("container").firstChild);
    }
}