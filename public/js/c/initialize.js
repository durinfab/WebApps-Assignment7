/**
 * @fileOverview  Defining the main namespace ("public library") and its MVC subnamespaces
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
'use strict';
// main namespace pl = "public library"
const pl = {m:{}, v:{}, c:{}};
// initialize Cloud Firestore through Firebase
// TODO: Replace the following with your app's Firebase project configuration
if (!firebase.apps.length) {
  firebase.initializeApp({
      apiKey: "AIzaSyA1grAKqH38zkcH8zm-oWZCDcLTj6-VVLw",
      authDomain: "bubbleboba-a0991.firebaseapp.com",
      projectId: "bubbleboba-a0991"
  });
} else { // if already initialized
  firebase.app();
}
// initialize Firestore database interface
const db = firebase.firestore();
