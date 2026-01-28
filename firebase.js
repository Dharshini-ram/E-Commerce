// firebase.js

var firebaseConfig = {
  apiKey: "AIzaSyCaPivfAKXKGEOlfmohr2EpbxwkJCTXpRo",
  authDomain: "ecommerce-store-dc734.firebaseapp.com",
  projectId: "ecommerce-store-dc734",
  storageBucket: "ecommerce-store-dc734.appspot.com",
  messagingSenderId: "483895527397",
  appId: "1:483895527397:web:50768f8c0294938fb3d10c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebase.firestore();