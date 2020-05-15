require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const publishRoomRoute = require("./routes/publish");
const mongoose = require("mongoose");

const app = express();

app.use(formidableMiddleware());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const signUpRoute = require("./routes/sign_up");
app.use(signUpRoute);
const log_inRoute = require("./routes/log_in");
app.use(log_inRoute);
const roomUpdateRoute = require("./routes/room_update");
app.use(roomUpdateRoute);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Bad URL" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
