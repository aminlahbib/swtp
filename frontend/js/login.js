import { loginUser } from "./api.js";
import { loadPage } from "./router.js";
import { hideNavbar, removeInvalidState, setFieldInvalid } from "./utilities.js";

document.getElementById('login-script').onload = function () {
    hideNavbar();

    document.getElementById('submit').addEventListener("click", login);
    document.getElementById("register-button").addEventListener("click", redirectToRegister);
}

async function login() {
    // Clear any existing error messages
    document.getElementById("user-details-error").innerText = "";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const valid = validateLoginForm(username, password);

    if (valid) {
        try {
            const response = await loginUser(username, password);

            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                const token = data.token; // Extract the token
                sessionStorage.setItem("authentication_token", token); // Store the token
                loadPage("equipments-dashboard"); // Redirect to the dashboard
            } else {
                // Parse the error response
                const errorData = await response.json();
                const errorMessage = errorData.message || "Login failed. Please try again.";
                document.getElementById("user-details-error").innerText = errorMessage;

                // Mark the fields as invalid
                setFieldInvalid("username");
                setFieldInvalid("password");
            }
        } catch (error) {
            console.error("Error during login:", error);
            document.getElementById("user-details-error").innerText = "An unexpected error occurred. Please try again.";
        }
    }
}

function redirectToRegister() {
    loadPage("register");
}

function validateLoginForm(username, password) {
    removeInvalidState("username");
    removeInvalidState("password");

    if (username === "" || username === null || password === "" || password === null) {
        if (username === "" || username === null) {
            setFieldInvalid("username", "Username is required.");
        }

        if (password === "" || password === null) {
            setFieldInvalid("password", "Password is required.");
        }

        return false;
    }

    return true;
}