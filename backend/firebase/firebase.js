// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import { GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeihbQl41WWMQsGjAgs7QF7JZPh46t5vI",
  authDomain: "text-adventure-d0c89.firebaseapp.com",
  projectId: "text-adventure-d0c89",
  storageBucket: "text-adventure-d0c89.appspot.com",
  messagingSenderId: "125954408824",
  appId: "1:125954408824:web:06d9f43d835eb63f9a088d",
  measurementId: "G-BRK6MJ2G66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();



const login = document.getElementById('login-btn');
if (login) {

  login.addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...


      // Redirect to the User Dashboard
      console.log(user);
      console.log(token);

      console.log('Redirecting to Dashboard');

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(error);
      console.log(errorMessage);
    });
  });
  
}





