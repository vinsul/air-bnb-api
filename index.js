require('dotenv').config();
const express = require("express");
const formidableMiddleware = require ("express-formidable");
const mongoose = require("mongoose");
const signUpRoute = require("./routes/sign_up");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(formidableMiddleware());

app.use(signUpRoute);

app.all("*", (req, res) => {
    res.status(404).json({message: "Bad URL"});
})

app.listen(process.env.PORT, () => {
    console.log("Server started");
  });