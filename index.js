require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(formidableMiddleware());
mongoose.connect(process.env.MONGODB_URI);

app.all("*", (req, res) => {
    res.status(404).json({ message: "Bad URL" });
});
// *********** SERVER ***********
app.listen(process.env.PORT, () => {
    console.log("Server started");
});