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
  
    //   let HairKitData = await fetch(`${baseUrl}/product/HairKit`);
  
    //   let HairKit = await HairKitData.json();
  
    //   let ComboData = await fetch(`${baseUrl}/product/Combo`);
  
    //   let Combo = await ComboData.json();
  
    //   let HairData = await fetch(`${baseUrl}/product/Hair`);
  
    //   let Hair = await HairData.json();
  
    //   let MINIATUREData = await fetch(`${baseUrl}/product/MINIATURE`);
  
    //   let MINIATURE = await MINIATUREData.json();
  
    //   let CreamData = await fetch(`${baseUrl}/product/Cream`);
  
    //   let Cream = await CreamData.json();
  
      //Filter by category and type
      document.querySelector(".WomenSort").addEventListener("click", function () {
        sort_by_women(Women);
      });
  
      document.querySelector(".MenSort").addEventListener("click", function () {
        sort_by_men(Men);
      });

      document.querySelector(".UnisexSort").addEventListener("click", function() {
        sort_by_unisex(Unisex)
      })
  
    //   document.querySelector(".HairKit").addEventListener("click", function () {
    //     filter_by_HairKit(HairKit);
    //   });
  
    //   document.querySelector(".Combo").addEventListener("click", function () {
    //     sort_by_men(Combo);
    //   });
  
    //   document.querySelector(".Hair").addEventListener("click", function () {
    //     sort_by_women(Hair);
    //   });
  
    //   document.querySelector(".MINIATURE").addEventListener("click", function () {
    //     sort_by_men(MINIATURE);
    //   });
  
    //   document.querySelector(".Cream").addEventListener("click", function () {
    //     sort_by_men(Cream);
    //   });


      ///sorting
      document.querySelector(".dis_low").addEventListener("click", function () {
        sort_dis_price(data.product);
      });
  
      document.querySelector(".dis_high").addEventListener("click", function () {
        sort_dis_high(data.product);
      });
  
      document.querySelector(".low").addEventListener("click", function () {
        sort_price(data.product);
      });
  
      document.querySelector(".high").addEventListener("click", function () {
        sort_price_high(data.product);
      });
      document.querySelector(".rating_low").addEventListener("click", function () {
        sort_rating(data.product);
      });
  
      document.querySelector(".rating_high").addEventListener("click", function () {
        sort_rating_high(data.product);
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
  
    //   let rating_div = document.createElement("div");
    //   rating_div.setAttribute("class", "div5");
    //   let rating = document.createElement("p");
    //   rating.textContent = `${ele.rating}★`;
  
    //   rating.setAttribute("class", "rating");
    //   rating_div.append(rating);
  
    //   let mrp_price = document.createElement("p");
    //   mrp_price.setAttribute("id", "price-box");
    //   let span2 = document.createElement("span");
    //   span2.textContent = `MRP ₹${ele.price}`;
    //   span2.setAttribute("class", "mrp");
  
      let span = document.createElement("p");
      span.innerText = ele.description;
      span.setAttribute("class", "dis");
  
      let Buy = document.createElement("button");
      Buy.setAttribute("id", "buy-btn");
      Buy.innerText = "Select";
      Buy.classList = "Buy";
      Buy.addEventListener("click", () => {
        buy(ele);
        // BuyItems.push(ele)
        // localStorage.setItem("items",JSON.stringify(BuyItems));
        // window.location.href = "payment.html";
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

  // filter_by_HairKit
//   function filter_by_HairKit(HairKit) {
//     document.querySelector("#all_products").innerHTML = null;
  
//     displayProduct(HairKit);
//   }
  
  // filter_by_Combo
//   function filter_by_Combo(Combo) {
//     document.querySelector("#all_products").innerHTML = null;
  
//     displayProduct(Combo);
//   }
  
  // filter_by_Hair
//   function filter_by_Hair(Hair) {
//     document.querySelector("#all_products").innerHTML = null;
  
//     displayProduct(Hair);
//   }
  
  // filter_by_MINIATURE
//   function filter_by_MINIATURE(MINIATURE) {
//     document.querySelector("#all_products").innerHTML = null;
  
//     displayProduct(MINIATURE);
//   }
  
  // filter_by_Cream
//   function filter_by_Cream(Cream) {
//     document.querySelector("#all_products").innerHTML = null;
  
//     displayProduct(Cream);
//   }
  
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
  
  //  filter low to bhigh discount
//   function sort_dis_price(data) {
//     document.querySelector("#all_products").innerHTML = null;
//     data.sort(function (a, b) {
//       return Number(a.discount) - Number(b.discount);
//       //  console.log(a.price)
//     });
//     displayProduct(data);
//   }
  //filter high to low discount
//   function sort_dis_high(data) {
//     document.querySelector("#all_products").innerHTML = null;
//     data.sort(function (a, b) {
//       return Number(b.discount) - Number(a.discount);
//       //  console.log(a.price)
//     });
//     displayProduct(data);
//   }
  
  //  filter low to high rating
//   function sort_rating(data) {
//     document.querySelector("#all_products").innerHTML = null;
//     data.sort(function (a, b) {
//       console.log(a.rating);
//       return Number(a.rating) - Number(b.rating);
//       //
//     });
//     displayProduct(data);
//   }
  //filter high to low rating
//   function sort_rating_high(data) {
//     document.querySelector("#all_products").innerHTML = null;
//     data.sort(function (a, b) {
//       return Number(b.rating) - Number(a.rating);
//       //  console.log(a.price)
//     });
//     displayProduct(data);
//   }
  
  ///------------>>>>>>   Buy Function <<<<<<<<<<------------------------
  
  async function buy(ele) {
    try {
      let res = await fetch(`${baseUrl}/product/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ amount: ele.price }),
      });
      let data = await res.json();
      var options = {
        key: "rzp_test_hYENA0OIE0zqyC",
        amount: `${data.amount * 100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "",
        description: "Test Transaction",
        image: "../assets/SALONLEX-removebg-preview.png",
        order_id: `${data.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of above steps
        handler: function (response) {
          console.log("payment Id:- ", response.razorpay_payment_id);
          console.log("Order Id:- ", response.razorpay_order_id);
          console.log("Signature:- ", response.razorpay_signature);
        },
        prefill: {
          name: "Salonlex",
          email: "abc@ymail.com",
          contact: "",
        },
        notes: {
          address: "Masai School Bangalore",
        },
        theme: {
          color: "#eaea66",
        },
      };
      var rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
      });
      if (data) {
        rzp1.open();
      }
    } catch (e) {
      console.log(e);
    }
  }
  