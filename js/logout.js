
import {signOut,auth} from "./firebase.js"
export async function logOut() {
    await signOut(auth).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Logout Successfully'
        })
        location.href = "../login.html"
    }).catch((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error
        })
    });
}
document.getElementById('logoutbtn').addEventListener("click", logOut);