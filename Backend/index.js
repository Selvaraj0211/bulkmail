const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const { promises } = require("nodemailer/lib/xoauth2");
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://selva:ss123456@cluster0.l0mll3l.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log("DP failed",err)
})

const validation = mongoose.model("validation", {}, "bulkmail")


app.post("/sendmail", (req, res) => {

    const sub = req.body.sub;
    const msg = req.body.msg;
    const emaillist = req.body.emaillist;

   validation.find().then((data) => { 
    const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
    }, tls: {
        rejectUnauthorized: false,
    },

    
});

 new Promise(async function (resolve, reject) {
        try {
            for (let i = 0; i < emaillist.length; i++) {
                await transporter.sendMail({
                    from: "selvarannav6231@gmail.com",
                    to: emaillist[i],
                    subject: sub,
                    text: msg
                })
                console.log("Email send to" + emaillist[i])
            }
            resolve("success")
        }
        catch (error) {
            reject("failed")
        }

    }).then(() => { res.send(true) })
        .catch(() => { res.send(false) })

     })
    .catch((error) => { console.log(error) })


})

app.listen(8080, () => {
    console.log("Server started from 8080...")
})

