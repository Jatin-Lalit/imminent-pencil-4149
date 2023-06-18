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


// post a product vishant ++++++++++++++++++++++
document.getElementById("hairProductForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the form field values
    // var uniqueHairProductId = document.getElementById("uniqueHairProductId").value;
    var hairProductImage = document.getElementById("hairProductImage").value;
    var hairProductName = document.getElementById("hairProductName").value;
    var description = document.getElementById("description").value;
    var price = parseFloat(document.getElementById("price").value);
    var genderType = document.getElementById("genderType").value;

    // Create the request body based on the form field values
    var data = {
        // uniqueHairProductId: uniqueHairProductId,
        hairProductImage: hairProductImage,
        hairProductName: hairProductName,
        description: description,
        price: price,
        genderType: genderType
    };

    try {
        const response = await fetch("http://localhost:8080/product/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}` // Include the JWT token in the Authorization header if needed
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Success:", result);
        // Handle the success response here
    } catch (error) {
        console.error("Error:", error);
        // Handle the error here
    }
});
// post a product vishant ------------
// update a product vishant ++++++++++++

document.getElementById("update-product-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the form field values
    var productName = document.getElementById("productu-name").value;
    var productDescription = document.getElementById("productu-description").value;
    var productPrice = parseFloat(document.getElementById("productu-price").value);
    var productImage = document.getElementById("productu-image1").value;

    // Create the request body based on the form field values
    var data = {
        productName: productName,
        productDescription: productDescription,
        productPrice: productPrice,
        productImage: productImage
    };

    try {
        const response = await fetch("http://localhost:8000/product/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}` // Include the JWT token in the Authorization header if needed
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Success:", result);
        // Handle the success response here
    } catch (error) {
        console.error("Error:", error);
        // Handle the error here
    }
});
// update a product vishant ------------


// add and update  a barber vishant +++++++++++++++++++
// Function to handle adding a barber
async function addBarber(event) {
    event.preventDefault();

    const form = document.getElementById("add-barber-form");
    const formData = new FormData(form);

    const barberData = {
        name: formData.get("barber-name"),
        email: formData.get("barber-email"),
        password: formData.get("barber-password"),
        phoneNumber: formData.get("barber-phone"),
        specialization: formData.get("barber-specialization"),
        experience: parseInt(formData.get("barber-experience")),
        profilePic: formData.get("barber-profile-pic"),
    };

    try {
        const response = await fetch("http://localhost:8000/barber/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(barberData),
        });

        const result = await response.json();
        console.log("Success:", result);
        // Handle success response as needed
    } catch (error) {
        console.error("Error:", error);
        // Handle error response as needed
    }
}

// Function to handle updating a barber
async function updateBarber(event) {
    event.preventDefault();

    const form = document.getElementById("update-barber-form");
    const formData = new FormData(form);

    const barberData = {
        id: formData.get("barber-id"),
        name: formData.get("barber-name"),
        email: formData.get("barber-email"),
        password: formData.get("barber-password"),
        phoneNumber: formData.get("barber-phone"),
        specialization: formData.get("barber-specialization"),
        experience: parseInt(formData.get("barber-experience")),
        profilePic: formData.get("barber-profile-pic"),
    };

    try {
        const response = await fetch("http://localhost:8000/barber/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(barberData),
        });

        const result = await response.json();
        console.log("Success:", result);
        // Handle success response as needed
    } catch (error) {
        console.error("Error:", error);
        // Handle error response as needed
    }
}

document.getElementById("add-barber-form").addEventListener("submit", addBarber);
document.getElementById("update-barber-form").addEventListener("submit", updateBarber);

// add and update  a barber vishant ------------------


// get barber cards on barber page vishant ++++++++++++++
// const barberUser = JSON.parse(localStorage.getItem("barberUser")) || [];

