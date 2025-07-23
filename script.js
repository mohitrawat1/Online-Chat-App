// Gemini Generated Code with the same functionality but with less lines

// document.addEventListener("DOMContentLoaded", async () => {

//   // --- Utility Functions (consistent with auth.js & profile.js) ---
//   function getUsers() {
//     return JSON.parse(localStorage.getItem('users')) || [];
//   }

//   function saveUsers(users) {
//     localStorage.setItem('users', JSON.stringify(users));
//   }

//   function getLoggedInUser() {
//     return JSON.parse(localStorage.getItem('loggedInUser'));
//   }

//   function setLoggedInUser(user) {
//     localStorage.setItem('loggedInUser', JSON.stringify(user));
//   }

//   function findUserById(id) {
//     const users = getUsers();
//     return users.find(user => user.id === id);
//   }

//   function findUserByEmail(email) {
//     const users = getUsers();
//     return users.find(user => user.email === email);
//   }

//   // --- Dummy Data Seeding ---
//   function seedDummyUsers() {
//     let users = getUsers();
//     if (users.length === 0) {
//       console.log("Seeding dummy users...");
//       const dummyData = [];
//       const commonNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy",
//         "Karl", "Laura", "Mike", "Nina", "Oscar", "Pam", "Quinn", "Ray", "Sara", "Tom"];

//       for (let i = 0; i < 20; i++) {
//         const userId = `seed_user_${i + 1}`;
//         const userName = commonNames[i] || `Dummy User ${i + 1}`;
//         dummyData.push({
//           id: userId,
//           name: userName,
//           email: `seed${i + 1}@example.com`,
//           password: 'password123',
//           image: `https://picsum.photos/id/${100 + i}/50`,
//           friends: [],
//           requestsSent: [],
//           requestsReceived: [],
//           posts: []
//         });
//       }
//       saveUsers(dummyData);
//       console.log("Dummy users seeded:", getUsers());
//     } else {
//       console.log("Users already exist in localStorage, skipping dummy data seeding.");
//     }
//   }

//   seedDummyUsers();


//   // --- Global Variables & DOM Elements ---
//   let loggedInUser = getLoggedInUser();

//   const onlineContainer = document.getElementById("online-friends");
//   const suggestionContainer = document.getElementById("friend-suggestions");
//   const postFeed = document.getElementById('post-feed');
//   const loadMoreBtn = document.getElementById('load-more');
//   const feedsContainer = document.querySelector('.center');
//   const bellIcon = document.querySelector(".fa-bell");
//   const userIcon = document.querySelector(".fa-user");
//   const logoutBtn = document.querySelector('.logout-button');

//   // Navbar elements for notifications
//   const notificationCountSpan = document.getElementById('notification-count');
//   const notificationsModal = document.getElementById('notifications-modal');
//   const notificationsList = document.getElementById('notifications-list');

//   // Create Post UI elements
//   const createPostProfilePic = document.getElementById('createPostProfilePic');
//   const createPostUserName = document.getElementById('createPostUserName');
//   const postContentTextarea = document.getElementById('postContent');
//   const addPhotoButton = document.getElementById('addPhotoButton');
//   const imageInputContainer = document.getElementById('imageInputContainer');
//   const postImageInput = document.getElementById('postImage');
//   const createPostForm = document.getElementById('createPostForm');

//   // Search Bar Elements
//   const searchInput = document.getElementById('searchInput');
//   const searchResultsDiv = document.getElementById('searchResults');


//   // --- Authentication Check (Must run after seeding, but before using loggedInUser data) ---
//   if (!loggedInUser) {
//     window.location.href = "login.html";
//     return;
//   }

//   console.log("Logged in as:", loggedInUser.name, "ID:", loggedInUser.id);

//   // --- Populate Create Post UI with loggedInUser data ---
//   if (createPostProfilePic) createPostProfilePic.src = loggedInUser.image || 'https://placehold.co/50x50';
//   if (createPostUserName) createPostUserName.textContent = loggedInUser.name;
//   if (postContentTextarea) postContentTextarea.placeholder = `What's on your mind, ${loggedInUser.name}?`;


//   // --- Core Render Functions ---

//   function renderOnlineFriends() {
//     onlineContainer.innerHTML = '<h3>Online Friends</h3>';
//     if (loggedInUser && loggedInUser.friends && loggedInUser.friends.length > 0) {
//       loggedInUser.friends.forEach(friendId => {
//         const friend = findUserById(friendId);
//         if (friend) {
//           const div = document.createElement("div");
//           div.className = "friend";
//           div.innerHTML = `
//                         <img src="${friend.image}" alt="${friend.name}" width="40" height="40" class="rounded-circle" />
//                         <span>${friend.name}</span>
//                         <div class="status-dot" style="background: green;"></div>
//                     `;
//           onlineContainer.appendChild(div);
//         }
//       });
//     } else {
//       const p = document.createElement('p');
//       p.textContent = 'No friends yet. Add some from suggestions!';
//       onlineContainer.appendChild(p);
//     }
//   }

//   async function renderFriendSuggestions() {
//     suggestionContainer.innerHTML = '<h3>Friend Suggestions</h3>';

//     const allUsers = getUsers();
//     const suggestedUsers = allUsers.filter(user =>
//       user.id !== loggedInUser.id &&
//       !loggedInUser.friends.includes(user.id) &&
//       !loggedInUser.requestsSent.some(req => req.toUserId === user.id && req.status === 'pending') &&
//       !loggedInUser.requestsReceived.some(req => req.fromUserId === user.id && req.status === 'pending')
//     );

//     const maxSuggestionsToDisplay = 10;
//     suggestedUsers.slice(0, maxSuggestionsToDisplay).forEach(user => {
//       const sug = document.createElement("div");
//       sug.className = "suggestion";
//       sug.innerHTML = `
//                 <img src="${user.image}" alt="${user.name}" width="40" height="40" class="rounded-circle" />
//                 <span>${user.name}</span>
//                 <button style="margin-left:auto;" class="add-btn" data-user-id="${user.id}">Add</button>
//             `;
//       suggestionContainer.appendChild(sug);
//     });

//     if (suggestedUsers.length === 0 && suggestionContainer.children.length <= 1) {
//       const p = document.createElement('p');
//       p.textContent = 'No new suggestions at the moment.';
//       suggestionContainer.appendChild(p);
//     }
//   }


//   // --- Friend Request Logic ---
//   suggestionContainer.addEventListener("click", (e) => {
//     if (e.target.classList.contains("add-btn")) {
//       const btn = e.target;
//       const targetUserId = btn.dataset.userId;
//       const targetUser = findUserById(targetUserId);

