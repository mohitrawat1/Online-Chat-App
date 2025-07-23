document.addEventListener("DOMContentLoaded", () => {

    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem('loggedInUser'));
    }

    function setLoggedInUser(user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }


    let currentUser = getLoggedInUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const imageInput = document.getElementById("profileImage");
    const profilePic = document.getElementById("profilePic");
    const profileForm = document.getElementById("profileForm");

    nameInput.value = currentUser.name;
    emailInput.value = currentUser.email;
    imageInput.value = currentUser.image;
    profilePic.src = currentUser.image;

    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        currentUser.name = nameInput.value.trim();
        currentUser.image = imageInput.value.trim();

        setLoggedInUser(currentUser);

        let users = getUsers();
        users = users.map(user => {
            if (user.id === currentUser.id) {
                return currentUser;
            }
            return user;
        });
        saveUsers(users);

        alert("Profile updated successfully!");
    });
});
