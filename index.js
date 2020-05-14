require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(formidableMiddleware());
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// *********** ROUTE ***********
const signUpRoute = require("./routes/sign_up");
app.use(signUpRoute);
const log_inRoute = require("./routes/log_in");
app.use(log_inRoute);

app.all("*", (req, res) => {
    res.status(404).json({ message: "Bad URL" });
});
// *********** SERVER ***********

app.listen(process.env.PORT, () => {
    console.log("Server started");
});