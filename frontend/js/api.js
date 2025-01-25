const baseUrl = "http://localhost:8080/api/benutzer";

// Helper function to get the authorization token
function getAuthorizationToken() {
    return "Bearer " + sessionStorage.getItem("authentication_token");
}

// Login User
export async function loginUser(username, password) {
    const body = {
        benutzername: username,
        password: password
    };

    return await fetch(baseUrl + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}

// Register User
export async function registerUser(username, password, firstName, lastName) {
    const body = {
        benutzername: username,
        password: password,
        vorname: firstName,
        nachname: lastName
    };

    return await fetch(baseUrl + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}

// Get Available Equipment
export async function getAvailableEquipment() {
    return await fetch(baseUrl + "/equipment", {
        method: "GET",
        headers: {
            "Authorization": getAuthorizationToken(),
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        if (response.status === 401) {
            // Token is expired or invalid
            sessionStorage.removeItem("authentication_token");
            loadPage("login"); // Redirect to login page
            throw new Error("Session expired. Please log in again.");
        }
        if (!response.ok) {
            throw new Error("Failed to fetch available equipment");
        }
        return await response.json();
    });
}

export async function getMyBorrowedEquipment() {
    return await fetch(baseUrl + "/ausleihen", {
        method: "GET",
        headers: {
            "Authorization": getAuthorizationToken(),
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        if (response.status === 401) {
            // Token is expired or invalid
            sessionStorage.removeItem("authentication_token");
            loadPage("login"); // Redirect to login page
            throw new Error("Session expired. Please log in again.");
        }
        if (!response.ok) {
            throw new Error("Failed to fetch borrowed equipment");
        }
        return await response.json();
    });
}

// Borrow Equipment
export async function borrowEquipment(equipmentId) {
    return await fetch(baseUrl + "/ausleihen/" + equipmentId, {
        method: "POST",
        headers: {
            "Authorization": getAuthorizationToken(),
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error("Failed to borrow equipment");
        }
        return response;
    });
}

// Return Equipment
export async function returnEquipment(equipmentId) {
    return await fetch(baseUrl + "/rueckgabe/" + equipmentId, {
        method: "POST",
        headers: {
            "Authorization": getAuthorizationToken(),
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error("Failed to return equipment");
        }
        return response;
    });
}