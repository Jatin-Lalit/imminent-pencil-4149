// Function to fetch hair products from the API
const barberUser = JSON.parse(localStorage.getItem("barberUser")) || [];
console.log("🚀 ~ file: admin.js:3 ~ barberUser:", barberUser)
async function fetchHairProducts() {
    try {
        //   const token = "YOUR_JWT_TOKEN"; // Replace with your actual JWT token

        const response = await fetch("http://localhost:8080/product/get", {
            method: "GET", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
                //   Authorization: ``, // Include the JWT token in the Authorization header
            },
        });

        const result = await response.json();
        console.log("Success:", result);
        return result
    } catch (error) {
        console.error("Error:", error);
    }
}


// Function to generate product cards
function generateProductCards(products) {
    const productContainer = document.getElementById("items");
    const productCategory = document.getElementById("pcat");
    productCategory.textContent = "Hair Products";

    products.forEach((product) => {
        const productCard = document.createElement("li");
        productCard.className = "product-card";

        const productImage = document.createElement("img");
        productImage.src = product.hairProductImage;
        productImage.alt = product.hairProductName;

        const productName = document.createElement("h3");
        productName.textContent = product.hairProductName;

        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("p");
        productPrice.textContent = "Price: $" + product.price.toFixed(2);

        const productGender = document.createElement("p");
        productGender.textContent = "Gender: " + product.genderType;

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);
        productCard.appendChild(productGender);

        productContainer.appendChild(productCard);
    });
}

// Fetch hair products and generate product cards on page load
setTimeout(async () => {
    const hairProducts = await fetchHairProducts();

    generateProductCards(hairProducts);
}, 2000);
