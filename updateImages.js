const imageFileInput = document.createElement("input");
imageFileInput.type = "file";
imageFileInput.accept = ".json";
imageFileInput.style.display = "none";
document.body.appendChild(imageFileInput);

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    const data = JSON.parse(e.target.result);

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (!item.productId || !item.image) continue;

      const snap = await db
        .collection("products")
        .where("productId", "==", item.productId)
        .get();

      if (snap.empty) {
        console.warn("No product found:", item.productId);
        continue;
      }

      snap.forEach(async (doc) => {
        await db.collection("products").doc(doc.id).update({
          image: item.image
        });
        console.log("Updated image for", item.productId);
      });
    }

    alert("✅ Images updated successfully!");
  };

  reader.readAsText(file);
});

// Run once automatically
setTimeout(() => imageFileInput.click(), 1000);