async function fetchBarbers() {
    try {
        const response = await fetch("http://localhost:8080/barber/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        console.log("Success:", result);
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}

function generateBarberCards(barbers) {
    const barberContainer = document.getElementById("barberItems");
    const barberCategory = document.getElementById("pcat1");
    barberCategory.textContent = "Barbers";

    barbers.forEach((barber) => {
        const barberCard = document.createElement("li");
        barberCard.className = "barber-card";

        const barberImage = document.createElement("img");
        barberImage.src = barber.profilePic;
        barberImage.alt = barber.name;

        const barberName = document.createElement("h3");
        barberName.textContent = barber.name;

        const barberSpecialization = document.createElement("p");
        barberSpecialization.textContent = "Specialization: " + barber.specialization;

        const barberExperience = document.createElement("p");
        barberExperience.textContent = "Experience: " + barber.experience + " years";

        barberCard.appendChild(barberImage);
        barberCard.appendChild(barberName);
        barberCard.appendChild(barberSpecialization);
        barberCard.appendChild(barberExperience);

        barberContainer.appendChild(barberCard);
    });
}

setTimeout(async () => {
    const barbers = await fetchBarbers();
    generateBarberCards(barbers);
}, 2000);

// get barber cards on barber page vishant -------------

// to count total number of bookings vishant ++++++++++++++
// Function to count total number of bookings
async function countBookings() {
    try {
        const response = await fetch('http://localhost:8080/hairstylebooking/get');
        const bookings = await response.json();
        const totalBookings = bookings.length;

        // Append the count to the HTML element
        const bookingsElement = document.getElementById('Bookings');
        bookingsElement.textContent = totalBookings.toString();
    } catch (error) {
        console.error('Error counting bookings:', error);
    }
}

// Call the countBookings function to update the HTML
countBookings();

// to count total number of bookings vishant ------------

// Function to count total number of customers registered
async function countCustomers() {
    try {
        const response = await fetch('http://localhost:8080/user/get');
        const customers = await response.json();
        const totalCustomers = customers.length;

        // Append the count to the HTML element
        const customersElement = document.getElementById('Customers');
        customersElement.textContent = totalCustomers.toString();
    } catch (error) {
        console.error('Error counting customers:', error);
    }
}

// Function to count total number of barbers registered
async function countBarbers() {
    try {
        const response = await fetch('http://localhost:8080/barber/get');
        const barbers = await response.json();
        const totalBarbers = barbers.length;

        // Append the count to the HTML element
        const barbersElement = document.getElementById('Barbers');
        barbersElement.textContent = totalBarbers.toString();
    } catch (error) {
        console.error('Error counting barbers:', error);
    }
}

// Call the countCustomers and countBarbers functions to update the HTML
countCustomers();
countBarbers();



async function calculateTotalOrderPrice() {
    try {
        const response = await fetch(`http://localhost:8080/order/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const order = await response.json();
            console.log("🚀 ~ file: admin.js:354 ~ calculateTotalOrderPrice ~ order:", order)
            let total = 0;
            order.forEach((item) => {
                total += item.totalAmount;
            });
            const totalOrderPriceElement = document.getElementById("TotalOrderPrice");
            totalOrderPriceElement.innerText = total;
            console.log("Total Order Price:", total);
        } else {
            throw new Error("Failed to fetch order");
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
calculateTotalOrderPrice()

//   to get the number of orders vishant ++++++++++++++++++++++
async function fetchProductOrders() {
    try {
        const response = await fetch("http://localhost:8080/order/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const productOrders = await response.json();
            console.log("Success:", productOrders);
            return productOrders;
        } else {
            throw new Error("Failed to fetch product orders");
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function updateProductOrderCount() {
    try {
        const productOrders = await fetchProductOrders();
        console.log("🚀 ~ file: admin.js:398 ~ updateProductOrderCount ~ productOrders:", productOrders)
        const orderCount = productOrders.length;
        const orderCountElement = document.getElementById("orders");
        orderCountElement.innerText = orderCount.toString();
        console.log("Product Order Count:", orderCount);
    } catch (error) {
        console.error("Error:", error);
    }
}
updateProductOrderCount()
//   to get the number of orders vishant ---------------------