// Base URL for your backend API
const API_BASE_URL = "http://localhost:8080/api";

// Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_BASE_URL}/benutzer/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ benutzername: username, password: password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save the JWT token (if applicable)
            localStorage.setItem("token", data.token);
            document.getElementById("loginMessage").textContent = "Login successful!";
            // Redirect to another page or update the UI
        } else {
            document.getElementById("loginMessage").textContent = data.message || "Login failed.";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("loginMessage").textContent = "An error occurred. Please try again.";
    }
});

// Registration Form Submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(`${API_BASE_URL}/benutzer/register`, {
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

        const data = await response.json();

        if (response.ok) {
            document.getElementById("registerMessage").textContent = "Registration successful!";
        } else {
            document.getElementById("registerMessage").textContent = data.message || "Registration failed.";
        }
    } catch (error) {
        console.error("Registration error:", error);
        document.getElementById("registerMessage").textContent = "An error occurred. Please try again.";
    }

    // After successful login/register
    localStorage.setItem("token", data.token); // Store the token
    window.location.href = "Equipment-Dashboard.html"; // Redirect to the dashboard
});