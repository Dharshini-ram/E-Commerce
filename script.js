const productGrid = document.getElementById("productGrid");
const brandFilter = document.getElementById("brandFilter");
const priceFilter = document.getElementById("priceFilter");
const searchInput = document.getElementById("searchInput");

const products = [];

// Fetch products from Firestore
db.collection("products").get().then(snapshot => {
  snapshot.forEach(doc => {
    const p = doc.data();
    products.push(p);

    // Populate brand filter
    if (![...brandFilter.options].some(o => o.value === p.brand.toLowerCase())) {
      const opt = document.createElement("option");
      opt.value = p.brand.toLowerCase();
      opt.textContent = p.brand;
      brandFilter.appendChild(opt);
    }
  });

  render(products);
});

// Render products
function render(list) {
  productGrid.innerHTML = "";

  list.forEach(p => {
    const img =
      p.image && p.image.startsWith("http")
        ? p.image
        : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";

    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img src="${img}"
           alt="${p.productname}"
           onerror="this.src='https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=400'">
      <h3>${p.productname}</h3>
      <p><b>Brand:</b> ${p.brand}</p>
      <p><b>Sizes:</b> ${p.sizes}</p>
      <p class="price">₹${p.price}</p>
      <p>${p.discountpercent}% OFF</p>
      <button>Add to Cart</button>
    `;

    productGrid.appendChild(card);
  });
}

// Filters
searchInput.addEventListener("input", filter);
brandFilter.addEventListener("change", filter);
priceFilter.addEventListener("change", filter);

function filter() {
  const s = searchInput.value.toLowerCase();
  const b = brandFilter.value;
  const pr = priceFilter.value;

  render(
    products.filter(p =>
      (!b || p.brand.toLowerCase() === b) &&
      (!pr || p.price <= pr) &&
      JSON.stringify(p).toLowerCase().includes(s)
    )
  );
}
