//
require('dotenv').config();
const nodemailer=require("nodemailer");
const bodyparser=require("body-parser");
const express=require('express');
const JOBS = require('./jobs');
const path=require("path");
const mustacheExpress=require("mustache-express");
const { request } = require('http');
const app=express();

//for body text in post method
app.use(bodyparser.urlencoded({ extended: false }));

//function to use static files in folder public 
app.use(express.static(path.join(__dirname, "public")));

//setting the directory pages that contains a bunch of views/templates
app.set("views", path.join(__dirname,"pages"));
//setting the view engine to mustache
app.set("view engine", "mustache");
//setting handler for engine which is mustache-express
app.engine("mustache", mustacheExpress()) ;


//Route handling
app.get("/", (request,response)=>{
    //response.send("Hello World!");
    //response.sendFile(path.join(__dirname, "pages/index.html"));
    response.render("index",{jobs:JOBS});//redering the view/templates to populate index with key value pairs using jobs object array
});

app.get('/jobs/:id', (req, res) => {
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
    res.render('jobs', { job: matchedJob});
});


const transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/jobs/:id/apply', (req, res) => {
    console.log('req.body', req.body);
    const { name, email, phone, dob, coverletter } = req.body;

    // console.log('New Application', {name, email, phone, dob, position, coverletter});

    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
  
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: process.env.EMAIL_ID,
      subject: `New Application for ${matchedJob.title}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Cover Letter:</strong> ${coverletter}</p>
      `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  });


//get port assgned by environment if not assign port number 4000
const port=process.env.PORT || 4000;


//listen function to listen to client request
app.listen(port, ()=>{
    console.log(`Server running on https://localhost:${port}`);
});