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

// Function to decode a JWT token
const decodeJwt = (token) => {
    try {
        // Split the token into its parts (header, payload, signature)
        const base64Url = token.split('.')[1]; // Get the payload part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert to base64
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        ); // Decode the payload
        return JSON.parse(jsonPayload); // Parse the payload as JSON
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
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
            // Decode the JWT token
            const decodedToken = decodeJwt(data.token);

            if (decodedToken) {
                // Store the token and username in sessionStorage
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("username", decodedToken.sub); // Assuming 'sub' contains the username

                // Redirect to the equipment dashboard
                navigateTo("templates/Equipment-Dashboard");
            } else {
                // Handle token decoding failure
                document.getElementById("loginMessage").textContent = "An error occurred. Please try again.";
            }
        } else {
            // Display error message from the backend
            document.getElementById("loginMessage").textContent = data.message || "Login failed.";
        }
    } catch (error) {

        // Handle network or API errors
        console.error("Login error:", error);

        // Display the backend error message to the user
        if (error.message === "Ungültige Anmeldedaten") {
            document.getElementById("loginMessage").textContent = "Invalid username. Please try again.";
            document.getElementById("loginUsername").classList.add("invalid");
        } else if (error.message === "Ungültige Password") {
            document.getElementById("loginMessage").textContent = error.message || "Invalid password. Please try again.";
            document.getElementById("loginPassword").classList.add("invalid");
        } else{
            document.getElementById("loginMessage").textContent = error.message || "An error occurred. Please try again.";
        }
    }
});