//       if (!targetUser) {
//         alert("User not found!");
//         return;
//       }

//       const requestAlreadySent = loggedInUser.requestsSent.some(req => req.toUserId === targetUserId && req.status === 'pending');
//       if (requestAlreadySent) {
//         alert(`Friend request already sent to ${targetUser.name}!`);
//         return;
//       }

//       const requestReceivedFromTarget = loggedInUser.requestsReceived.some(req => req.fromUserId === targetUserId && req.status === 'pending');
//       if (requestReceivedFromTarget) {
//         alert(`${targetUser.name} has already sent you a friend request. Check your notifications!`);
//         return;
//       }

//       const requestId = 'req_' + Date.now();

//       loggedInUser.requestsSent.push({
//         requestId: requestId,
//         toUserId: targetUser.id,
//         toUserName: targetUser.name,
//         status: 'pending',
//         timestamp: Date.now()
//       });

//       targetUser.requestsReceived.push({
//         requestId: requestId,
//         fromUserId: loggedInUser.id,
//         fromUserName: loggedInUser.name,
//         status: 'pending',
//         timestamp: Date.now()
//       });

//       let users = getUsers();
//       users = users.map(user => {
//         if (user.id === loggedInUser.id) {
//           return loggedInUser;
//         }
//         if (user.id === targetUser.id) {
//           return targetUser;
//         }
//         return user;
//       });
//       saveUsers(users);
//       setLoggedInUser(loggedInUser);

//       alert(`Friend request sent to ${targetUser.name}!`);
//       btn.textContent = "Sent";
//       btn.style.backgroundColor = 'gray';
//       btn.style.color = 'black';
//       btn.disabled = true;
//     }
//   });

//   // --- Notification Logic ---
//   function updateNotificationBell() {
//     if (loggedInUser && loggedInUser.requestsReceived && loggedInUser.requestsReceived.some(req => req.status === 'pending')) {
//       bellIcon.style.color = "red";
//       if (notificationCountSpan) {
//         const pendingCount = loggedInUser.requestsReceived.filter(req => req.status === 'pending').length;
//         notificationCountSpan.textContent = pendingCount;
//         notificationCountSpan.style.display = pendingCount > 0 ? 'inline-block' : 'none';
//       }
//     } else {
//       bellIcon.style.color = "white";
//       if (notificationCountSpan) {
//         notificationCountSpan.textContent = '0';
//         notificationCountSpan.style.display = 'none';
//       }
//     }
//   }

//   bellIcon.addEventListener("click", (e) => {
//     e.stopPropagation();
//     if (notificationsModal) {
//       notificationsModal.classList.toggle('show');
//       if (notificationsModal.classList.contains('show')) {
//         renderNotifications();
//       }
//     }
//   });

//   window.addEventListener('click', (e) => {
//     if (notificationsModal && e.target !== bellIcon && !bellIcon.contains(e.target) && !notificationsModal.contains(e.target)) {
//       notificationsModal.classList.remove('show');
//     }
//     if (searchResultsDiv && e.target !== searchInput && !searchResultsDiv.contains(e.target) && !searchInput.contains(e.target)) {
//       searchResultsDiv.style.display = 'none';
//     }
//   });


//   function renderNotifications() {
//     if (!notificationsList) return;
//     notificationsList.innerHTML = '';

//     const pendingRequests = loggedInUser.requestsReceived.filter(req => req.status === 'pending');

//     if (pendingRequests.length === 0) {
//       const li = document.createElement('li');
//       li.textContent = 'No new notifications.';
//       notificationsList.appendChild(li);
//     } else {
//       pendingRequests.forEach(request => {
//         const li = document.createElement('li');
//         li.classList.add('notification-item');
//         li.innerHTML = `
//                     <span>Friend request from <strong>${request.fromUserName}</strong></span>
//                     <div class="notification-actions">
//                         <button class="accept-btn" data-request-id="${request.requestId}" data-sender-id="${request.fromUserId}">Accept</button>
//                         <button class="reject-btn" data-request-id="${request.requestId}" data-sender-id="${request.fromUserId}">Reject</button>
//                     </div>
//                 `;
//         notificationsList.appendChild(li);
//       });
//     }
//   }

//   if (notificationsList) {
//     notificationsList.addEventListener('click', (e) => {
//       const requestId = e.target.dataset.requestId;
//       const senderId = e.target.dataset.senderId;

//       if (e.target.classList.contains('accept-btn')) {
//         handleFriendRequest(requestId, senderId, 'accepted');
//       } else if (e.target.classList.contains('reject-btn')) {
//         handleFriendRequest(requestId, senderId, 'rejected');
//       }
//     });
//   }

//   function handleFriendRequest(requestId, senderId, status) {
//     let users = getUsers();
//     let senderUser = users.find(u => u.id === senderId);

//     const requestIndex = loggedInUser.requestsReceived.findIndex(req => req.requestId === requestId);
//     if (requestIndex !== -1) {
//       loggedInUser.requestsReceived.splice(requestIndex, 1);

//       if (status === 'accepted') {
//         if (!loggedInUser.friends.includes(senderId)) {
//           loggedInUser.friends.push(senderId);
//         }
//         if (senderUser && !senderUser.friends.includes(loggedInUser.id)) {
//           senderUser.friends.push(loggedInUser.id);
//         }

//         if (senderUser) {
//           const sentReqIndex = senderUser.requestsSent.findIndex(req => req.requestId === requestId);
//           if (sentReqIndex !== -1) {
//             senderUser.requestsSent.splice(sentReqIndex, 1);
//           }
//         }
//         alert(`You are now friends with ${senderUser ? senderUser.name : 'this user'}!`);

//       } else if (status === 'rejected') {
//         if (senderUser) {
//           const sentReqIndex = senderUser.requestsSent.findIndex(req => req.requestId === requestId);
//           if (sentReqIndex !== -1) {
//             senderUser.requestsSent.splice(sentReqIndex, 1);
//           }
//         }
//         alert(`You rejected the friend request from ${senderUser ? senderUser.name : 'this user'}.`);
//       }
//     } else {
//       console.warn("Request not found in loggedInUser.requestsReceived for ID:", requestId);
//     }

//     users = users.map(user => {
//       if (user.id === loggedInUser.id) {
//         return loggedInUser;
//       }
//       if (senderUser && user.id === senderUser.id) {
//         return senderUser;
//       }
//       return user;
//     });
//     saveUsers(users);
//     setLoggedInUser(loggedInUser);

