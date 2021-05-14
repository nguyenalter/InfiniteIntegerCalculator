const express = require("express");
const path = require("path");
const calculator = require("./api/calculator");

const app = express();


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({limit: '50mb'}));
// Use process.env.PORT for Heroku deployment.
const port = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.use("/calculator", calculator);

app.listen(port,()=> {
    console.log("Listen on port " + port);
})