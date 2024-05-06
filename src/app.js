const express=require('express');
const path=require("path");
const app=express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request,response)=>{
    //response.send("Hello World!");
    response.sendFile(path.join(__dirname, "pages/index.html"));
});

const port=process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Server running on https://localhost:${port}`);
});