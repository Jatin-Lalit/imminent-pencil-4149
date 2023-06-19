// window.addEventListener("load",()=>{
//     let token = localStorage.getItem("token")
//     let logintag=document.getElementById("login-tag")
//     if(token){
//       logintag.innerHTML = "Logout"
//       logintag.removeAttribute("href")
//       logintag.addEventListener("click", (e)=>{
//         e.preventDefault()
//         Swal.fire(
//           '',
//           '<h3>Logout Success</h3>',
//           'success'
//         ).then((res)=>{
//           localStorage.clear()
//           window.location.href = "index.html"
//         })
//       })
//       return
//     }
//   })
  
  
  //"https://elegant-hare-dungarees.cyclic.app"
  const baseUrl = "http://localhost:8080/hairstyle";
  let chooseStyle = JSON.parse(localStorage.getItem("hairstyles")) || [];
  ///api fetch
  mainFunction();
  
  async function mainFunction() {
    try {
      let res = await fetch(`${baseUrl}/all`);
  
      let data = await res.json();
      console.log("data",data)
  
      displayProduct(data.styles);
  
      let WomenData = await fetch(`${baseUrl}/female`);
  
      let Women = await WomenData.json();
  
      let MenData = await fetch(`${baseUrl}/male`);
  
      let Men = await MenData.json();

      let UnisexData = await fetch(`${baseUrl}/unisex`)

      let Unisex = await UnisexData.json()
  
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

  
      document.getElementById("low").addEventListener("click", function () {
        sort_price(data.styles);
      });
  
      document.getElementById("high").addEventListener("click", function () {
        sort_price_high(data.styles);
      });
    //   document.querySelector(".rating_low").addEventListener("click", function () {
    //     sort_rating(data.styles);
    //   });
  
    //   document.querySelector(".rating_high").addEventListener("click", function () {
    //     sort_rating_high(data.styles);
    //   });
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
  
      let span = document.createElement("p");
      span.innerText = ele.description;
      span.setAttribute("class", "dis");
  
      let Buy = document.createElement("button");
      Buy.setAttribute("id", "buy-btn");
      Buy.innerText = "Select";
      Buy.classList = "Buy";
      Buy.addEventListener("click", () => {
        // buy(ele);
          chooseStyle.push(ele)
          localStorage.setItem("hairstyles",JSON.stringify(chooseStyle));
          alert("Your Style is selected, Please book the appointment.")
          window.location.href = "booking.html";
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

  // function duplicate(ele){
  //   for(let i=0; i<chooseStyle.length; i++) {
  //     if(chooseStyle[i].hairstyleName === ele.hairstyleName)
  //     return true
  //     else{
  //       return false
  //     }
  //   };
  // }
  
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
    data.sort((a, b)=> {
      console.log(a.price);
      return Number(a.price) - Number(b.price);
    });
    displayProduct(data);
  }
  
  //filter high to low price
  function sort_price_high(data) {
    document.querySelector("#all_products").innerHTML = null;
    data.sort((a, b)=> {
      return Number(b.price) - Number(a.price);
      //  console.log(a.price)
    });
    displayProduct(data);
  }
  

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
  
  // async function buy(ele) {
  //   try {
  //     let res = await fetch(`${baseUrl}/product/orders`, {
  //       method: "POST",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify({ amount: ele.price }),
  //     });
  //     let data = await res.json();
  //     var options = {
  //       key: "rzp_test_hYENA0OIE0zqyC",
  //       amount: `${data.amount * 100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //       currency: "INR",
  //       name: "",
  //       description: "Test Transaction",
  //       image: "../assets/SALONLEX-removebg-preview.png",
  //       order_id: `${data.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of above steps
  //       handler: function (response) {
  //         console.log("payment Id:- ", response.razorpay_payment_id);
  //         console.log("Order Id:- ", response.razorpay_order_id);
  //         console.log("Signature:- ", response.razorpay_signature);
  //       },
  //       prefill: {
  //         name: "Salonlex",
  //         email: "abc@ymail.com",
  //         contact: "",
  //       },
  //       notes: {
  //         address: "Masai School Bangalore",
  //       },
  //       theme: {
  //         color: "#eaea66",
  //       },
  //     };
  //     var rzp1 = new Razorpay(options);
  //     rzp1.on("payment.failed", function (response) {
  //       // alert(response.error.code);
  //       // alert(response.error.description);
  //       // alert(response.error.source);
  //       // alert(response.error.step);
  //       alert(response.error.reason);
  //       // alert(response.error.metadata.order_id);
  //       // alert(response.error.metadata.payment_id);
  //     });
  //     if (data) {
  //       rzp1.open();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  