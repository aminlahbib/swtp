import { loginUser } from "./api.js";
import { loadPage } from "./router.js";
import { hideNavbar, removeInvalidState, setFieldInvalid } from "./utilities.js";

document.getElementById('login-script').onload = function () {
    hideNavbar();

    document.getElementById('submit').addEventListener("click", login);
    document.getElementById("register-button").addEventListener("click", redirectToRegister);

    // Add event listeners to remove invalid state when the user corrects the input
    document.getElementById("username").addEventListener("input", () => removeInvalidState("username"));
    document.getElementById("password").addEventListener("input", () => removeInvalidState("password"));
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
                const data = await response.json();
                const token = data.token;
                sessionStorage.setItem("authentication_token", token);
                loadPage("equipments-dashboard");
            } else {
                // Parse the error response
                const errorData = await response.json();
                const errorMessage = errorData.message || "Login failed. Please try again.";
                document.getElementById("user-details-error").innerText = errorMessage;

                // Mark the specific fields as invalid based on the error
                if (errorMessage.toLowerCase().includes("username")) {
                    setFieldInvalid("username", errorMessage);
                } else if (errorMessage.toLowerCase().includes("password")) {
                    setFieldInvalid("password", errorMessage);
                }
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
    let isValid = true;

    // Clear all error messages and invalid states
    document.getElementById("user-details-error").innerText = "";
    removeInvalidState("username");
    removeInvalidState("password");

    if (username === "" || username === null) {
        setFieldInvalid("username", "Username is required.");
        isValid = false;
    }

    if (password === "" || password === null) {
        setFieldInvalid("password", "Password is required.");
        isValid = false;
    }

    return isValid;
}