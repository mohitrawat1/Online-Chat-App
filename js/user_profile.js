document.addEventListener("DOMContentLoaded", function () {
    // --- Helper Functions (Got these from the other main script) ---
    function getUsers() {
        // Gets all user data saved in the browser.
        // It's text, so we gotta turn it into real JavaScript stuff.
        let usersData = localStorage.getItem('users');
        return usersData ? JSON.parse(usersData) : [];
    }

    function saveUsers(users) {
        // Saves all the user data back to the browser.
        // Gotta turn it back into text first.
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getLoggedInUser() {
        // Who's currently signed in?
        let userData = localStorage.getItem('loggedInUser');
        return userData ? JSON.parse(userData) : null;
    }

    function setLoggedInUser(user) {
        // Update the logged-in user's info.
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    function findUserById(id) {
        // Loops through all users to find one by ID.
        const allTheUsers = getUsers();
        for (let i = 0; i < allTheUsers.length; i++) {
            if (allTheUsers[i].id === id) {
                return allTheUsers[i];
            }
        }
        return null; // Not found.
    }

    // --- Main Variables and Page Parts ---
    let loggedInUser = getLoggedInUser();
    let targetUser = null; // This is the user whose profile we're seeing

    // Grabbing elements from the HTML page
    const userProfilePic = document.getElementById('userProfilePic');
    const userProfileName = document.getElementById('userProfileName');
    const userProfileEmail = document.getElementById('userProfileEmail');
    const profileActionsDiv = document.getElementById('profileActions'); // Where friend buttons go
    const userFriendsList = document.getElementById('userFriendsList');
    const noFriendsMessage = document.getElementById('noFriendsMessage');
    const userPostsFeed = document.getElementById('userPostsFeed');
    const noPostsMessage = document.getElementById('noPostsMessage');

    // --- First, Check if Anyone's Logged In ---
    if (!loggedInUser) {
        window.location.href = "login.html"; // Send them to log in!
        return; // Stop the script here
    }

    // --- Figure Out Which User's Profile We're Viewing ---
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('userId'); // Get the ID from the web address

    if (!targetUserId) {
        alert("User ID missing. Redirecting to home.");
        window.location.href = "index.html";
        return;
    }

    targetUser = findUserById(targetUserId); // Find the user in our data

    if (!targetUser) {
        alert("User not found. Redirecting to home.");
        window.location.href = "index.html";
        return;
    }

    console.log("Viewing profile of:", targetUser.name, "ID:", targetUser.id);

    // --- Functions to Show Profile Info ---

    function renderUserProfile() {
        userProfilePic.src = targetUser.image || 'https://placehold.co/120x120';
        userProfileName.textContent = targetUser.name;
        userProfileEmail.textContent = targetUser.email;

        renderProfileActions(); // Show the right friend buttons
        renderUserFriends();    // Show their friends list
        renderUserPosts();      // Show their posts
    }

    function renderProfileActions() {
        profileActionsDiv.innerHTML = ''; // Clear old buttons

        if (loggedInUser.id === targetUser.id) {
            // If it's your own profile
            const ownProfileMessage = document.createElement('span');
            ownProfileMessage.textContent = "This is your profile.";
            ownProfileMessage.classList.add('text-muted');
            profileActionsDiv.appendChild(ownProfileMessage);
        } else if (loggedInUser.friends.includes(targetUser.id)) {
            // If already friends
            const friendsButton = document.createElement('button');
            friendsButton.className = 'btn btn-success me-2';
            friendsButton.textContent = 'Friends';
            friendsButton.disabled = true;
            profileActionsDiv.appendChild(friendsButton);
        } else {
            // Not friends, check for requests
            const hasSentRequest = loggedInUser.requestsSent.some(req => req.toUserId === targetUser.id && req.status === 'pending');
            const hasReceivedRequest = loggedInUser.requestsReceived.some(req => req.fromUserId === targetUser.id && req.status === 'pending');

            if (hasSentRequest) {
                // If I sent them a request
                const sentButton = document.createElement('button');
                sentButton.className = 'btn btn-secondary';
                sentButton.textContent = 'Request Sent';
                sentButton.disabled = true;
                profileActionsDiv.appendChild(sentButton);
            } else if (hasReceivedRequest) {
                // If they sent me a request
                const acceptBtn = document.createElement('button');
                acceptBtn.className = 'btn btn-primary me-2';
                acceptBtn.textContent = 'Accept Request';
                // Store the request ID on the button
                acceptBtn.dataset.requestId = loggedInUser.requestsReceived.find(req => req.fromUserId === targetUser.id).requestId;
                acceptBtn.addEventListener('click', function () {
                    handleFriendRequest(this.dataset.requestId, targetUser.id, 'accepted');
                });
                profileActionsDiv.appendChild(acceptBtn);

                const rejectBtn = document.createElement('button');
                rejectBtn.className = 'btn btn-danger';
                rejectBtn.textContent = 'Reject Request';
                // Store the request ID on the button
                rejectBtn.dataset.requestId = loggedInUser.requestsReceived.find(req => req.fromUserId === targetUser.id).requestId;
                rejectBtn.addEventListener('click', function () {
                    handleFriendRequest(this.dataset.requestId, targetUser.id, 'rejected');
                });
                profileActionsDiv.appendChild(rejectBtn);

            } else {
                // If not friends and no pending requests, show "Add Friend"
                const addFriendBtn = document.createElement('button');
                addFriendBtn.className = 'btn btn-primary';
                addFriendBtn.textContent = 'Add Friend';
                addFriendBtn.addEventListener('click', function () {
                    sendFriendRequest(targetUser.id);
                });
                profileActionsDiv.appendChild(addFriendBtn);
            }
        }
    }

    function renderUserFriends() {
        userFriendsList.innerHTML = ''; // Clear old friends
        if (targetUser.friends && targetUser.friends.length > 0) {
            noFriendsMessage.style.display = 'none';
            targetUser.friends.forEach(friendId => {
                const friend = findUserById(friendId);
                if (friend) {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex align-items-center';
                    li.innerHTML = `
                        <img src="${friend.image}" alt="${friend.name}" class="rounded-circle me-2" width="30" height="30">
                        <span>${friend.name}</span>
                    `;
                    // Make friend names clickable to their profile
                    li.addEventListener('click', function () {
                        window.location.href = `user_profile.html?userId=${friend.id}`;
                    });
                    userFriendsList.appendChild(li);
                }
            });
        } else {
            noFriendsMessage.style.display = 'block';
        }
    }

    function renderUserPosts() {
        userPostsFeed.innerHTML = ''; // Clear old posts
        if (targetUser.posts && targetUser.posts.length > 0) {
            noPostsMessage.style.display = 'none';
            // Sort posts to show newest first
            const sortedPosts = [...targetUser.posts].sort((a, b) => b.timestamp - a.timestamp);

            sortedPosts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post', 'mb-3');
                postDiv.innerHTML = `
                    <div class="post-header">
                        <img src="${targetUser.image}" alt="${targetUser.name}" />
                        <strong>${targetUser.name}</strong>
                        <span>${new Date(post.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="post-content">
                        <p><strong>${post.title || ''}</strong></p>
                        <p>${post.text}</p>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post-image" />` : ''}
                    </div>
                    <div class="post-footer">
                        <i class="fa-heart ${post.likedBy && post.likedBy.includes(loggedInUser.id) ? 'fa-solid liked' : 'fa-regular'} like-icon"
                           data-post-id="${post.postId}" data-author-id="${targetUser.id}" data-is-real="true"></i>
                        <span class="like-count">${post.likes || 0}</span> likes
                    </div>
                `;
                userPostsFeed.appendChild(postDiv);
            });

            // Make the like buttons work!
            userPostsFeed.addEventListener('click', function (e) {
                if (e.target.classList.contains('like-icon')) {
                    const icon = e.target;
                    const postId = icon.dataset.postId;
                    const authorId = icon.dataset.authorId;
                    const likeCountSpan = icon.nextElementSibling;
                    let currentLikes = parseInt(likeCountSpan.textContent);

                    let users = getUsers();
                    let postAuthor = users.find(u => u.id === authorId);

                    if (!postAuthor) {
                        console.error("Post author not found:", authorId);
                        return;
                    }

                    const postToLike = postAuthor.posts.find(p => p.postId === postId);

                    if (!postToLike) {
                        console.error("Post not found:", postId);
                        return;
                    }

                    postToLike.likedBy = postToLike.likedBy || [];

                    if (postToLike.likedBy.includes(loggedInUser.id)) {
                        // Unlike the post
                        postToLike.likedBy = postToLike.likedBy.filter(id => id !== loggedInUser.id);
                        currentLikes -= 1;
                        icon.classList.remove('fa-solid', 'liked');
                        icon.classList.add('fa-regular');
                    } else {
                        // Like the post
                        postToLike.likedBy.push(loggedInUser.id);
                        currentLikes += 1;
                        icon.classList.add('fa-solid', 'liked');
                        icon.classList.remove('fa-regular');
                    }

                    postToLike.likes = currentLikes;
                    likeCountSpan.textContent = currentLikes;

                    saveUsers(users); // Save updated users (with new like count)
                }
            });

        } else {
            noPostsMessage.style.display = 'block';
        }
    }

    // --- Friend Request Actions ---
    function sendFriendRequest(toUserId) {
        const toUser = findUserById(toUserId);
        if (!toUser) {
            alert("User not found!");
            return;
        }

        const requestId = 'req_' + Date.now();

        // Add to MY sent requests
        loggedInUser.requestsSent.push({
            requestId: requestId,
            toUserId: toUser.id,
            toUserName: toUser.name,
            status: 'pending',
            timestamp: Date.now()
        });

        // Add to THEIR received requests
        toUser.requestsReceived.push({
            requestId: requestId,
            fromUserId: loggedInUser.id,
            fromUserName: loggedInUser.name,
            status: 'pending',
            timestamp: Date.now()
        });

        let users = getUsers();
        // Update both user objects in the main list
        users = users.map(user => {
            if (user.id === loggedInUser.id) {
                return loggedInUser;
            }
            if (user.id === toUser.id) {
                return toUser;
            }
            return user;
        });
        saveUsers(users);
        setLoggedInUser(loggedInUser); // Update my stored info

        alert(`Friend request sent to ${toUser.name}!`);
        renderProfileActions(); // Refresh buttons
    }

    function handleFriendRequest(requestId, senderId, status) {
        let users = getUsers();
        let senderUser = users.find(u => u.id === senderId); // This is the target user

        const requestIndex = loggedInUser.requestsReceived.findIndex(req => req.requestId === requestId);
        if (requestIndex !== -1) {
            loggedInUser.requestsReceived.splice(requestIndex, 1); // Remove from my pending

            if (status === 'accepted') {
                // Add each other to friends lists
                if (!loggedInUser.friends.includes(senderId)) {
                    loggedInUser.friends.push(senderId);
                }
                if (senderUser && !senderUser.friends.includes(loggedInUser.id)) {
                    senderUser.friends.push(loggedInUser.id);
                }

                // Remove from their sent requests
                if (senderUser) {
                    const sentReqIndex = senderUser.requestsSent.findIndex(req => req.requestId === requestId);
                    if (sentReqIndex !== -1) {
                        senderUser.requestsSent.splice(sentReqIndex, 1);
                    }
                }
                alert(`You are now friends with ${senderUser ? senderUser.name : 'this user'}!`);

            } else if (status === 'rejected') {
                // Remove from their sent requests
                if (senderUser) {
                    const sentReqIndex = senderUser.requestsSent.findIndex(req => req.requestId === requestId);
                    if (sentReqIndex !== -1) {
                        senderUser.requestsSent.splice(sentReqIndex, 1);
                    }
                }
                alert(`You rejected the friend request from ${senderUser ? senderUser.name : 'this user'}.`);
            }
        }

        // Update both users in the main list
        users = users.map(user => {
            if (user.id === loggedInUser.id) {
                return loggedInUser;
            }
            if (senderUser && user.id === senderUser.id) {
                return senderUser;
            }
            return user;
        });
        saveUsers(users);
        setLoggedInUser(loggedInUser); // Update my stored info

        // Refresh the page parts that changed
        renderProfileActions();
        renderUserFriends();
    }

    // --- Navbar Stuff (Also copied) ---
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }

    const userIcon = document.querySelector(".fa-user");
    if (userIcon) {
        userIcon.addEventListener('click', function () {
            window.location.href = 'profile.html'; // Go to *my* own profile
        });
    }

    // --- Start It All Up! ---
    renderUserProfile();
});
