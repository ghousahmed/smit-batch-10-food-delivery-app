import {auth,onAuthStateChanged,sendPasswordResetEmail} from "./firebase.js"

const usr_email = document.getElementById('user_email');
const usr_passwd = document.getElementById('user_passwd');

export function validEmail() {
    var uemail = document.getElementById('user_email');
    var emailerr = document.getElementById('email_err');
    if (uemail.value == "" || uemail.value == null) {
        uemail.classList.remove("is-valid");
        uemail.classList.add("is-invalid");
        emailerr.innerHTML = "E-mail Address is required";
        return false;
    } else {
        uemail.classList.remove("is-invalid");
        uemail.classList.add("is-valid");
        emailerr.innerHTML = "";
        return true;
    }
}

export async function checkBeforeAuth() {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            location.href = "dashboard.html";
        }
    });
}
export async function resetPassword() {
    await sendPasswordResetEmail(auth, usr_email.value)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Password Reset Email Sent Successfully',
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: 'ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = "index.html";
                }
            })
        })
        .catch((error) => {
            const errorCode = error.code;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorCode
            })
        });
}