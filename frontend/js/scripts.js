import { login, register } from "./api.js";
import { navigateTo } from "./router.js";

console.log("Scripts loaded");


// Validate registration form inputs
const validateRegisterForm = (username, firstName, lastName, password) => {
    if (username.length < 3) {
        return "Username must be at least 3 characters.";
    }
    if (firstName.length < 2) {
        return "First name must be at least 2 characters.";
    }
    if (lastName.length < 2) {
        return "Last name must be at least 2 characters.";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters.";
    }
    return null;
};

// Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const validationError = validateLoginForm(username, password);
    if (validationError) {
        document.getElementById("loginMessage").textContent = validationError;
        return;
    }

    try {
        const data = await login(username, password);
        if (data.token) {
            localStorage.setItem("token", data.token);
            navigateTo("/benutzer-dashboard");
        } else {
            document.getElementById("loginMessage").textContent = data.message || "Login failed.";
        }
    } catch (error) {
        document.getElementById("loginMessage").textContent = error.message || "An error occurred. Please try again.";
    }
});

// Registration Form Submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    const password = document.getElementById("registerPassword").value;

    const validationError = validateRegisterForm(username, firstName, lastName, password);
    if (validationError) {
        document.getElementById("registerMessage").textContent = validationError;
        return;
    }

    try {
        const data = await register(username, firstName, lastName, password);
        if (data.token) {
            localStorage.setItem("token", data.token);
            navigateTo("/benutzer-dashboard");
        } else {
            document.getElementById("registerMessage").textContent = data.message || "Registration failed.";
        }
    } catch (error) {
        document.getElementById("registerMessage").textContent = error.message || "An error occurred. Please try again.";
    }
});