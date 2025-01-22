import { login } from "./api.js";
import { navigateTo } from "./router.js";

// Validate login form inputs
const validateLoginForm = (username, password) => {
    if (username.length < 3) {
        return "Username must be at least 3 characters.";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters.";
    }
    return null; // No validation errors
};

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form inputs
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // Validate inputs
    const validationError = validateLoginForm(username, password);
    if (validationError) {
        document.getElementById("loginMessage").textContent = validationError;
        return; // Stop if validation fails
    }

    // Clear any previous error messages
    document.getElementById("loginMessage").textContent = "";

    try {
        // Call the login API
        const data = await login(username, password);

        // Handle the response
        if (data.token) {
            // Store the token in localStorage
            localStorage.setItem("token", data.token);

            // Redirect to the user dashboard
            navigateTo("/benutzer-dashboard");
        } else {
            // Display error message from the backend
            document.getElementById("loginMessage").textContent = data.message || "Login failed.";
        }
    } catch (error) {
        // Handle network or API errors
        console.error("Login error:", error);
        document.getElementById("loginMessage").textContent = error.message || "An error occurred. Please try again.";
    }
});