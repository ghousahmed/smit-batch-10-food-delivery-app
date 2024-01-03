import {
  auth,
  signInWithEmailAndPassword,
  db,
  collection,
  getDocs,
  onAuthStateChanged,
} from "./js/firebase.js";

const login = () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      if (user.email === "admin@gmail.com") {
        location.href = "dashboard.html";
      } else {
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("err->", errorMessage);
    });
};

const loginBtn = document.getElementById("loginBtn");

loginBtn && loginBtn.addEventListener("click", login);

const pageSpinner = document.getElementById("page-spinner");

const getAllRestaurants = async () => {
  const resList = document.getElementById("res-list");
  resList.innerHTML = "";
  const q = collection(db, "restaurants");
  const querySnapshot = await getDocs(q);
  let index = 0;
  pageSpinner.style.display = "none";
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    resList.innerHTML += `
        <div class="col">
        <div class="card" style="width: 18rem;">
            <img src="${doc.data().image}"
                class="card-img-top" alt="..." loading="lazy">
            <div class="card-body">
                <h5 class="card-title">${doc.data().name}</h5>
                <p class="card-text">All variety are available
                </p>
                <p>
                    <span class="badge rounded-pill text-bg-primary">Biryani</span>
                    <span class="badge rounded-pill text-bg-primary">Karahi</span>
                    <span class="badge rounded-pill text-bg-primary">Drinks</span>
                </p>
                <a href="dishes.html?restaurant=${
                  doc.id
                }" class="btn btn-primary">View all dishes</a>
            </div>
        </div>
         </div>
        `;
  });
};

onAuthStateChanged(auth, (user) => {
  if (
    (user && location.pathname.indexOf("restaurants") !== -1) ||
    location.pathname === "/"
  ) {
    getAllRestaurants();
  }
});
