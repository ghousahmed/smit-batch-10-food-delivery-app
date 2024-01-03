import { auth, onAuthStateChanged } from "./firebase.js"

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user.email)
        if (user.email !== "admin@gmail.com") {
            location.href = "login.html"
        }

    } else {
        location.href = "login.html"
    }
});