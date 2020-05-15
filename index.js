require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const publishRoomRoute = require("./routes/publish");
const uploadProfilePictureRoute = require("./routes/upload_profile_pic");
const getRoomRoute = require("./routes/getRoom");
const deleteRoomRoute = require("./routes/delete");
const deletePictureRoute = require("./routes/delete_picture");
const uploadRoomPicture = require("./routes/upload_room_pic");
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
app.use(publishRoomRoute);
app.use(uploadProfilePictureRoute);
app.use(getRoomRoute);
app.use(deleteRoomRoute);
app.use(deletePictureRoute);
app.use(uploadRoomPicture);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Bad URL" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
