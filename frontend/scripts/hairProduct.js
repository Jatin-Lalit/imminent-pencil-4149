window.addEventListener("load",()=>{
  let token = localStorage.getItem("token")
  let logintag=document.getElementById("login-tag")
  if(token){
    logintag.innerHTML = "Logout"
    logintag.removeAttribute("href")
    logintag.addEventListener("click", (e)=>{
      e.preventDefault()
      Swal.fire(
        '',
        '<h3>Logout Success</h3>',
        'success'
      ).then((res)=>{
        localStorage.clear()
        window.location.href = "index.html"
      })
    })
    return
  }
})


//"https://elegant-hare-dungarees.cyclic.app"
const baseUrl = "http://localhost:8080/hairstyle";
let BuyItems = JSON.parse(localStorage.getItem("items")) || [];
///api fetch
mainFunction();

async function mainFunction() {
  try {
    let res = await fetch(`${baseUrl}/all`);

    let data = await res.json();
    console.log(data)

    displayProduct(data.styles);

    let WomenData = await fetch(`${baseUrl}/female`);

    let Women = await WomenData.json();

    let MenData = await fetch(`${baseUrl}/male`);

    let Men = await MenData.json();

    let UnisexData = await fetch(`${baseUrl}/unisex`)

    let Unisex = await UnisexData.json()

 
    document.querySelector(".WomenSort").addEventListener("click", function () {
      sort_by_women(Women);
    });

    document.querySelector(".MenSort").addEventListener("click", function () {
      sort_by_men(Men);
    });

    document.querySelector(".UnisexSort").addEventListener("click", function() {
      sort_by_unisex(Unisex)
    })

 
  document.querySelector(".WomenSort").addEventListener("click", function () {
    sort_by_women(Women);
  });

  document.querySelector(".MenSort").addEventListener("click", function () {
    sort_by_men(Men);
  });

  document.querySelector(".UnisexSort").addEventListener("click", function() {
    sort_by_unisex(Unisex)
  })



    document.getElementById("low").addEventListener("click", function () {
      sort_price(data.styles);
    });

    document.getElementById("high").addEventListener("click", function () {
      sort_price_high(data.styles);
    });
  
  } catch (error) {
    console.log("err:", error);
  }
}

function displayProduct(data) {
  //Render in the form of card
  data.map(function (ele) {
    let container = document.createElement("div");
    //image
    let img = document.createElement("img");
    img.setAttribute("src", ele.hairstyleimage);
    img.setAttribute("class", "proClass");

    //title
    let name_div = document.createElement("div");
    name_div.setAttribute("class", "name_pro_div");
    let title = document.createElement("h2");
    title.textContent = ele.hairstyleName;

    let price = document.createElement("h2");
    price.textContent = "₹" + ele.price;
    price.setAttribute("class", "price");

    name_div.append(title, price);
    title.setAttribute("class", "proname");

    //category
    let category = document.createElement("p");
    category.textContent = ele.genderType;
    category.setAttribute("class", "quantity");

    let span = document.createElement("p");
    span.innerText = ele.description;
    span.setAttribute("class", "dis");

    let Buy = document.createElement("button");
    Buy.setAttribute("id", "buy-btn");
    Buy.innerText = "Select";
    // Buy.classList = "Buy";
    Buy.addEventListener("click", () => {
      buy(ele);
   
    
    });
    container.append(img, name_div, category, span, Buy);

    document.querySelector("#all_products").append(container);

    //store details for new page
    let data_send = {
      img: ele.hairstyleimage,
      name_div: ele.hairstyleName,
      description: ele.description,
      price: ele.price,
      category: ele.category,
      type: ele.genderType,
    };
  });
}

// WoMen category
function sort_by_women(Women) {
  document.querySelector("#all_products").innerHTML = null;

  displayProduct(Women);
}

// Men category
function sort_by_men(men) {
  document.querySelector("#all_products").innerHTML = null;

  displayProduct(men);
}

  
// Unisex category
function sort_by_unisex(unisex) {
  document.querySelector("#all_products").innerHTML = null;

  displayProduct(unisex);
}

//  filter low to high price
function sort_price(data) {
  document.querySelector("#all_products").innerHTML = null;
  data.sort(function (a, b) {
    console.log(a.price);
    return Number(a.price) - Number(b.price);
  });
  displayProduct(data);
}

//filter high to low price
function sort_price_high(data) {
  document.querySelector("#all_products").innerHTML = null;
  data.sort(function (a, b) {
    return Number(b.price) - Number(a.price);
    //  console.log(a.price)
  });
  displayProduct(data);
}


///------------>>>>>>   Buy Function <<<<<<<<<<------------------------

async function buy(ele) {
    
    document.getElementById("card-div").style.display="block"
      document.getElementById("name").innerText=ele.hairstyleName
      let img = document.createElement("img");
    img.setAttribute("src", ele.hairstyleimage);
    // document.getElementById("card-img").append(img)
}
