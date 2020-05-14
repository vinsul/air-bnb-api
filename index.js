require('dotenv').config();
const express = require("express");
const formidableMiddleware = require ("express-formidable");
const mongoose = require("mongoose");
const roomUpdateRoute = require("./routes/room_update")

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

app.use(formidableMiddleware());
app.use(roomUpdateRoute)

app.all("*", (req, res) => {
    res.status(404).json({message: "Bad URL"});
})

app.listen(process.env.PORT, () => {
    console.log("Server started");
  });