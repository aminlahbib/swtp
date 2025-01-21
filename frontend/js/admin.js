// API Calls
const API_BASE_URL = 'http://localhost:8080/api/admin';

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// UI Elements
const addEquipmentForm = document.getElementById('add-equipment-form');
const currentLoans = document.getElementById('current-loans');
const pastLoans = document.getElementById('past-loans');

// Event Listeners
addEquipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await apiCall('/admin/equipment', 'POST', {
            inventarnummer: document.getElementById('inventarnummer').value,
            bezeichnung: document.getElementById('bezeichnung').value
        });
        addEquipmentForm.reset();
        await loadCurrentLoans();
    } catch (error) {
        alert('Fehler beim Hinzufügen des Geräts');
        console.error('Error adding equipment:', error);
    }
});

// Load Functions
async function loadCurrentLoans() {
    try {
        const loans = await apiCall('/admin/ausleihen/current');
        currentLoans.innerHTML = loans.map(loan => `
            <div class="equipment-item">
                <p>Benutzer: ${loan.benutzer.benutzername}</p>
                <p>Gerät: ${loan.equipment.bezeichnung} (${loan.equipment.inventarnummer})</p>
                <p>Ausgeliehen am: ${new Date(loan.ausleihe).toLocaleString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading current loans:', error);
    }
}

async function loadLoanHistory() {
    try {
        const history = await apiCall('/admin/ausleihen/history');
        pastLoans.innerHTML = history.map(item => `
            <div class="equipment-item">
                <p>Benutzer: ${item.benutzername}</p>
                <p>Gerät: ${item.equipmentbezeichnung} (${item.equipmentinventarnummer})</p>
                <p>Ausgeliehen am: ${new Date(item.ausleihdatum).toLocaleString()}</p>
                <p>Zurückgegeben am: ${item.rueckgabedatum ? new Date(item.rueckgabedatum).toLocaleString() : 'Noch nicht zurückgegeben'}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading loan history:', error);
    }
}

// Initial Load
loadCurrentLoans();
loadLoanHistory();

// Auto-Refresh
setInterval(() => {
    loadCurrentLoans();
    loadLoanHistory();
}, 30000); // Aktualisiere alle 30 Sekunden 