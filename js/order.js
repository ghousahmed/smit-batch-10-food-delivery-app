import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  db,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "./firebase.js";
const placeOrder = document.getElementById("placeOrder");
const addressRegex = /^[a-zA-Z0-9,]{10,}/;
const phoneNumberRegex = /^(\+92|92|0)?[3-9]\d{9}$/;

placeOrder && placeOrder.addEventListener("click", async () => {
    const cartDiv = document.getElementById("cart");
    const customerName = document.getElementById("customerName");
    const customerContact = document.getElementById("customerContact");
    const customerAddress = document.getElementById("customerAddress");
    const cart = JSON.parse(localStorage.getItem("cart"));
    const sum = cart.reduce((a, b) => a + Number(b.price) * b.qty, 0);
    const totalAmount = document.getElementById("totalAmount");
    const closeBtn = document.getElementById("closeBtn");
    if (!customerName.value.trim()) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Please enter your name",
      });
    }else if(!customerContact.value.match(phoneNumberRegex)){
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Please enter valid contact number .Number should not be greater than 11 numbers ",
      });
    } 
    else if(!customerAddress.value.match(addressRegex)){
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Invalid address format. Please enter a valid address..",
      });
    } else {
      const orderDetails = {
        customerName: customerName.value,
        customerContact: customerContact.value,
        customerAddress: customerAddress.value,
        status: "pending",
        cart,
        timestamp: serverTimestamp(),
        orderAmount: sum,
        deliveryCharges: 100,
        totalAmount: sum + 100,
      };
      await addDoc(collection(db, "orders"), orderDetails);
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "Your order has been placed",
        showConfirmButton: false,
        timer: 1500,
      });
      customerName.value = "";
      customerContact.value = "";
      customerAddress.value = "";
      localStorage.removeItem("cart");
      cartDiv.innerHTML = "";
      totalAmount.innerHTML = "";
      closeBtn.click();
    }
  });

const getAllOrders = async () => {
  const pageSpinner = document.getElementById("page-spinner");
  const mainContent = document.getElementById("main-content");
  const allOrders = document.getElementById("all-orders");
  const q = collection(db, "orders");
  const querySnapshot = await getDocs(q);
  let index = 0;
  querySnapshot.forEach((doc) => {
    index++;
    console.log("order", doc.data());
    let status = doc.data().status;
    let statusColor = "";
    if (status === "pending") {
      statusColor = "text-bg-warning";
    }
    if (status === "delivered") {
      statusColor = "text-bg-success";
    }
    allOrders.innerHTML += `
<tr>
    <th scope="row">${index}</th>
    <td>${doc.data().customerName}</td>
    <td>${doc.data().customerContact}</td>
    <td>${doc.data().customerAddress}</td>
    <td><span class="badge ${statusColor}">${status}</span>
    </td>
    <td>${doc.data().totalAmount}</td>
    <td>
    <button onclick="viewOrderDetail('${
      doc.id
    }')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    View details
</button>
    </td>
</tr>
    `;
  });
  pageSpinner.style.display = "none";
  mainContent.style.display = "block";
};

getAllOrders();

let updateOrderId;

const viewOrderDetail = async (id) => {
  updateOrderId = id;
  const cart = document.getElementById("cart");
  const orderStatus = document.getElementById("orderStatus");
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);
  const cartItems = docSnap.data().cart;
  orderStatus.value = docSnap.data().status;
  cart.innerHTML = "";
  for (var i = 0; i < cartItems.length; i++) {
    cart.innerHTML += `
                <div class="card dish-card w-100 mb-3">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">
                                                <img class="dish-image"
                                                    src="${
                                                      cartItems[i].image
                                                    }" />
                                                <div class="p-2">
                                                    <h5 class="card-title">${
                                                      cartItems[i].name
                                                    }</h5>
                                                    <h3 class="card-title">Rs: ${
                                                      cartItems[i].price
                                                    } /- x ${
      cartItems[i].qty
    } = ${cartItems[i].price * cartItems[i].qty}</h3>
                                                    <p class="card-text">Serves ${
                                                      cartItems[i].serving
                                                    }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                `;
  }
};

const updateOrder = document.getElementById("updateOrder");

updateOrder.addEventListener("click", async () => {
  const closeBtn = document.getElementById("close-btn");
  const orderStatus = document.getElementById("orderStatus");
  const docRef = doc(db, "orders", updateOrderId);
  await updateDoc(docRef, {
    status: orderStatus.value,
  });
  closeBtn.click();
  getAllOrders();
});

window.viewOrderDetail = viewOrderDetail;
