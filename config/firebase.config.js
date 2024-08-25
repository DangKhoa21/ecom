// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// getDownloadURL(checkRef).then((url) => {
//     console.log(url);
//     // Download directly
//     const xhr = new XMLHttpRequest();
//     xhr.responseType = 'blob';
//     xhr.onload = (event) => {
//         const blob = xhr.response;
//     };
//     xhr.open('GET', url);
//     xhr.send();

// }).catch((error) => {
//     // Handle errors
// })

module.exports = {
    // app,
    // storage,
    getStorage() {
        return getStorage(app)
    },
    // checkRef
}