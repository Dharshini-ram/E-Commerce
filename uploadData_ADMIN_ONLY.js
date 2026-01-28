// uploadData.js

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("jsonFile");

const BATCH_SIZE = 100;

uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a JSON file");
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {
    const data = JSON.parse(e.target.result);

    try {
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const chunk = data.slice(i, i + BATCH_SIZE);

        chunk.forEach((product) => {
          const docRef = db
            .collection("products")
            .doc(product.productId);

          batch.set(docRef, {
            productId: product.productId,
            brand: product.brand,
            productname: product.productname,
            sizes: product.sizes,
            price: product.price,
            discountpercent: product.discountpercent,
            category: product.category,
            image: product.image || "https://via.placeholder.com/300x400?text=Fashion"
          });
        });

        await batch.commit();
        console.log(`Uploaded ${i + chunk.length} products`);
      }

      alert("✅ All products uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Check console.");
    }
  };

  reader.readAsText(file);
});
