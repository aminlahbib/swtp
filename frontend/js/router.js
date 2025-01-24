window.onload = function() {
    // Get the route the user is trying to access.
    const path = window.location.pathname.split("/");

    // Redirect the user based on what they have typed.
    switch(path[1]) {
        case "":
            // Redirect the user to the login page if they are not authenticated.
            if(sessionStorage.getItem("authentication_token") === null) {
                loadPage("login");
            } else {
                // Redirect to the equipment dashboard if the user is authenticated
                loadPage("equipments-dashboard");
            }
            break;
        default:
            loadPage("404");
            break;
    }

    // Add signout method to sign out link.
    document.getElementById('sign-out-navlink').addEventListener('click', signOut);
}

export function loadPage(path) {
    // Return nothing if path variable is empty.
    if(path == "") return;

    // Redirect the user if they are trying to access the equipment dashboard and they are unauthenticated.
    if(sessionStorage.getItem("authentication_token") === null && path !== "register" && path !== "login") {
        path = "login";
    }

    // Get the container.
    const container = document.getElementById("container");

    // Retrieve the html template and load it into the container element.
    const request = new XMLHttpRequest();
    request.open("GET", "/templates/" + path + ".html");
    request.send();
    request.onload = function() {
        if(request.status == 200) {
            container.innerHTML = request.responseText;
            document.title = "Equipment Management | " + path;
            // Load the related JS file.
            loadJS(path);
        }
    }
}

function loadJS(route) {
    // Create the ID to assign to the JS script.
    const id = route + "-script";

    // Remove any unused JS Scripts.
    let scriptTags = Array.from(document.getElementsByTagName("script"));
    scriptTags.forEach(function(scriptTag) {
        if(scriptTag.id !== id && scriptTag.id !== 'router') {
            document.getElementsByTagName("body").item(0).removeChild(scriptTag);
        }
    });

    // Create a new Script tag.
    let scriptEle = document.createElement("script");

    // Set the ID.
    scriptEle.id = id;

    // Set the src by finding it in the JS folder.
    scriptEle.setAttribute("src",  "./js/" + route + ".js?" + Math.random());
    scriptEle.setAttribute("type", "module");
    scriptEle.async = true;

    // Insert it onto the page.
    document.body.insertBefore(scriptEle, document.body.lastChild);
}

function signOut() {
    // Remove the JWT from the session storage.
    sessionStorage.clear();

    // Redirect the user to the login page.
    loadPage("login");
}