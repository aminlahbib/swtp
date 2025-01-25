import { hideNavbar, setFieldInvalid, removeInvalidState } from "./utilities.js";
import { loadPage } from "./router.js";
import { registerUser, loginUser } from "./api.js";

document.getElementById('register-script').onload = function () {
    hideNavbar();

    document.getElementById('register-user-button').addEventListener("click", register);
    document.getElementById("sign-in-button").addEventListener("click", redirectToSignIn);

    // Add event listeners to remove invalid state when the user corrects the input
    document.getElementById("username").addEventListener("input", () => removeInvalidState("username"));
    document.getElementById("password").addEventListener("input", () => removeInvalidState("password"));
    document.getElementById("first-name").addEventListener("input", () => removeInvalidState("first-name"));
    document.getElementById("last-name").addEventListener("input", () => removeInvalidState("last-name"));
}

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;

    const valid = validateRegisterForm(username, password, firstName, lastName);

    if (valid) {
        try {
            const response = await registerUser(username, password, firstName, lastName);

            if (response.ok) {
                // Automatically log the user in after successful registration
                const loginResponse = await loginUser(username, password);

                if (loginResponse.ok) {
                    // Handle the login response (token is returned as a JSON object)
                    const loginData = await loginResponse.json(); // Parse the response as JSON
                    const token = loginData.token; // Extract the token from the JSON object
                    sessionStorage.setItem("authentication_token", token);

                    // Redirect to the equipment dashboard
                    loadPage("equipments-dashboard");
                } else {
                    // Handle login error
                    document.getElementById("register-error").innerText = "Automatic login failed. Please log in manually.";
                }
            } else {
                // Parse the error response from the backend
                let errorMessage = "Register request failed. Please try again!";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;

                    // Handle specific error cases
                    if (response.status === 409) {
                        // Username already exists
                        setFieldInvalid("username", errorMessage);
                    } else {
                        // Mark specific fields as invalid based on the error
                        if (errorMessage.toLowerCase().includes("benutzername")) {
                            setFieldInvalid("username", errorMessage);
                        } else if (errorMessage.toLowerCase().includes("password")) {
                            setFieldInvalid("password", errorMessage);
                        } else if (errorMessage.toLowerCase().includes("first name")) {
                            setFieldInvalid("first-name", errorMessage);
                        } else if (errorMessage.toLowerCase().includes("last name")) {
                            setFieldInvalid("last-name", errorMessage);
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse error response:", error);
                }

                // Display the generic error message above the register button
                document.getElementById("register-error").innerText = "Register request failed. Please try again!";
            }
        } catch (error) {
            console.error("Error during registration:", error);
            document.getElementById("register-error").innerText = "An unexpected error occurred. Please try again.";
        }
    }
}

function redirectToSignIn() {
    loadPage("login");
}

function validateRegisterForm(username, password, firstName, lastName) {
    let isValid = true;

    // Clear all error messages and invalid states
    document.getElementById("register-error").innerText = "";
    removeInvalidState("username");
    removeInvalidState("password");
    removeInvalidState("first-name");
    removeInvalidState("last-name");

    if (username === "" || username === null) {
        setFieldInvalid("username", "Username is required.");
        isValid = false;
    }

    if (password === "" || password === null) {
        setFieldInvalid("password", "Password is required.");
        isValid = false;
    }

    if (firstName === "" || firstName === null) {
        setFieldInvalid("first-name", "First Name is required.");
        isValid = false;
    }

    if (lastName === "" || lastName === null) {
        setFieldInvalid("last-name", "Last Name is required.");
        isValid = false;
    }

    return isValid;
}