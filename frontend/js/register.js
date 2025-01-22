import { register } from "./api.js";
import { navigateTo } from "./router.js";

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
    return null; // No validation errors
};

// Handle registration form submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form inputs
    const username = document.getElementById("registerUsername").value;
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    const password = document.getElementById("registerPassword").value;

    // Validate inputs
    const validationError = validateRegisterForm(username, firstName, lastName, password);
    if (validationError) {
        document.getElementById("registerMessage").textContent = validationError;
        return; // Stop if validation fails
    }

    // Clear any previous error messages
    document.getElementById("registerMessage").textContent = "";

    try {
        // Call the register API
        const data = await register(username, firstName, lastName, password);

        // Handle the response
        if (data.token) {
            // Store the token in localStorage
            localStorage.setItem("token", data.token);

            // Redirect to the user dashboard
            navigateTo("/benutzer-dashboard");
        } else {
            // Display error message from the backend
            document.getElementById("registerMessage").textContent = data.message || "Registration failed.";
        }
    } catch (error) {
        // Handle network or API errors
        console.error("Registration error:", error);
        document.getElementById("registerMessage").textContent = error.message || "An error occurred. Please try again.";
    }
});