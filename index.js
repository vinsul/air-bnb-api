require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(formidableMiddleware());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const filters_room = require("./routes/filters_room");
const update_password = require("./routes/update_password");
const sign_up_route = require("./routes/sign_up");
const log_in_route = require("./routes/log_in");
const get_user_route = require("./routes/get_user");
const publish_room_route = require("./routes/publish_room");
const room_update_route = require("./routes/update_room");
const upload_profile_picture_route = require("./routes/upload_profile_picture");
const get_room_route = require("./routes/get_room");
const delete_room_route = require("./routes/delete_room");
const delete_picture_route = require("./routes/delete_picture");
const upload_room_picture = require("./routes/upload_room_picture");
const get_rooms_by_location_route = require("./routes/get_rooms_by_location");
const get_rooms_user_route = require("./routes/get_rooms_user");
const update_user_infos_route = require("./routes/update_user_infos");
const delete_user_and_users_room_route = require("./routes/delete_user_and _users_rooms");

app.use(filters_room);
app.use(update_password);
app.use(sign_up_route);
app.use(log_in_route);
app.use(get_user_route);
app.use(room_update_route);
app.use(publish_room_route);
app.use(upload_profile_picture_route);
app.use(get_room_route);
app.use(delete_room_route);
app.use(delete_picture_route);
app.use(upload_room_picture);
app.use(get_rooms_by_location_route);
app.use(get_rooms_user_route);
app.use(update_user_infos_route);
app.use(delete_user_and_users_room_route);

app.all("*", (req, res) => {
    res.status(404).json({ message: "Bad URL" });
});

app.listen(process.env.PORT, () => {
    console.log("Server started");
});