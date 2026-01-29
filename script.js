const pages = document.querySelectorAll(".page");
const productGrid = document.getElementById("productGrid");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const products = [];

/* PAGE SWITCH */
function showPage(id) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* LOAD PRODUCTS */
db.collection("products").get().then(snapshot => {
  snapshot.forEach(doc => {
    const p = doc.data();
    p.id = doc.id;
    products.push(p);
  });
  renderProducts();
});

/* RENDER PRODUCTS */
function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.image}" />
      <h4>${p.productname}</h4>
      <p>₹${p.price}</p>
      <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
      <button onclick='buyNow(${JSON.stringify(p)})'>Buy Now</button>
    `;

    productGrid.appendChild(div);
  });
}

/* ADD TO CART (Firestore) */
function addToCart(p) {
  db.collection("cartItems").add({
    productname: p.productname,
    price: p.price,
    image: p.image,
    quantity: 1,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

/* BUY NOW */
function buyNow(p) {
  db.collection("orders").add({
    items: [p],
    totalAmount: p.price,
    status: "PLACED",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Order placed!");
}

/* LOAD CART (REAL-TIME) */
db.collection("cartItems").onSnapshot(snapshot => {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  snapshot.forEach(doc => {
    const c = doc.data();
    total += c.price;

    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        ${c.productname} – ₹${c.price}
      </div>
    `;
  });

  cartTotalSpan.textContent = total;
  cartCount.textContent = snapshot.size;
});

/* PLACE ORDER + CLEAR CART */
function placeOrder() {
  db.collection("cartItems").get().then(snapshot => {

    if (snapshot.empty) {
      alert("Your cart is empty!");
      return;
    }

    let items = [];
    let total = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      items.push(data);
      total += data.price;
    });

    // Save order
    db.collection("orders").add({
      items: items,
      totalAmount: total,
      status: "PLACED",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {

      // 🔥 DELETE CART ITEMS
      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      batch.commit();

      alert("Order placed successfully ✅");
    });

  });
}