//     renderNotifications();
//     updateNotificationBell();
//     renderOnlineFriends();
//     renderFriendSuggestions();
//     loadAndDisplayFeedPosts();
//   }


//   // --- Post Feed Logic (Combined Real & Dummy Posts) ---
//   let allFeedPosts = [];
//   let currentIndex = 0;
//   const POSTS_PER_LOAD = 5;

//   async function loadAndDisplayFeedPosts() {
//     postFeed.innerHTML = '';
//     allFeedPosts = [];
//     currentIndex = 0;

//     if (loggedInUser && loggedInUser.posts && loggedInUser.posts.length > 0) {
//       allFeedPosts = allFeedPosts.concat(loggedInUser.posts.map(p => ({
//         ...p,
//         authorName: loggedInUser.name,
//         authorImage: loggedInUser.image,
//         isRealPost: true
//       })));
//     }

//     if (loggedInUser && loggedInUser.friends && loggedInUser.friends.length > 0) {
//       loggedInUser.friends.forEach(friendId => {
//         const friend = findUserById(friendId);
//         if (friend && friend.posts && friend.posts.length > 0) {
//           allFeedPosts = allFeedPosts.concat(friend.posts.map(p => ({
//             ...p,
//             authorName: friend.name,
//             authorImage: friend.image,
//             isRealPost: true
//           })));
//         }
//       });
//     }

//     try {
//       const response = await fetch('https://jsonplaceholder.typicode.com/posts');
//       const dummyPosts = await response.json();
//       const dummyUsersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
//       const dummyUsers = await dummyUsersResponse.json();

//       dummyPosts.slice(0, 50).forEach(post => {
//         const dummyAuthor = dummyUsers.find(u => u.id === post.userId);
//         const randomImageId = Math.floor(Math.random() * 1000) + 100;
//         const postImgId = Math.floor(Math.random() * 1000) + 200;

//         const dummyPost = {
//           postId: 'dummy_' + post.id,
//           title: post.title,
//           text: post.body,
//           imageUrl: `https://picsum.photos/id/${postImgId}/400/250`,
//           timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 30),
//           authorName: dummyAuthor ? dummyAuthor.name : `User ${post.userId} (Dummy)`,
//           authorImage: `https://picsum.photos/id/${randomImageId}/50`,
//           likes: Math.floor(Math.random() * 501),
//           likedBy: [],
//           isRealPost: false
//         };
//         allFeedPosts.push(dummyPost);
//       });

//     } catch (error) {
//       console.error('Error fetching dummy posts or users:', error);
//     }

//     allFeedPosts.sort((a, b) => b.timestamp - a.timestamp);

//     displayNextPosts();
//   }

//   function displayNextPosts() {
//     const nextPosts = allFeedPosts.slice(currentIndex, currentIndex + POSTS_PER_LOAD);

//     if (nextPosts.length === 0 && currentIndex === 0) {
//       const p = document.createElement('p');
//       p.textContent = 'No posts to display from you or your friends. Make a post or add friends!';
//       postFeed.appendChild(p);
//       loadMoreBtn.style.display = 'none';
//       return;
//     }

//     nextPosts.forEach(post => {
//       const postDiv = document.createElement('div');
//       postDiv.classList.add('post');
//       postDiv.innerHTML = `
//                 <div class="post-header">
//                     <img src="${post.authorImage}" alt="${post.authorName}" />
//                     <strong>${post.authorName}</strong>
//                     <span>${new Date(post.timestamp).toLocaleString()}</span>
//                 </div>
//                 <div class="post-content">
//                     <p><strong>${post.title || ''}</strong></p>
//                     <p>${post.text}</p>
//                     ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post-image" />` : ''}
//                 </div>
//                 <div class="post-footer">
//                     <i class="fa-heart ${post.isRealPost && post.likedBy.includes(loggedInUser.id) ? 'fa-solid liked' : 'fa-regular'} like-icon"
//                        data-post-id="${post.postId}" data-author-id="${post.authorId || ''}" data-is-real="${post.isRealPost}"></i>
//                     <span class="like-count">${post.likes || 0}</span> likes
//                 </div>
//             `;
//       postFeed.appendChild(postDiv);
//     });

//     currentIndex += POSTS_PER_LOAD;

//     if (currentIndex >= allFeedPosts.length) {
//       loadMoreBtn.style.display = 'none';
//       feedsContainer.removeEventListener('scroll', handleScroll);
//     } else {
//       loadMoreBtn.style.display = 'block';
//     }
//   }

//   // --- Infinite Scroll Logic ---
//   function handleScroll() {
//     const { scrollTop, scrollHeight, clientHeight } = feedsContainer;
//     if (scrollTop + clientHeight >= scrollHeight - 50) {
//       displayNextPosts();
//     }
//   }

//   feedsContainer.addEventListener('scroll', handleScroll);
//   loadMoreBtn.addEventListener('click', displayNextPosts);

//   // --- Like Functionality ---
//   postFeed.addEventListener('click', function (e) {
//     if (e.target.classList.contains('like-icon')) {
//       const icon = e.target;
//       const postId = icon.dataset.postId;
//       const authorId = icon.dataset.authorId;
//       const isRealPost = icon.dataset.isReal === 'true';
//       const likeCountSpan = icon.nextElementSibling;
//       let currentLikes = parseInt(likeCountSpan.textContent);

//       if (!isRealPost) {
//         icon.classList.toggle('fa-solid');
//         icon.classList.toggle('fa-regular');
//         icon.classList.toggle('liked');
//         if (icon.classList.contains('fa-solid')) {
//           currentLikes += 1;
//         } else {
//           currentLikes -= 1;
//         }
//         likeCountSpan.textContent = currentLikes;
//         return;
//       }

//       let users = getUsers();
//       let authorUser = users.find(u => u.id === authorId);

//       if (!authorUser) {
//         console.error("Author not found for real post:", authorId);
//         return;
//       }

//       const postToLike = authorUser.posts.find(p => p.postId === postId);

//       if (!postToLike) {
//         console.error("Post not found in author's posts:", postId);
//         return;
//       }

//       postToLike.likedBy = postToLike.likedBy || [];

//       if (postToLike.likedBy.includes(loggedInUser.id)) {
//         postToLike.likedBy = postToLike.likedBy.filter(id => id !== loggedInUser.id);
//         currentLikes -= 1;
//         icon.classList.remove('fa-solid', 'liked');
//         icon.classList.add('fa-regular');
//       } else {
//         postToLike.likedBy.push(loggedInUser.id);
//         currentLikes += 1;
//         icon.classList.add('fa-solid', 'liked');
//         icon.classList.remove('fa-regular');
//       }

