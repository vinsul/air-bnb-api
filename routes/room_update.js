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

router.post("/room/update", isAuthenticated, async (req, res) => {
  try {
    // uploader plusieurs photos
    const fileKeys = Object.keys(req.files);
    let results = {};

    if (fileKeys.length > 0 && Object.keys(results).length < fileKeys.length) 
    fileKeys.forEach(async (fileKey) => {
      try {
        const file = req.files[fileKey];
        const result = await cloudinary.uploader.upload(file.path);
        results[fileKey] = {
          success: true,
          result: result,
        };
      } catch (error) {
        return res.json({error: error.message})
      }
    });

    // récupérer l'id dans le body
    const idToFind = req.fields.id;
    const roomToUpdate = await Room.findById(idToFind);
    if (roomToUpdate.title !== req.fields.title) {
      roomToUpdate.title = req.fields.title;
    }
    if (roomToUpdate.description !== req.fields.description) {
      roomToUpdate.description = req.fields.description;
    }
    if (roomToUpdate.price !== req.fields.price) {
      roomToUpdate.price = req.fields.price;
    }
    const newRoom = await roomToUpdate.save();
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
