import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');

        getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY }).then((currentToken) => {
            if (currentToken) {
            console.log('Token:', currentToken);
            } else {
            console.log('No registration token available. Request permission to generate one.');
            requestPermission();
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
      }
    });
}

const app = initializeApp(firebaseConfig);
const messaging = getMessaging();

export { app, messaging, getToken, requestPermission };