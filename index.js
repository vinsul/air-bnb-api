require('dotenv').config();
const express = require("express");
const formidableMiddleware = require ("express-formidable");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(formidableMiddleware());


app.all("*", (req, res) => {
    res.status(404).json({message: "Bad URL"});
})

app.listen(process.env.PORT, () => {
    console.log("Server started");
  });