//       postToLike.likes = currentLikes;
//       likeCountSpan.textContent = currentLikes;

//       saveUsers(users);
//     }
//   });


//   // --- Post Creation Form Logic ---
//   if (addPhotoButton) {
//     addPhotoButton.addEventListener('click', () => {
//       imageInputContainer.style.display = imageInputContainer.style.display === 'none' ? 'block' : 'none';
//       if (imageInputContainer.style.display === 'block') {
//         postImageInput.focus();
//       }
//     });
//   }

//   if (createPostForm) {
//     createPostForm.addEventListener('submit', function (e) {
//       e.preventDefault();

//       const postContent = postContentTextarea.value.trim();
//       const postImage = postImageInput.value.trim();

//       if (!postContent) {
//         alert('Please enter some content for your post.');
//         return;
//       }

//       const newPost = {
//         postId: 'post_' + Date.now(),
//         authorId: loggedInUser.id,
//         text: postContent,
//         imageUrl: postImage,
//         timestamp: Date.now(),
//         likes: 0,
//         likedBy: []
//       };

//       loggedInUser.posts.push(newPost);
//       setLoggedInUser(loggedInUser);

//       let users = getUsers();
//       users = users.map(user => {
//         if (user.id === loggedInUser.id) {
//           return loggedInUser;
//         }
//         return user;
//       });
//       saveUsers(users);

//       alert('Post created successfully!');
//       createPostForm.reset();
//       imageInputContainer.style.display = 'none';
//       loadAndDisplayFeedPosts();
//     });
//   }


//   // --- Search Functionality ---
//   if (searchInput) {
//     searchInput.addEventListener('input', handleSearch);
//     searchInput.addEventListener('click', (e) => e.stopPropagation());
//   }

//   function handleSearch() {
//     const query = searchInput.value.toLowerCase().trim();
//     searchResultsDiv.innerHTML = '';

//     if (query.length === 0) {
//       searchResultsDiv.style.display = 'none';
//       return;
//     }

//     const allUsers = getUsers();
//     const filteredUsers = allUsers.filter(user =>
//       user.id !== loggedInUser.id &&
//       (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
//     );

//     if (filteredUsers.length > 0) {
//       filteredUsers.forEach(user => {
//         const resultItem = document.createElement('div');
//         resultItem.classList.add('search-result-item');
//         resultItem.innerHTML = `
//                     <img src="${user.image}" alt="${user.name}" />
//                     <span>${user.name}</span>
//                 `;
//         // NEW: Link to user_profile.html with userId
//         resultItem.addEventListener('click', () => {
//           window.location.href = `user_profile.html?userId=${user.id}`;
//           searchResultsDiv.style.display = 'none';
//           searchInput.value = '';
//         });
//         searchResultsDiv.appendChild(resultItem);
//       });
//       searchResultsDiv.style.display = 'block';
//     } else {
//       const noResults = document.createElement('div');
//       noResults.classList.add('search-result-item');
//       noResults.textContent = 'No users found.';
//       searchResultsDiv.appendChild(noResults);
//       searchResultsDiv.style.display = 'block';
//     }
//   }


//   // --- Event Listeners for Navbar Icons ---
//   userIcon.addEventListener('click', () => {
//     if (loggedInUser) {
//       window.location.href = 'profile.html';
//     } else {
//       window.location.href = 'login.html';
//     }
//   });

//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//       localStorage.removeItem("loggedInUser");
//       window.location.href = "login.html";
//     });
//   }


