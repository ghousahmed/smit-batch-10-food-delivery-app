
import {auth,createUserWithEmailAndPassword,provider,onAuthStateChanged,signInWithPopup,db,doc,setDoc} from './firebase.js';



let sbtn = document.querySelector("#sbtn"); // get signin btn
let errorPara = document.querySelector("#errorPara"); // get error paragraph

sbtn.addEventListener("click", () => {
  let Email = document.querySelector("#semail"); // get email to signin user
  let password = document.querySelector("#spassword"); // get password to signin user
  let name = document.querySelector("#sname"); // get name of a user
  let phoneNumber = document.querySelector("#pNumber"); // get name of a user
  let Address = document.querySelector("#Address"); // get name of a user

  if (name.value == "") {
    errorPara.innerText = "Please fill name field!";
    setTimeout(() => {
      errorPara.innerHTML = "";
    }, 3000);
  } else {
    // storing data in a array
    let userData = {
      fullName: name.value,//s mean save
      Email: Email.value,
      password: password.value,
      phoneNumber : phoneNumber.value,
      Address:Address.value
    };
    // creating user with eamil and password
    createUserWithEmailAndPassword(auth, userData.Email, userData.password)
      // email value  , password value
      .then(async (userCredential) => {
        const user = userCredential.user; // getting user from firebase
        await setDoc(doc(db, "users", user.uid), {
          // collection name,   unique id of user
          ...userData, // setting array in a database
          userId: user.uid, // also user id in the database
        });
        location.href = "../login.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = errorCode.slice(5).toUpperCase();
        const errMessage = errorMessage.replace(/-/g, " ");
        errorPara.innerText = errMessage;
        setTimeout(() => {
          errorPara.innerHTML = "";
        }, 3000);
      });
  }
});

password.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    sbtn.click();
  }
});

const googleSignInBtn = document.getElementById("googleSignInBtn");

googleSignInBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;

      let userData = {
        name: user.displayName,
        Email: user.email,
      };

      await setDoc(doc(db, "users", user.uid), {
        // collection name,   unique id of user
        ...userData, // setting array in a database
        userId: user.uid, // also user id in the database
      });

      localStorage.setItem("userUid", user.uid);

      location.href = "../index.html";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        
      if (email) {
        errorPara.innerText = email;
        setTimeout(() => {
          errorPara.innerHTML = "";
        }, 3000);
      }
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userUid = user.uid;
  } else {
    localStorage.removeItem("userUid");
  }
});

if (localStorage.getItem("userUid")) {
  location.href = "../index.html";
}
