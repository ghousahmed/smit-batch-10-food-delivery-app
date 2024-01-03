import { storage, ref, uploadBytesResumable, getDownloadURL, db, collection, addDoc, getDocs } from "./firebase.js"

let uploadFile = (file, name) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `images/${name.split(" ").join("-")}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL)
                });
            }
        );
    })
}

const getAllRestaurants = async () => {
    try {
        const q = collection(db, "restaurants");
        const querySnapshot = await getDocs(q);
        const resSelect = document.getElementById("restaurant-name");
        let index = 0;
        let restaurants = [];
        resSelect.innerHTML = `<option selected>Select restaurant</option>`
        querySnapshot.forEach((doc) => {
            restaurants.push({ ...doc.data(), id: doc.id })
            index++
            resSelect.innerHTML += `
            <option value="${doc.id}">${doc.data().name}</option>
            `
        });
        return new Promise((resolve, reject) => {
            resolve(restaurants)
        })
    } catch (err) {
        console.log("err", err)
    }
}

getAllRestaurants()

const getAllDishes = async () => {
    const restaurants = await getAllRestaurants();
    const allDishes = document.getElementById("all-dishes");
    const q = collection(db, "dishes");
    const querySnapshot = await getDocs(q);
    let index = 0;
    let restaurantNames = {};
    for (var i = 0; i < restaurants.length; i++) {
        restaurantNames[restaurants[i].id] = restaurants[i].name
    }
    console.log("restaurantNames", restaurantNames)
    allDishes.innerHTML = ``
    querySnapshot.forEach((doc) => {
        index++;
        allDishes.innerHTML += `
                     <tr>
                        <th scope="row">1</th>
                        <td><img class="dish-image" src="${doc.data().image}" alt=""></td>
                        <td>${doc.data().name}</td>
                        <td>${doc.data().price}</td>
                        <td>${doc.data().serving}</td>
                        <td>${restaurantNames[doc.data().restaurant]}</td>
                    </tr>
        `
    });
}

getAllDishes();

const addDish = document.getElementById("addDish");

addDish.addEventListener('click', async () => {
    const closeBtn = document.getElementById("close-btn")
    const spinner = document.getElementById("dish-spinner");
    const resName = document.getElementById("restaurant-name");
    const dishName = document.getElementById("dish-name");
    const dishPrice = document.getElementById("dish-price");
    const dishServing = document.getElementById("dish-serving");
    const dishImage = document.getElementById("dish-image");
    spinner.style.display = "block"
    const image = await uploadFile(dishImage.files[0], dishName.value)
    const dishDetail = {
        restaurant: resName.value,
        name: dishName.value,
        price: dishPrice.value,
        serving: dishServing.value,
        image
    }
    const docRef = await addDoc(collection(db, "dishes"), dishDetail);
    resName.value = "";
    dishName.value = "";
    dishPrice.value = "";
    dishServing.value = "";
    dishImage.value = "";
    spinner.style.display = "none"
    closeBtn.click()
    getAllDishes()
    console.log(docRef)
})