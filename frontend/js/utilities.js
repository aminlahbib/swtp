export function showNavbar() {
    document.getElementById("navbar").classList.remove("hide");
}

export function hideNavbar() {
    document.getElementById("navbar").classList.add("hide");
}


export function setFieldInvalid(fieldId, errorMessage = "") {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add("invalid-input");
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.innerText = errorMessage;
        }
    }
}

export function removeInvalidState(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove("invalid-input");
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.innerText = "";
        }
    }
}

export function decodeToken(token) {
    try {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decodedPayload;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}