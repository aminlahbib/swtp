import { hideNavbar, setFieldInvalid } from "./utilities.js";
import { loadPage } from "./router.js";
import { registerUser, loginUser } from "./api.js"; // Import loginUser

document.getElementById('register-script').onload = function () {
    hideNavbar();

    document.getElementById('register-user-button').addEventListener("click", register);
    document.getElementById("sign-in-button").addEventListener("click", redirectToSignIn);
}

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;

    const valid = validateRegisterForm(username, password, firstName, lastName);

    if (valid) {
        const response = await registerUser(username, password, firstName, lastName);

        if (response.ok) {
            // Automatically log the user in after successful registration
            const loginResponse = await loginUser(username, password);

            if (loginResponse.ok) {
                const token = await loginResponse.text();
                sessionStorage.setItem("authentication_token", token);

                // Redirect to the equipment dashboard
                loadPage("equipments-dashboard");
            } else {
                // Handle login error
                document.getElementById("register-error").innerText = "Automatic login failed. Please log in manually.";
            }
        } else {
            setFieldInvalid("username");
            setFieldInvalid("password");
            setFieldInvalid("first-name");
            setFieldInvalid("last-name");

            document.getElementById("register-error").innerText = await response.text();
        }
    }
}

function redirectToSignIn() {
    loadPage("login");
}

function validateRegisterForm(username, password, firstName, lastName) {
    if (username === "" || username === null || password === "" || password === null || firstName === "" || firstName === null || lastName === "" || lastName === null) {
        if (username === "" || username === null) {
            setFieldInvalid('username', "Username is required.");
        }

        if (password === "" || password === null) {
            setFieldInvalid('password', "Password is required.");
        }

        if (firstName === "" || firstName === null) {
            setFieldInvalid('first-name', "First Name is required.");
        }

        if (lastName === "" || lastName === null) {
            setFieldInvalid('last-name', "Last Name is required.");
        }

        return false;
    }

    return true;
}