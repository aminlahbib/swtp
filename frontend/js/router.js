import { decodeToken } from './utilities.js';

window.onload = function() {
    const hash = window.location.hash.substring(1);
    const path = hash.split("/");
    // console.log("Hash Path:", path); // Debugging

    // Redirect the user
    switch(path[0]) {
        case "":
        case "equipments-dashboard":
            // console.log(`${path[0] || 'Root'} path detected`);
            if(sessionStorage.getItem("authentication_token") === null) {
                //    console.log("No token found, redirecting to @login");
                loadPage("login");
            } else {
                // console.log("Token found, loading equipment dashboard");
                loadPage("equipments-dashboard");
            }
            break;
        case "forgot-password":
            // Handle the forgot-password route
            loadPage("forgot-password");
            break;
        default:
            // console.log("Unknown path, loading 404");
            loadPage("404");
            break;
    }

    // Add sign out method to sign out link.
    document.getElementById('sign-out-navlink')?.addEventListener('click', signOut);
}

export function loadPage(path) {
    if (path === "") return;

    const token = sessionStorage.getItem("authentication_token");
    if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
            // Token is expired
            sessionStorage.removeItem("authentication_token");
            path = "login"; // Redirect to login page
        }
    }

    if (token === null && path !== "register" && path !== "login" && path !== "forgot-password") {
        path = "login";
    }

    const container = document.getElementById("container");
    const request = new XMLHttpRequest();
    request.open("GET", "./templates/" + path + ".html");
    request.send();
    request.onload = function() {
        if (request.status == 200) {
            container.innerHTML = request.responseText;
            document.title = "Equipment Management | " + path;
            loadJS(path);
        } else {
            console.error("Failed to load template:", path);
        }
    };
}

function loadJS(route) {
    const id = route + "-script";
    let scriptTags = Array.from(document.getElementsByTagName("script"));
    scriptTags.forEach(function(scriptTag) {
        if(scriptTag.id !== id && scriptTag.id !== 'router') {
            if(scriptTag.parentNode) {
                scriptTag.parentNode.removeChild(scriptTag);
            }
        }
    });
    const existingScript = document.getElementById(id);
    if(existingScript) {
        return;
    }

    let scriptEle = document.createElement("script");
    scriptEle.id = id;
    scriptEle.setAttribute("src",  "./js/" + route + ".js?" + Math.random());
    scriptEle.setAttribute("type", "module");
    scriptEle.async = true;

    document.body.appendChild(scriptEle);
}

function signOut() {
    sessionStorage.clear();
    loadPage("login");
}