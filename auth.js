document.addEventListener('DOMContentLoaded', () => {

    // --- Utility Functions (added for consistency) ---
    // Function to get all users from localStorage
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Function to save all users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Function to get the currently logged-in user
    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem('loggedInUser'));
    }

    // Function to set the currently logged-in user
    function setLoggedInUser(user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }


    // --- SIGNUP LOGIC ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const image = document.getElementById('image').value.trim();

            let users = getUsers(); // Get current users

            // Check if user already exists
            const exists = users.find(u => u.email === email);
            if (exists) {
                alert('User with this email already exists!');
                return;
            }

            // Create a unique ID for the new user (simple timestamp-based ID)
            const newUserId = 'user_' + Date.now();

            // Create new user object with all necessary properties initialized
            const newUser = {
                id: newUserId,
                name: name,
                email: email,
                password: password,
                image: image,
                friends: [],            // Stores IDs of friends
                posts: [],              // Stores post objects created by this user
                requestsSent: [],       // Stores objects of friend requests sent by this user
                requestsReceived: []    // Stores objects of friend requests received by this user
            };

            users.push(newUser);      // Add the new user to the users array
            saveUsers(users);         // Save the updated users array to localStorage

            alert('Signup successful! Please login.');
            window.location.href = 'login.html';
        });
    }

    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            const users = getUsers(); // Get current users

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setLoggedInUser(user); // Store the entire user object
                alert("Login successful!");
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }

    // --- LOGOUT LOGIC (Common for all pages) ---
    // This part should ideally be on all pages where logout is possible (e.g., index.html, profile.html)
    // Make sure the button has the class 'logout-button'
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // Clear the logged-in user
            window.location.href = 'login.html';     // Redirect to login
        });
    }

    // --- REDIRECTION LOGIC (If user not logged in) ---
    // This should be on pages that require authentication (index.html, profile.html)
    // Avoid running this on login.html or signup.html
    const pathsRequiringAuth = ['/index.html', '/profile.html']; // Add other paths as needed
    const currentPath = window.location.pathname;

    if (pathsRequiringAuth.some(path => currentPath.endsWith(path))) {
        const loggedInUser = getLoggedInUser();
        if (!loggedInUser) {
            window.location.href = 'login.html';
        }
    }
});