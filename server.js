const express = require("express");
const app = express();

// Use process.env.PORT for Heroku deployment.
const port = process.env.PORT || 3000;

app.listen(port,()=> {
    console.log("Listen on port " + port);
})