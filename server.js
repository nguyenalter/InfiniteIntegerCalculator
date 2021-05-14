const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
// Use process.env.PORT for Heroku deployment.
const port = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen(port,()=> {
    console.log("Listen on port " + port);
})