
const express = require("express")
require("dotenv").config()

const app = express()
app.use(express.json())

const client_id = process.env.client_id
const client_secret = process.env.client_secret

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.get("/", (req, res) => {
    res.send("base end point")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/auth/github", async (req, res) => {
    const {code} = req.query
    console.log(code)
    const accessToken = await fetch("https://github.com/login/oauth/access_token", {
        method : "POST",
        headers : {
            Accept : "application/json",
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            client_id : client_id,
            client_secret : client_secret,
            code
        })
    }).then((res) => res.json())
 console.log(accessToken)
 
    const user = await fetch("https://api.github.com/user", {
            headers : {
                Authorization : `Bearer ${accessToken.access_token}`
            }
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))

    console.log(user)

    const useremailis = await fetch("https://api.github.com/user/email", {
        headers : {
            Authorization : `Bearer ${accessToken.access_token}`
        }
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))

    console.log(useremailis)

    res.send("Sign in with Github successfull")
})



app.listen(8090, () => {
    console.log("listening on port 8090")
})