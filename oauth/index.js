var firebaseConfig = {
    apiKey: "AIzaSyA9bw0MIelWsJYSxTTWEVI_XHgn2zrq36c",
    authDomain: "selene-canje.firebaseapp.com",
    databaseURL: "https://selene-canje.firebaseio.com",
    projectId: "selene-canje",
    storageBucket: "selene-canje.appspot.com",
    messagingSenderId: "86990863213",
    appId: "1:86990863213:web:7a998a59e0bc838f2eb864",
    measurementId: "G-9C5SM3WE9N"
};

firebase.initializeApp(firebaseConfig);

function twitter() {
    var provider = new firebase.auth.TwitterAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        console.log(user);
    }).catch(function(error) {
        console.log(error);
    });
}

function google() {
    close();return;
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        console.log(user);
    }).catch(function(error) {
        alert(error);
    });
}
