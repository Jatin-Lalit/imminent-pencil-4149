const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const leftPanel = document.querySelector('.left-panel');
const rightPanel = document.querySelector('.right-panel');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});


container.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnbKxW8r6WwUbp9DXnWeH12hIv50Gn7L9yGQ&usqp=CAU')";
container.style.backgroundRepeat = "no-repeat";
container.style.backgroundSize = "cover";
container.style.position = "relative";
//////////////////////////////////////////////
let baseurl="backend URL/";
//let signup_btn= document.querySelector("#signup form");

 //signup_btn.addEventListener("submit", signupFun)
async function signup(){
try {
    // event.preventDefault();n
   
    let email=document.getElementById("email").value
    let name=document.getElementById("name").value
    let pass=document.getElementById("password").value;
    let mobileNumber=document.getElementById("phone").value;
    let obj={
      name,
      email,
      password,
      mobileNumber
    }
    
    console.log(obj)

    let signup_res= await fetch(`${baseurl}/user/register`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(obj)
    })
    if(signup_res.ok){
        alert("Register Succecfully Now You  Can Login");
       
    }
} catch (error) {
    console.log(error)
    alert("Something going wrong")
}}


async function login(){
    try {
        // event.preventDefault();
        let email=document.getElementById("email-log").value
        let password=document.getElementById("password-log").value;
        let obj={
            email,
            password
        }
        console.log(obj)
    
        let res= await fetch(`${baseurl}/user/login`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(obj)
        })
        if(res.ok){
            let token= await res.json();
             localStorage.setItem("token",token.token)
            alert("Login Succecfully");
            window.location.href="home.html"
        }else{
            alert("Wrong Credntials")
        }
    } catch (error) {
        alert("Something going wrong")
    }
        
    }