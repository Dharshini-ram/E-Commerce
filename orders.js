document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

async function placeOrder() {
  const snapshot = await db.collection("cartItems").get();

  if (snapshot.empty) {
    alert("Cart is empty");
    return;
  }

  let items = [];
  let total = 0;

  snapshot.forEach(doc => {
    const d = doc.data();
    items.push(d);
    total += d.price * d.quantity;
  });

  await db.collection("orders").add({
    userId: "guest",
    items,
    total,
    status: "PLACED",
    orderedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  alert("Order placed successfully!");
}