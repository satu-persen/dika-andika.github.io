// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCQ0wAAtqKxMSC4z_vHyuotp8bBxFcmJQ",
  authDomain: "gs://satu-216d6.appspot.com",
  projectId: "satu-216d6",
  storageBucket: "satu-216d6.appspot.com",
  messagingSenderId: "825499597905",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Firestore, and Storage
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const authContainer = document.getElementById('auth-container');
const postContainer = document.getElementById('post-container');
const authTitle = document.getElementById('auth-title');
const authButton = document.getElementById('auth-button');
const logoutButton = document.getElementById('logout-button');
const postButton = document.getElementById('post-button');
const postText = document.getElementById('post-text');
const postImage = document.getElementById('post-image');
const postsContainer = document.getElementById('posts');

// Handle Sign Up and Login
authButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (auth.currentUser) {
    auth.signOut().then(() => {
      authButton.textContent = 'Sign Up';
      authTitle.textContent = 'Sign Up';
    });
  } else {
    auth.createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        alert(error.message);
      });
  }
});

auth.onAuthStateChanged(user => {
  if (user) {
    authContainer.style.display = 'none';
    postContainer.style.display = 'block';
    logoutButton.style.display = 'block';
    loadPosts();
  } else {
    authContainer.style.display = 'block';
    postContainer.style.display = 'none';
    logoutButton.style.display = 'none';
  }
});

// Handle Posting
postButton.addEventListener('click', () => {
  const text = postText.value;
  const file = postImage.files[0];
  
  if (text || file) {
    let imageUrl = '';

    if (file) {
      const storageRef = storage.ref(`images/${file.name}`);
      storageRef.put(file).then(() => {
        return storageRef.getDownloadURL();
      }).then(url => {
        imageUrl = url;
        return db.collection('posts').add({
          text: text,
          imageUrl: imageUrl,
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      }).then(() => {
        postText.value = '';
        postImage.value = '';
        loadPosts();
      }).catch((error) => {
        alert(error.message);
      });
    } else {
      db.collection('posts').add({
        text: text,
        imageUrl: imageUrl,
        uid: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        postText.value = '';
        loadPosts();
      }).catch((error) => {
        alert(error.message);
      });
    }
  }
});

// Load Posts
function loadPosts() {
  db.collection('posts').orderBy('timestamp', 'desc').get().then(querySnapshot => {
    postsContainer.innerHTML = '';
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const postElement = document.createElement('div');
      postElement.textContent = data.text;

      if (data.imageUrl) {
        const img = document.createElement('img');
        img.src = data.imageUrl;
        postElement.appendChild(img);
      }

      postsContainer.appendChild(postElement);
    });
  });
}
