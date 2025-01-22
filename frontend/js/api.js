const API_BASE_URL = "http://localhost:8080/api";

// Helper function to handle API requests and errors
const fetchApi = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred.");
        }

        return response.json();
    } catch (error) {
        console.error("API error:", error);
        throw new Error(error.message || "Network error. Please check your connection and try again.");
    }
};

// Login
export const login = async (username, password) => {
    return fetchApi(`${API_BASE_URL}/benutzer/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ benutzername: username, password: password }),
    });
};

// Register
export const register = async (username, firstName, lastName, password) => {
    return fetchApi(`${API_BASE_URL}/benutzer/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            benutzername: username,
            vorname: firstName,
            nachname: lastName,
            password: password,
        }),
    });
};

// Get Available Equipment
export const getAvailableEquipment = async () => {
    const token = localStorage.getItem("token");
    return fetchApi(`${API_BASE_URL}/benutzer/equipment`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
};

// Borrow Equipment
export const borrowEquipment = async (equipmentId) => {
    const token = localStorage.getItem("token");
    return fetchApi(`${API_BASE_URL}/benutzer/ausleihen/${equipmentId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
};

// Return Equipment
export const returnEquipment = async (equipmentId) => {
    const token = localStorage.getItem("token");
    return fetchApi(`${API_BASE_URL}/benutzer/rueckgabe/${equipmentId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
};

// Get Borrowed Equipment for Current User
export const getBorrowedEquipment = async () => {
    const token = localStorage.getItem("token");
    return fetchApi(`${API_BASE_URL}/benutzer/ausleihen`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
};