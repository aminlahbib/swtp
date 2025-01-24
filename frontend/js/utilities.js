export function showNavbar() {
    document.getElementById("navbar").classList.remove("hide");
}

export function hideNavbar() {
    document.getElementById("navbar").classList.add("hide");
}

export function setFieldInvalid(id, error) {
    document.getElementById(id).classList.add('invalid-input');
    document.getElementById(id + '-error').innerText = error === undefined || error === null ? "" : error;
}

export function removeInvalidState(id) {
    document.getElementById(id).classList.remove('invalid-input');
    document.getElementById(id + '-error').innerText = "";
}