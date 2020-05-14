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
    cloudinary.uploader.upload(
      req.files.picture.path,
      async (error, result) => {
        if (error) {
          return res.json({ error: error.message });
        } else {
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
          if (roomToUpdate.pictures.room_picture !== result) {
            roomToUpdate.pictures = result;
          }
          await roomToUpdate.save();
          return res.json(roomToUpdate)
        }
      }
    );
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
