import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyC0oYWl2_qw696TyUWFzIG8-uFDHi7qhmg",
    authDomain: "alumni-game-2017.firebaseapp.com",
    databaseURL: "https://alumni-game-2017.firebaseio.com",
    projectId: "alumni-game-2017",
    storageBucket: "",
    messagingSenderId: "690262446418"
};
firebase.initializeApp(config);

export default firebase;
