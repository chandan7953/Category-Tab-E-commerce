document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const productsContainer = document.getElementById("products");
  let productsData = [];

  // Fetch product data from API
  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
      );
      const data = await response.json();
      productsData = data.categories;
      renderProducts(
        productsData.filter((product) => product.category_name === "Men")[0]
          .category_products
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Event listeners for the category tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const category = this.getAttribute("data-category");

      const filteredProducts = productsData.filter(
        (product) => product.category_name === category
      )[0].category_products;
      renderProducts(filteredProducts);
    });
  });

  // Function to render products on the page
  function renderProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
      const price = parseFloat(product.price);
      const compareAtPrice = parseFloat(product.compare_at_price);
      const discount = (
        ((compareAtPrice - price) / compareAtPrice) *
        100
      ).toFixed(0);

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-category", product.category);
      productCard.innerHTML = `
       <img src="${product.image}" alt="${product.title}">
       ${
         product.badge_text
           ? `<span class="tag">${product.badge_text}</span>`
           : ""
       }
       <div class="product-name-brand">
        <h2>${product.title}</h2>
        <p>${product.vendor}</p>
       </div>
       <div class="price-details">
        <span class="price">Rs ${price.toFixed(2)}</span> 
        <span class="old-price">Rs ${compareAtPrice.toFixed(2)}</span>
        <span class="discount">${discount}% Off</span>
       </div>
       <button class="add-to-cart">Add to Cart</button>
      `;
      productsContainer.appendChild(productCard);
    });
  }

  // Fetch and render products on page load
  fetchProducts();
});
