
// POZOR: Nahraďte tieto hodnoty vlastnými z vášho Firebase projektu!
// 1. Prejdite na https://console.firebase.google.com/
// 2. Vytvorte nový projekt (alebo použite existujúci).
// 3. V nastaveniach projektu (Project Settings) > General, zrolujte dole na "Your apps".
// 4. Kliknite na ikonu webu (</>) a vytvorte novú webovú aplikáciu (alebo použite existujúcu).
// 5. Skopírujte objekt `firebaseConfig` a vložte jeho obsah sem.

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all environment variables are loaded
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing Firebase environment variables. Please check your .env file.');
}