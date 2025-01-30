import { resetPassword } from "./api.js";
import { loadPage } from "./router.js";
import { setFieldInvalid, removeInvalidState } from "./utilities.js";

document.getElementById('forgot-password-script').onload = function() {
    document.getElementById("reset-password-btn").addEventListener("click", resetPasswordHandler);
    document.getElementById("sign-in-link").addEventListener("click", redirectToSignIn);

    // Add input event listeners to remove invalid states
    document.getElementById("username").addEventListener("input", () => removeInvalidState("username"));
    document.getElementById("new-password").addEventListener("input", () => removeInvalidState("new-password"));
}

function redirectToSignIn() {
    loadPage("login");
}

async function resetPasswordHandler() {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("new-password");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const submitButton = document.getElementById("reset-password-btn");

    const username = usernameField.value.trim();
    const newPassword = passwordField.value.trim();

    errorMessage.textContent = "";
    successMessage.textContent = "";
    removeInvalidState("username");
    removeInvalidState("new-password");

    let isValid = true;

    if (!username) {
        setFieldInvalid("username", "Username is required.");
        isValid = false;
    }

    if (!newPassword) {
        setFieldInvalid("new-password", "New password is required.");
        isValid = false;
    }

    if (!isValid) return;

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Resetting...";

        const response = await resetPassword(username, newPassword);

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Failed to parse JSON response:", jsonError);
            throw new Error("Invalid server response. Please try again.");
        }

        if (response.ok) {
            successMessage.textContent = "Password reset successful. Redirecting to login...";
            setTimeout(() => loadPage("login"), 2000);
        } else {
            handleErrorResponse(response.status, data?.message);
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        errorMessage.textContent = error.message || "An unexpected error occurred. Please try again later.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Reset Password";
    }
}

function handleErrorResponse(status, message) {
    const errorMessage = document.getElementById("error-message");
    if (status === 401 || status === 403) {
        setFieldInvalid("username", "Invalid username.");
    } else if (status === 500) {
        errorMessage.textContent = "Server error. Please try again later.";
    } else {
        errorMessage.textContent = message || "Failed to reset password.";
    }
}
