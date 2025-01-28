document.addEventListener('DOMContentLoaded', function() {
    const goToHomeButton = document.querySelector('.btn-primary');
    if (goToHomeButton) {
        goToHomeButton.addEventListener('click', function() {
            window.location.href = './index.html'; // Redirect to the home page
        });
    }
});