//   // --- Initial Renders on Page Load ---
//   renderOnlineFriends();
//   renderFriendSuggestions();
//   await loadAndDisplayFeedPosts();
//   updateNotificationBell();
// });
document.addEventListener("DOMContentLoaded", async function () {

  // --- Utility Functions ---
  function getAllUsersFromLocalStorage() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  }

  function saveAllUsersToLocalStorage(usersArray) {
    localStorage.setItem('users', JSON.stringify(usersArray));
  }

  function getCurrentlyLoggedInUser() {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    return loggedInUserData ? JSON.parse(loggedInUserData) : null;
  }

  function setCurrentlyLoggedInUser(userObject) {
    localStorage.setItem('loggedInUser', JSON.stringify(userObject));
  }

  function findUserByIdNumber(idToFind) {
    const allStoredUsers = getAllUsersFromLocalStorage();
    for (let i = 0; i < allStoredUsers.length; i++) {
      const currentUser = allStoredUsers[i];
      if (currentUser.id === idToFind) {
        return currentUser;
      }
    }
    return null;
  }

  function findUserByEmailAddress(emailToFind) {
    const allStoredUsers = getAllUsersFromLocalStorage();
    for (let i = 0; i < allStoredUsers.length; i++) {
      const currentUser = allStoredUsers[i];
      if (currentUser.email === emailToFind) {
        return currentUser;
      }
    }
    return null;
  }

  // --- Dummy Data Seeding ---
  function seedDummyUsersIntoStorage() {
    let currentUsersInStorage = getAllUsersFromLocalStorage();
    if (currentUsersInStorage.length === 0) {
      console.log("Seeding dummy users...");
      const dummyUsersList = [];
      const commonNamesForDummies = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy",
        "Karl", "Laura", "Mike", "Nina", "Oscar", "Pam", "Quinn", "Ray", "Sara", "Tom"
      ];

      for (let i = 0; i < 20; i++) {
        const userIdValue = `seed_user_${i + 1}`;
        const userNameValue = commonNamesForDummies[i] || `Dummy User ${i + 1}`;
        dummyUsersList.push({
          id: userIdValue,
          name: userNameValue,
          email: `seed${i + 1}@example.com`,
          password: 'password123',
          image: `https://picsum.photos/id/${100 + i}/50`,
          friends: [],
          requestsSent: [],
          requestsReceived: [],
          posts: []
        });
      }
      saveAllUsersToLocalStorage(dummyUsersList);
      console.log("Dummy users seeded.");
    } else {
      console.log("Users already exist, skipping dummy data seeding.");
    }
  }

  seedDummyUsersIntoStorage();


  // --- Global Variables & DOM Elements ---
  let loggedInUser = getCurrentlyLoggedInUser();

  const onlineFriendsContainer = document.getElementById("online-friends");
  const friendSuggestionsContainer = document.getElementById("friend-suggestions");
  const mainPostFeed = document.getElementById('post-feed');
  const loadMorePostsButton = document.getElementById('load-more');
  const centralFeedsArea = document.querySelector('.center');
  const notificationBellIcon = document.querySelector(".fa-bell");
  const userProfileIcon = document.querySelector(".fa-user");
  const logoutButton = document.querySelector('.logout-button');

  const notificationCounterSpan = document.getElementById('notification-count');
  const notificationsPopupModal = document.getElementById('notifications-modal');
  const notificationsDisplayList = document.getElementById('notifications-list');

  const createPostProfilePicture = document.getElementById('createPostProfilePic');
  const createPostUserNameDisplay = document.getElementById('createPostUserName');
  const postContentTextArea = document.getElementById('postContent');
  const addPhotoButtonElement = document.getElementById('addPhotoButton');
  const imageInputArea = document.getElementById('imageInputContainer');
  const postImageInputField = document.getElementById('postImage');
  const createNewPostForm = document.getElementById('createPostForm');

  const searchInputField = document.getElementById('searchInput');
  const searchResultsDisplayDiv = document.getElementById('searchResults');


  // --- Authentication Check ---
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  console.log("Logged in as:", loggedInUser.name);

  // --- Populate Create Post UI ---
  if (createPostProfilePicture) createPostProfilePicture.src = loggedInUser.image || 'https://placehold.co/50x50';
  if (createPostUserNameDisplay) createPostUserNameDisplay.textContent = loggedInUser.name;
  if (postContentTextArea) postContentTextArea.placeholder = `What's on your mind, ${loggedInUser.name}?`;


  // --- Core Render Functions ---

  function renderOnlineFriendsDisplay() {
    onlineFriendsContainer.innerHTML = '<h3>Online Friends</h3>';
    if (loggedInUser && loggedInUser.friends && loggedInUser.friends.length > 0) {
      for (let i = 0; i < loggedInUser.friends.length; i++) {
        const friendId = loggedInUser.friends[i];
        const friendDetails = findUserByIdNumber(friendId);
        if (friendDetails) {
          const friendDiv = document.createElement("div");
          friendDiv.className = "friend";
          friendDiv.innerHTML = `
                        <img src="${friendDetails.image}" alt="${friendDetails.name}" width="40" height="40" class="rounded-circle" />
                        <span>${friendDetails.name}</span>
                        <div class="status-dot" style="background: green;"></div>
                    `;
          onlineFriendsContainer.appendChild(friendDiv);
        }
      }
    } else {
      const noFriendsParagraph = document.createElement('p');
      noFriendsParagraph.textContent = 'No friends yet. Add some from suggestions!';
      onlineFriendsContainer.appendChild(noFriendsParagraph);
    }
  }

  async function renderFriendSuggestionsDisplay() {
    friendSuggestionsContainer.innerHTML = '<h3>Friend Suggestions</h3>';
    const allAvailableUsers = getAllUsersFromLocalStorage();
    const potentialSuggestions = [];

    for (let i = 0; i < allAvailableUsers.length; i++) {
      const currentUserForSuggestion = allAvailableUsers[i];
      if (currentUserForSuggestion.id === loggedInUser.id) continue;

      let isAlreadyFriend = false;
      for (let j = 0; j < loggedInUser.friends.length; j++) {
        if (loggedInUser.friends[j] === currentUserForSuggestion.id) {
          isAlreadyFriend = true;
          break;
        }
      }
      if (isAlreadyFriend) continue;

      let hasSentRequest = false;
      for (let k = 0; k < loggedInUser.requestsSent.length; k++) {
        const sentRequest = loggedInUser.requestsSent[k];
        if (sentRequest.toUserId === currentUserForSuggestion.id && sentRequest.status === 'pending') {
          hasSentRequest = true;
          break;
        }
      }
      if (hasSentRequest) continue;

      let hasReceivedRequest = false;
      for (let l = 0; l < loggedInUser.requestsReceived.length; l++) {
        const receivedRequest = loggedInUser.requestsReceived[l];
        if (receivedRequest.fromUserId === currentUserForSuggestion.id && receivedRequest.status === 'pending') {
          hasReceivedRequest = true;
          break;
        }
      }
      if (hasReceivedRequest) continue;

      potentialSuggestions.push(currentUserForSuggestion);
    }

    const maximumSuggestionsToShow = 10;
    let suggestionsCount = 0;

    for (let i = 0; i < potentialSuggestions.length; i++) {
      if (suggestionsCount >= maximumSuggestionsToShow) break;

      const userToSuggest = potentialSuggestions[i];
      const suggestionDiv = document.createElement("div");
      suggestionDiv.className = "suggestion";
      suggestionDiv.innerHTML = `
                <img src="${userToSuggest.image}" alt="${userToSuggest.name}" width="40" height="40" class="rounded-circle" />
                <span>${userToSuggest.name}</span>
                <button style="margin-left:auto;" class="add-btn" data-user-id="${userToSuggest.id}">Add</button>
            `;
      friendSuggestionsContainer.appendChild(suggestionDiv);
      suggestionsCount++;
    }

    if (potentialSuggestions.length === 0 && friendSuggestionsContainer.children.length <= 1) {
      const noSuggestionsParagraph = document.createElement('p');
      noSuggestionsParagraph.textContent = 'No new suggestions at the moment.';
      friendSuggestionsContainer.appendChild(noSuggestionsParagraph);
    }
  }


  // --- Friend Request Logic ---
  friendSuggestionsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-btn")) {
      const clickedButton = event.target;
      const targetUserId = clickedButton.dataset.userId;
      const targetUser = findUserByIdNumber(targetUserId);

      if (!targetUser) {
        alert("User not found!");
        return;
      }

      let requestAlreadySent = false;
      for (let i = 0; i < loggedInUser.requestsSent.length; i++) {
        const sentReq = loggedInUser.requestsSent[i];
        if (sentReq.toUserId === targetUserId && sentReq.status === 'pending') {
          requestAlreadySent = true;
          break;
        }
      }
      if (requestAlreadySent) {
        alert(`Friend request already sent to ${targetUser.name}!`);
        return;
      }

      let requestReceivedFromTarget = false;
      for (let i = 0; i < loggedInUser.requestsReceived.length; i++) {
        const receivedReq = loggedInUser.requestsReceived[i];
        if (receivedReq.fromUserId === targetUserId && receivedReq.status === 'pending') {
          requestReceivedFromTarget = true;
          break;
        }
      }
      if (requestReceivedFromTarget) {
        alert(`${targetUser.name} has already sent you a friend request. Check your notifications!`);
        return;
      }

      const newRequestId = 'req_' + Date.now();

      loggedInUser.requestsSent.push({
        requestId: newRequestId,
        toUserId: targetUser.id,
        toUserName: targetUser.name,
        status: 'pending',
        timestamp: Date.now()
      });

      targetUser.requestsReceived.push({
        requestId: newRequestId,
        fromUserId: loggedInUser.id,
        fromUserName: loggedInUser.name,
        status: 'pending',
        timestamp: Date.now()
      });

      let allCurrentUsers = getAllUsersFromLocalStorage();
      for (let i = 0; i < allCurrentUsers.length; i++) {
        if (allCurrentUsers[i].id === loggedInUser.id) {
          allCurrentUsers[i] = loggedInUser;
        }
        if (allCurrentUsers[i].id === targetUser.id) {
          allCurrentUsers[i] = targetUser;
        }
      }
      saveAllUsersToLocalStorage(allCurrentUsers);
      setCurrentlyLoggedInUser(loggedInUser);

      alert(`Friend request sent to ${targetUser.name}!`);
      clickedButton.textContent = "Sent";
      clickedButton.style.backgroundColor = 'gray';
      clickedButton.style.color = 'black';
      clickedButton.disabled = true;
    }
  });

  // --- Notification Logic ---
  function updateNotificationBellDisplay() {
    let hasPendingRequests = false;
    if (loggedInUser && loggedInUser.requestsReceived) {
      for (let i = 0; i < loggedInUser.requestsReceived.length; i++) {
        if (loggedInUser.requestsReceived[i].status === 'pending') {
          hasPendingRequests = true;
          break;
        }
      }
    }

    if (hasPendingRequests) {
      notificationBellIcon.style.color = "red";
      if (notificationCounterSpan) {
        let pendingCount = 0;
        for (let i = 0; i < loggedInUser.requestsReceived.length; i++) {
          if (loggedInUser.requestsReceived[i].status === 'pending') {
            pendingCount++;
          }
        }
        notificationCounterSpan.textContent = pendingCount;
        notificationCounterSpan.style.display = pendingCount > 0 ? 'inline-block' : 'none';
      }
    } else {
      notificationBellIcon.style.color = "white";
      if (notificationCounterSpan) {
        notificationCounterSpan.textContent = '0';
        notificationCounterSpan.style.display = 'none';
      }
    }
  }

  notificationBellIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    if (notificationsPopupModal) {
      notificationsPopupModal.classList.toggle('show');
      if (notificationsPopupModal.classList.contains('show')) {
        renderNotificationsList();
      }
    }
  });

  window.addEventListener('click', function (event) {
    if (notificationsPopupModal && event.target !== notificationBellIcon && !notificationBellIcon.contains(event.target) && !notificationsPopupModal.contains(event.target)) {
      notificationsPopupModal.classList.remove('show');
    }
    if (searchResultsDisplayDiv && event.target !== searchInputField && !searchResultsDisplayDiv.contains(event.target) && !searchInputField.contains(event.target)) {
      searchResultsDisplayDiv.style.display = 'none';
    }
  });


  function renderNotificationsList() {
    if (!notificationsDisplayList) return;
    notificationsDisplayList.innerHTML = '';

    const pendingRequestsToDisplay = [];
    if (loggedInUser && loggedInUser.requestsReceived) {
      for (let i = 0; i < loggedInUser.requestsReceived.length; i++) {
        const request = loggedInUser.requestsReceived[i];
        if (request.status === 'pending') {
          pendingRequestsToDisplay.push(request);
        }
      }
    }

    if (pendingRequestsToDisplay.length === 0) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No new notifications.';
      notificationsDisplayList.appendChild(listItem);
    } else {
      for (let i = 0; i < pendingRequestsToDisplay.length; i++) {
        const request = pendingRequestsToDisplay[i];
        const listItem = document.createElement('li');
        listItem.classList.add('notification-item');
        listItem.innerHTML = `
                    <span>Friend request from <strong>${request.fromUserName}</strong></span>
                    <div class="notification-actions">
                        <button class="accept-btn" data-request-id="${request.requestId}" data-sender-id="${request.fromUserId}">Accept</button>
                        <button class="reject-btn" data-request-id="${request.requestId}" data-sender-id="${request.fromUserId}">Reject</button>
                    </div>
                `;
        notificationsDisplayList.appendChild(listItem);
      }
    }
  }

  if (notificationsDisplayList) {
    notificationsDisplayList.addEventListener('click', function (event) {
      const clickedElement = event.target;
      const requestId = clickedElement.dataset.requestId;
      const senderId = clickedElement.dataset.senderId;

      if (clickedElement.classList.contains('accept-btn')) {
        handleFriendRequestAction(requestId, senderId, 'accepted');
      } else if (clickedElement.classList.contains('reject-btn')) {
        handleFriendRequestAction(requestId, senderId, 'rejected');
      }
    });
  }

  function handleFriendRequestAction(requestId, senderId, status) {
    let allUsers = getAllUsersFromLocalStorage();
    let senderUser = null;

    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].id === senderId) {
        senderUser = allUsers[i];
        break;
      }
    }

    let requestFoundIndex = -1;
    for (let i = 0; i < loggedInUser.requestsReceived.length; i++) {
      if (loggedInUser.requestsReceived[i].requestId === requestId) {
        requestFoundIndex = i;
        break;
      }
    }

    if (requestFoundIndex !== -1) {
      loggedInUser.requestsReceived.splice(requestFoundIndex, 1);

      if (status === 'accepted') {
        let isAlreadyFriendLoggedInUser = false;
        for (let i = 0; i < loggedInUser.friends.length; i++) {
          if (loggedInUser.friends[i] === senderId) {
            isAlreadyFriendLoggedInUser = true;
            break;
          }
        }
        if (!isAlreadyFriendLoggedInUser) {
          loggedInUser.friends.push(senderId);
        }

        if (senderUser) {
          let isAlreadyFriendSenderUser = false;
          for (let i = 0; i < senderUser.friends.length; i++) {
            if (senderUser.friends[i] === loggedInUser.id) {
              isAlreadyFriendSenderUser = true;
              break;
            }
          }
          if (!isAlreadyFriendSenderUser) {
            senderUser.friends.push(loggedInUser.id);
          }

          let sentRequestIndex = -1;
          for (let i = 0; i < senderUser.requestsSent.length; i++) {
            if (senderUser.requestsSent[i].requestId === requestId) {
              sentRequestIndex = i;
              break;
            }
          }
          if (sentRequestIndex !== -1) {
            senderUser.requestsSent.splice(sentRequestIndex, 1);
          }
        }
        alert(`You are now friends with ${senderUser ? senderUser.name : 'this user'}!`);

      } else if (status === 'rejected') {
        if (senderUser) {
          let sentRequestIndex = -1;
          for (let i = 0; i < senderUser.requestsSent.length; i++) {
            if (senderUser.requestsSent[i].requestId === requestId) {
              sentRequestIndex = i;
              break;
            }
          }
          if (sentRequestIndex !== -1) {
            senderUser.requestsSent.splice(sentRequestIndex, 1);
          }
        }
        alert(`You rejected the friend request from ${senderUser ? senderUser.name : 'this user'}.`);
      }
    } else {
      console.warn("Request not found in loggedInUser.requestsReceived for ID:", requestId);
    }

    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].id === loggedInUser.id) {
        allUsers[i] = loggedInUser;
      }
      if (senderUser && allUsers[i].id === senderUser.id) {
        allUsers[i] = senderUser;
      }
    }
    saveAllUsersToLocalStorage(allUsers);
    setCurrentlyLoggedInUser(loggedInUser);

    renderNotificationsList();
    updateNotificationBellDisplay();
    renderOnlineFriendsDisplay();
    renderFriendSuggestionsDisplay();
    loadAndDisplayAllFeedPosts();
  }


  // --- Post Feed Logic ---
  let allCombinedFeedPosts = [];
  let currentPostDisplayIndex = 0;
  const NUMBER_OF_POSTS_TO_LOAD_AT_ONCE = 5;

  async function loadAndDisplayAllFeedPosts() {
    mainPostFeed.innerHTML = '';
    allCombinedFeedPosts = [];
    currentPostDisplayIndex = 0;

    if (loggedInUser && loggedInUser.posts && loggedInUser.posts.length > 0) {
      for (let i = 0; i < loggedInUser.posts.length; i++) {
        const userPost = loggedInUser.posts[i];
        allCombinedFeedPosts.push({
          ...userPost,
          authorName: loggedInUser.name,
          authorImage: loggedInUser.image,
          isRealPost: true
        });
      }
    }

    if (loggedInUser && loggedInUser.friends && loggedInUser.friends.length > 0) {
      for (let i = 0; i < loggedInUser.friends.length; i++) {
        const friendId = loggedInUser.friends[i];
        const friendDetails = findUserByIdNumber(friendId);
        if (friendDetails && friendDetails.posts && friendDetails.posts.length > 0) {
          for (let j = 0; j < friendDetails.posts.length; j++) {
            const friendPost = friendDetails.posts[j];
            allCombinedFeedPosts.push({
              ...friendPost,
              authorName: friendDetails.name,
              authorImage: friendDetails.image,
              isRealPost: true
            });
          }
        }
      }
    }

    try {
      const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
      const dummyPostsData = await postsResponse.json();
      const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
      const dummyUsersData = await usersResponse.json();

      for (let i = 0; i < 50 && i < dummyPostsData.length; i++) {
        const apiPost = dummyPostsData[i];
        let dummyAuthorName = `User ${apiPost.userId} (Dummy)`;
        let dummyAuthorImage = `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 100}/50`;

        for (let j = 0; j < dummyUsersData.length; j++) {
          if (dummyUsersData[j].id === apiPost.userId) {
            dummyAuthorName = dummyUsersData[j].name;
            break;
          }
        }

        const randomPostImageId = Math.floor(Math.random() * 1000) + 200;

        allCombinedFeedPosts.push({
          postId: 'dummy_' + apiPost.id,
          title: apiPost.title,
          text: apiPost.body,
          imageUrl: `https://picsum.photos/id/${randomPostImageId}/400/250`,
          timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 30),
          authorName: dummyAuthorName,
          authorImage: dummyAuthorImage,
          likes: Math.floor(Math.random() * 501),
          likedBy: [],
          isRealPost: false
        });
      }

    } catch (error) {
      console.error('Error fetching dummy posts:', error);
    }

    allCombinedFeedPosts.sort(function (a, b) {
      return b.timestamp - a.timestamp;
    });

    displayNextBatchOfPosts();
  }

  function displayNextBatchOfPosts() {
    const postsToDisplayNow = [];
    for (let i = currentPostDisplayIndex; i < currentPostDisplayIndex + NUMBER_OF_POSTS_TO_LOAD_AT_ONCE && i < allCombinedFeedPosts.length; i++) {
      postsToDisplayNow.push(allCombinedFeedPosts[i]);
    }

    if (postsToDisplayNow.length === 0 && currentPostDisplayIndex === 0) {
      const noPostsParagraph = document.createElement('p');
      noPostsParagraph.textContent = 'No posts to display. Make a post or add friends!';
      mainPostFeed.appendChild(noPostsParagraph);
      loadMorePostsButton.style.display = 'none';
      centralFeedsArea.removeEventListener('scroll', handleInfiniteScroll);
      return;
    }

    for (let i = 0; i < postsToDisplayNow.length; i++) {
      const post = postsToDisplayNow[i];
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');

      let isPostLikedByLoggedInUser = false;
      if (post.isRealPost && post.likedBy && post.likedBy.includes(loggedInUser.id)) {
        isPostLikedByLoggedInUser = true;
      }

      postDiv.innerHTML = `
                <div class="post-header">
                    <img src="${post.authorImage}" alt="${post.authorName}" />
                    <strong>${post.authorName}</strong>
                    <span>${new Date(post.timestamp).toLocaleString()}</span>
                </div>
                <div class="post-content">
                    <p><strong>${post.title || ''}</strong></p>
                    <p>${post.text}</p>
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post-image" />` : ''}
                </div>
                <div class="post-footer">
                    <i class="fa-heart ${isPostLikedByLoggedInUser ? 'fa-solid liked' : 'fa-regular'} like-icon"
                       data-post-id="${post.postId}" data-author-id="${post.authorId || ''}" data-is-real="${post.isRealPost}"></i>
                    <span class="like-count">${post.likes || 0} </span> likes
                </div>
            `;
      mainPostFeed.appendChild(postDiv);
    }

    currentPostDisplayIndex += NUMBER_OF_POSTS_TO_LOAD_AT_ONCE;

    if (currentPostDisplayIndex >= allCombinedFeedPosts.length) {
      loadMorePostsButton.style.display = 'none';
      centralFeedsArea.removeEventListener('scroll', handleInfiniteScroll);
    } else {
      loadMorePostsButton.style.display = 'block';
    }
  }

  // --- Infinite Scroll ---
  function handleInfiniteScroll() {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = centralFeedsArea;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      displayNextBatchOfPosts();
    }
  }

  centralFeedsArea.addEventListener('scroll', handleInfiniteScroll);
  loadMorePostsButton.addEventListener('click', displayNextBatchOfPosts);

  // --- Like Functionality ---
  mainPostFeed.addEventListener('click', function (event) {
    if (event.target.classList.contains('like-icon')) {
      const likeIcon = event.target;
      const postId = likeIcon.dataset.postId;
      const postAuthorId = likeIcon.dataset.authorId;
      const isPostReal = likeIcon.dataset.isReal === 'true';
      const likeCountSpanElement = likeIcon.nextElementSibling;
      let currentNumberOfLikes = parseInt(likeCountSpanElement.textContent);

      if (!isPostReal) {
        likeIcon.classList.toggle('fa-solid');
        likeIcon.classList.toggle('fa-regular');
        likeIcon.classList.toggle('liked');
        if (likeIcon.classList.contains('fa-solid')) {
          currentNumberOfLikes += 1;
        } else {
          currentNumberOfLikes -= 1;
        }
        likeCountSpanElement.textContent = currentNumberOfLikes;
        return;
      }

      let allUsersArray = getAllUsersFromLocalStorage();
      let postAuthorUser = null;
      for (let i = 0; i < allUsersArray.length; i++) {
        if (allUsersArray[i].id === postAuthorId) {
          postAuthorUser = allUsersArray[i];
          break;
        }
      }

      if (!postAuthorUser) {
        console.error("Author not found for real post:", postAuthorId);
        return;
      }

      let thePostToLike = null;
      for (let i = 0; i < postAuthorUser.posts.length; i++) {
        if (postAuthorUser.posts[i].postId === postId) {
          thePostToLike = postAuthorUser.posts[i];
          break;
        }
      }

      if (!thePostToLike) {
        console.error("Post not found in author's posts:", postId);
        return;
      }

      if (!thePostToLike.likedBy) {
        thePostToLike.likedBy = [];
      }

      let userHasLiked = false;
      let likedByIndex = -1;
      for (let i = 0; i < thePostToLike.likedBy.length; i++) {
        if (thePostToLike.likedBy[i] === loggedInUser.id) {
          userHasLiked = true;
          likedByIndex = i;
          break;
        }
      }

      if (userHasLiked) {
        thePostToLike.likedBy.splice(likedByIndex, 1);
        currentNumberOfLikes -= 1;
        likeIcon.classList.remove('fa-solid', 'liked');
        likeIcon.classList.add('fa-regular');
      } else {
        thePostToLike.likedBy.push(loggedInUser.id);
        currentNumberOfLikes += 1;
        likeIcon.classList.add('fa-solid', 'liked');
        likeIcon.classList.remove('fa-regular');
      }

      thePostToLike.likes = currentNumberOfLikes;
      likeCountSpanElement.textContent = currentNumberOfLikes;
      saveAllUsersToLocalStorage(allUsersArray);
    }
  });


  // --- Post Creation Form Logic ---
  if (addPhotoButtonElement) {
    addPhotoButtonElement.addEventListener('click', function () {
      if (imageInputArea.style.display === 'none' || imageInputArea.style.display === '') {
        imageInputArea.style.display = 'block';
        postImageInputField.focus();
      } else {
        imageInputArea.style.display = 'none';
      }
    });
  }

  if (createNewPostForm) {
    createNewPostForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const postContent = postContentTextArea.value.trim();
      const postImageUrl = postImageInputField.value.trim();

      if (postContent.length === 0) {
        alert('Please write something for your post.');
        return;
      }

      const newPostObject = {
        postId: 'post_' + Date.now(),
        authorId: loggedInUser.id,
        text: postContent,
        imageUrl: postImageUrl,
        timestamp: Date.now(),
        likes: 0,
        likedBy: []
      };

      loggedInUser.posts.push(newPostObject);
      setCurrentlyLoggedInUser(loggedInUser);

      let allUsersInStorage = getAllUsersFromLocalStorage();
      for (let i = 0; i < allUsersInStorage.length; i++) {
        if (allUsersInStorage[i].id === loggedInUser.id) {
          allUsersInStorage[i] = loggedInUser;
          break;
        }
      }
      saveAllUsersToLocalStorage(allUsersInStorage);

      alert('Post created successfully!');
      createNewPostForm.reset();
      imageInputArea.style.display = 'none';
      loadAndDisplayAllFeedPosts();
    });
  }


  // --- Search Functionality ---
  if (searchInputField) {
    searchInputField.addEventListener('input', handleSearchInput);
    searchInputField.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  function handleSearchInput() {
    const searchText = searchInputField.value.toLowerCase().trim();
    searchResultsDisplayDiv.innerHTML = '';

    if (searchText.length === 0) {
      searchResultsDisplayDiv.style.display = 'none';
      return;
    }

    const allUsersForSearch = getAllUsersFromLocalStorage();
    const foundUsers = [];

    for (let i = 0; i < allUsersForSearch.length; i++) {
      const user = allUsersForSearch[i];
      if (user.id === loggedInUser.id) {
        continue;
      }

      if (user.name.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText)) {
        foundUsers.push(user);
      }
    }

    if (foundUsers.length > 0) {
      for (let i = 0; i < foundUsers.length; i++) {
        const user = foundUsers[i];
        const resultItemDiv = document.createElement('div');
        resultItemDiv.classList.add('search-result-item');
        resultItemDiv.innerHTML = `
                    <img src="${user.image}" alt="${user.name}" />
                    <span>${user.name}</span>
                `;
        resultItemDiv.addEventListener('click', function () {
          window.location.href = `user_profile.html?userId=${user.id}`;
          searchResultsDisplayDiv.style.display = 'none';
          searchInputField.value = '';
        });
        searchResultsDisplayDiv.appendChild(resultItemDiv);
      }
      searchResultsDisplayDiv.style.display = 'block';
    } else {
      const noResultsItem = document.createElement('div');
      noResultsItem.classList.add('search-result-item');
      noResultsItem.textContent = 'No users found.';
      searchResultsDisplayDiv.appendChild(noResultsItem);
      searchResultsDisplayDiv.style.display = 'block';
    }
  }


  // --- Navbar Icon Event Listeners ---
  userProfileIcon.addEventListener('click', function () {
    if (loggedInUser) {
      window.location.href = 'profile.html';
    } else {
      window.location.href = 'login.html';
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }


  // --- Initial Renders ---
  renderOnlineFriendsDisplay();
  renderFriendSuggestionsDisplay();
  await loadAndDisplayAllFeedPosts();
  updateNotificationBellDisplay();
});