const time_btn = document.querySelector("#time_picker");

time_btn.addEventListener("submit", (event) => {
  event.preventDefault();
  let userdata = JSON.parse(localStorage.getItem("userdata"));
  let service_data = JSON.parse(sessionStorage.getItem("service_data"));

  //   if(userdata==null){
  //     return Swal.fire({
  //       title: 'Login First',
  //       width:"30%",
  //       background:"white",
  //       color:"red",
  //       confirmButton:true
  //     }).then((value)=>{
  //       if(value.isConfirmed) {
  //         window.location.href = "../index.html"
  //       }
  //    })  
  //   }

  let obj = {};
  obj["date"] = document.querySelector("#date").value;
  obj["time"] = document.querySelector("#time").value;
  obj["userid"] = userdata.userid;
  obj["serviceid"] = service_data.data._id;
  obj["service_name"] = service_data.data.name;
  obj["service_des"] = service_data.data.description;
  obj["user_email"] = userdata.email;
  obj["user_name"] = userdata.name;
  fetAllStylerFn(obj);
  Swal.fire('Date and Time are Selected, Now please choose your styler')
});
//https://hair-salon-backend.onrender.com/stylist/styler
let fetAllStylerFn = async (obj) => {
  try {
    let req = await fetch(
      "http://localhost:8080/barber/get",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (req.ok) {
      let allData = await req.json();
      renderStylerFunction(allData, obj);
    } else {
      Swal.fire({
        title: 'Unable to Load the Data',
        width: "25%",
        background: "#243b55",
        color: "red"
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Bad Request 404',
      width: "25%",
    })
  }
};

window.onload = fetAllStylerFn();

let renderStylerFunction = (allData, obj) => {
  let displayContainer = document.getElementById("styler_grid");
  displayContainer.innerHTML = null;
  let stylerArr = allData.map((item) => {
    return `<div class="styler_card">
                <img class="styler_img" width="100%"
                    src=${item.profilePic}
                    alt=${item.name + item._id}>
                <div class="styler_name">${item.name}</div>
                <button class="appointment_btn" data-name=${item.name
      } data-id=${item._id}>Book Appointment</button>
            </div>`;
  });
  displayContainer.innerHTML = stylerArr.join("");

  let all_appointment_btns = document.querySelectorAll(".appointment_btn");
  for (let appointment_btn of all_appointment_btns) {
    appointment_btn.addEventListener("click", (event) => {
      let stylerid = event.target.dataset.id;
      let styler_name = event.target.dataset.name;
      if (obj) {
        obj["stylerid"] = stylerid;
        obj["styler_name"] = styler_name;

        availablilityCheckerFunction(obj);
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Appointment Booked',
          text: 'Complete Payment Process',
          width: "25%",
        }).then(() => {
          // Redirect to another page
          window.location.href = "pay.html";
        });
      }
    });
  }
};



let availablilityCheckerFunction = (obj) => {
  fetch("https://hair-salon-backend.onrender.com/appointments/appointment", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((req) => {
      if (req.ok) {
        req
          .json()
          .then((allData) => {
            let newData = allData.filter((item) => {
              if (
                item.stylerid === obj.stylerid &&
                item.date === obj.date &&
                item.time === obj.time
              ) {
                return item;
              }
            });

            if (newData.length != 0) {
              Swal.fire({
                title: 'This slot is not available, Please choose another slot !',
                width: "26%",
                background: "#243b55",
                color: "red"
              })
            } else {
              //sendMailFunction(obj);
              createAppointmentFunction(obj);
            }
          })
          .catch(() => {
            Swal.fire({
              title: 'Unable to Load the Appointment Data',
              width: "26%",
              background: "#243b55",
              color: "red"
            })
          });
      } else {
        Swal.fire({
          title: 'Unable to Load the Appointment Data',
          width: "26%",
          background: "#243b55",
          color: "red"
        })
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Bad Request 404',
        width: "25%",
      })
    });
};

async function createAppointmentFunction(obj) {
  try {
    let add_req = await fetch(
      `https://hair-salon-backend.onrender.com/appointments/appointment/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    );
    if (add_req.ok) {
      window.location.href = "./appointment.html";
    } else {
      Swal.fire({
        title: 'Unable to add new appointment !',
        width: "25%",
        background: "#243b55",
        color: "red"
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Bad Request 404',
      width: "25%",
    })
  }
}

/* -------------------------------------------------------------------------- */
/*           clearing the localStorage and changing Login to Logout           */
/* -------------------------------------------------------------------------- */

let loginstat = document.getElementById("loginhref");
let data = JSON.parse(localStorage.getItem("userdata")) || null;
if (data) {
  if (data.message == "Login successfully") {
    loginstat.innerText = "Logout";
    if (loginstat.innerText == "Logout") {
      loginstat.addEventListener("click", () => {
        Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Logout!",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("userdata");
            loginstat.innerText = "Login";
            Swal.fire("Logout Successfull!").then((res) => {
              if (res) {
                window.location.href = "../index.html";
              }
            });
          }
        });
      });
    }
  } else {
    loginstat.innerText = "Login";
  }
}

// provide login page an href
if (loginstat && loginstat.innerText == "Login") {
  loginstat.href = "../routes/loginSignup/login.html";
}


let chooseStyle = JSON.parse(localStorage.getItem("hairstyles"))
chooseStyle = chooseStyle[chooseStyle.length-1]
const styleCard = document.getElementById("hairstyle-card")


function displayStyle(data) {
  styleCard.innerHTML = ""
    
    let card = document.createElement("div")
    let img = document.createElement("img")
    let name = document.createElement("p")
    let gender = document.createElement("p")
    let btn = document.createElement("button")

    img.setAttribute("src", chooseStyle.hairstyleimage);
    img.setAttribute("id", "styleImg");

    name.textContent = chooseStyle.hairstyleName;
    name.setAttribute("id", "styleName")

    gender.textContent = chooseStyle.genderType;
    gender.setAttribute("id", "styleName")

    btn.innerText = "Change Style"
    btn.setAttribute("id", "changeStyle")

    btn.addEventListener("click", () => {
      // styleCard = []
      window.location.href = "hairstyle.html";
    })

    card.append(img, name, gender, btn)
    styleCard.append(card)
}

displayStyle()
