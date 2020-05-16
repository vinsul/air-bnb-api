const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const Room = require("./../models/Room.js");
const Picture = require("./../models/Picture")
const isAuthenticated = require("./../middleware/isAuthenticated");
const formidableMiddleware = require("express-formidable");
router.use(formidableMiddleware());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/room/update/:id", isAuthenticated, async (req, res) => {
  try {
    const idToFind = req.params.id;
    const roomToUpdate = await Room.findById(idToFind)
    .populate({
      path: "creator",
      select: "username profile_picture",
    })
    .populate("room_picture");
    if (req.fields.title) {
      roomToUpdate.title = req.fields.title;
    }
    if (req.fields.description) {
      roomToUpdate.description = req.fields.description;
    }
    if (req.fields.price) {
      roomToUpdate.price = req.fields.price;
    }
    await roomToUpdate.save();
    const pp_displayed = {};
    const rp_displayed = [];
    for (let i = 0; i < roomToUpdate.room_picture.length; i++){
        if(roomToUpdate.room_picture[i].isActive){
            rp_displayed.push({
                id: roomToUpdate.room_picture[i]._id,
                secure_url: roomToUpdate.room_picture[i].infos.secure_url
            });
        }
    }
    if(roomToUpdate.creator.profile_picture){
        const pic = await Picture.findById(roomToUpdate.creator.profile_picture);
        if(pic.isActive){
            pp_displayed.id = roomToUpdate.creator.profile_picture;
            pp_displayed.secure_url = pic.infos.secure_url;
        }
    }
    return res.json({
      id: roomToUpdate._id,
      title: roomToUpdate.title,
      rate: roomToUpdate.rate,
      description: roomToUpdate.description,
      price: roomToUpdate.price,
      room_picture: rp_displayed,
      creator: {
        username: roomToUpdate.creator.username,
        profile_picture: pp_displayed,
      }
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
