const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");

const app = express()
app.use(cors())
app.use(express.json())

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
 service:"gmail",

  auth: {
    user: "selvarannav6231@gmail.com",
    pass: "nmob csrw eulv gdvr",
  }, tls: {
    rejectUnauthorized: false, },
});

app.post("/sendmail",(req, res)=>{

    const sub = req.body.sub;
    const msg = req.body.msg;
    const emaillist = req.body.emaillist;

transporter.sendMail({
    from:"selvarannav6231@gmail.com",
    to: emaillist[0],
    subject: sub,
    text: msg
}, (error, info)=>{
    if(error){
        console.log(error) 
        res.send(false)
    }else{
        console.log(info)
        res.send(true)
    }
})
})

app.listen(8080,()=>{
    console.log("Server started from 8080...")
})

