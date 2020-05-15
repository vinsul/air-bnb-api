const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const Room = require("../models/Room.js");
const isAuthenticated = require("../middleware/isAuthenticated");
const formidableMiddleware = require("express-formidable");
router.use(formidableMiddleware());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/room/update/:id", isAuthenticated, async (req, res) => {
  try {
    // uploader plusieurs photos
    const fileKeys = Object.keys(req.files);
    let results = {};

    const room_pictures = [];
    if(req.files.room_picture1.type){
        room_pictures.push(req.files.room_picture1.path)
    }
    if(req.files.room_picture2.type){
        room_pictures.push(req.files.room_picture2.path)
    }
    const rp_upload_result = [];
    for(let i = 0; i < room_pictures.length; i++){
        const result = await cloudinary.uploader.upload(room_pictures[i]);
        rp_upload_result.push(result);
    }

    // récupérer l'id dans le body
    const idToFind = req.params.id;
    const roomToUpdate = await Room.findById(idToFind).populate({
      path: "creator",
      select: "username profile_picture",
    });
    if (roomToUpdate.room_picture !== rp_upload_result) {
      roomToUpdate.room_picture = rp_upload_result;
    }
    if (roomToUpdate.title !== req.fields.title) {
      roomToUpdate.title = req.fields.title;
    }
    if (roomToUpdate.description !== req.fields.description) {
      roomToUpdate.description = req.fields.description;
    }
    if (roomToUpdate.price !== Number(req.fields.price)) {
      roomToUpdate.price = req.fields.price;
    }
    const newRoom = await roomToUpdate.save();
    
    const rp_displayed = [];
    for (let i = 0; i < rp_upload_result.length; i++){
        rp_displayed.push({secure_url: rp_upload_result[i].secure_url});
    }
    
    const pp_displayed = {};
    if(newRoom.creator.profile_picture){
        pp_displayed.secure_url = newRoom.creator.profile_picture.secure_url;
    }
    return res.json({
      id: newRoom._id,
      title: newRoom.title,
      rate: newRoom.rate,
      description: newRoom.description,
      price: newRoom.price,
      room_picture: rp_displayed,
      creator: {
        username: newRoom.creator.username,
        profile_picture: pp_displayed,
      },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
