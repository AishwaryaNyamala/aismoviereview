// Signup Function
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            let username = document.getElementById("signup-username").value;
            let password = document.getElementById("signup-password").value;

            if (localStorage.getItem(username)) {
                alert("User already exists. Please login.");
            } else {
                localStorage.setItem(username, JSON.stringify({ password }));
                alert("Signup successful! Please login.");
                window.location.href = "login.html"; // Redirect to login
            }
        });
    }

    // Login Function
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            let username = document.getElementById("login-username").value;
            let password = document.getElementById("login-password").value;
            let storedUser = JSON.parse(localStorage.getItem(username));

            if (storedUser && storedUser.password === password) {
                alert("Login successful!");
                localStorage.setItem("loggedInUser", username); // Save session
                window.location.href = "index.html"; // Redirect to homepage
            } else {
                alert("Invalid username or password!");
            }
        });
    }
});

// Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Restrict Access to Certain Pages
function checkAuth() {
    if (!localStorage.getItem("loggedInUser")) {
        alert("You must log in first!");
        window.location.href = "login.html";
    }
}
