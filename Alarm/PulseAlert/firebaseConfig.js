// firebaseConfig.js
import firebase from 'firebase/app';  // Import Firebase
import 'firebase/auth';  // If you need Firebase Authentication
import 'firebase/database';  // Realtime Database
import 'firebase/analytics';  // Firebase Analytics (Optional)
import 'firebase/messaging';  // Firebase Cloud Messaging (Optional)

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCs0icXxqN4Z7E6SxUPRn4Qg5FBJ2n44og",
  authDomain: "pulse-alert-10f62.firebaseapp.com",
  databaseURL: "https://pulse-alert-10f62-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pulse-alert-10f62",
  storageBucket: "pulse-alert-10f62.firebasestorage.app",
  messagingSenderId: "436865820945",
  appId: "1:436865820945:web:28147b05ace549318d84b0",
  measurementId: "G-Q4GDTDJXFR",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use it
}
// Firebase services initialization
const database = firebase.database();  // Firebase Realtime Database
const messaging = firebase.messaging();  // Firebase Cloud Messaging
const analytics = firebase.analytics();  // Firebase Analytics (Optional)

// Export Firebase services for use in other parts of the app
export { database, messaging, analytics };
