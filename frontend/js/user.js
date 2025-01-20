// Token Management
const TOKEN_KEY = 'auth_token';

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// API Calls
const API_BASE_URL = 'http://localhost:8080/api';

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (getToken()) {
        headers['Authorization'] = `Bearer ${getToken()}`;
    }

    const options = {
        method,
        headers,
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
const authContainer = document.getElementById('auth-container');
const equipmentContainer = document.getElementById('equipment-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const availableEquipment = document.getElementById('available-equipment');
const borrowedEquipment = document.getElementById('borrowed-equipment');

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await apiCall('/benutzer/login', 'POST', {
            benutzername: document.getElementById('login-username').value,
            password: document.getElementById('login-password').value
        });
        setToken(response.token);
        showEquipmentView();
    } catch (error) {
        alert('Login fehlgeschlagen');
        console.error('Login error:', error);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await apiCall('/benutzer/register', 'POST', {
            benutzername: document.getElementById('register-username').value,
            vorname: document.getElementById('register-firstname').value,
            nachname: document.getElementById('register-lastname').value,
            password: document.getElementById('register-password').value
        });
        setToken(response.token);
        showEquipmentView();
    } catch (error) {
        alert('Registrierung fehlgeschlagen');
        console.error('Registration error:', error);
    }
});

logoutBtn.addEventListener('click', () => {
    removeToken();
    showAuthView();
});

// Equipment Functions
async function loadAvailableEquipment() {
    try {
        const equipment = await apiCall('/benutzer/equipment');
        availableEquipment.innerHTML = equipment.map(item => `
            <div class="equipment-item">
                <p>Inventarnummer: ${item.inventarnummer}</p>
                <p>Bezeichnung: ${item.bezeichnung}</p>
                <button onclick="borrowEquipment(${item.id})">Ausleihen</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading available equipment:', error);
    }
}

async function loadBorrowedEquipment() {
    try {
        const borrowed = await apiCall('/benutzer/ausleihen');
        borrowedEquipment.innerHTML = borrowed.map(item => `
            <div class="equipment-item">
                <p>Inventarnummer: ${item.equipment.inventarnummer}</p>
                <p>Bezeichnung: ${item.equipment.bezeichnung}</p>
                <p>Ausgeliehen am: ${new Date(item.ausleihe).toLocaleString()}</p>
                <button onclick="returnEquipment(${item.equipment.id})">Zurückgeben</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading borrowed equipment:', error);
    }
}

async function borrowEquipment(equipmentId) {
    try {
        await apiCall(`/benutzer/ausleihen/${equipmentId}`, 'POST');
        await refreshEquipmentLists();
    } catch (error) {
        alert('Ausleihe fehlgeschlagen');
        console.error('Error borrowing equipment:', error);
    }
}

async function returnEquipment(equipmentId) {
    try {
        await apiCall(`/benutzer/rueckgabe/${equipmentId}`, 'POST');
        await refreshEquipmentLists();
    } catch (error) {
        alert('Rückgabe fehlgeschlagen');
        console.error('Error returning equipment:', error);
    }
}

async function refreshEquipmentLists() {
    await Promise.all([
        loadAvailableEquipment(),
        loadBorrowedEquipment()
    ]);
}

// View Management
function showAuthView() {
    authContainer.style.display = 'block';
    equipmentContainer.style.display = 'none';
}

function showEquipmentView() {
    authContainer.style.display = 'none';
    equipmentContainer.style.display = 'block';
    refreshEquipmentLists();
}

// Initial Setup
if (getToken()) {
    showEquipmentView();
} else {
    showAuthView();
} 