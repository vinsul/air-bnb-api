const express = require("express");
const Room = require("../models/Room");
const User = require("../models/User");
const Picture = require("../models/Picture");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const is_authenticated = require("../middleware/is_authenticated");

router.post("/user/rooms/delete/:id", is_authenticated, async (req, res) => {
  try {
    if (req.params.id) {
      // rooms to delete
      const rooms_to_delete = await Room.find({
        creator: req.params.id,
      });

      for (let i = 0; i < rooms_to_delete.length; i++) {
        const pictures = rooms_to_delete[i].room_picture;

        pictures.forEach(async (picture) => {
          const pic = await Picture.findById(picture);
          if (pic.is_active) {
            await cloudinary.uploader.destroy(pic.infos.public_id);
            pic.is_active = false;
            await pic.save();
          }
        });
        await rooms_to_delete[i].remove();
      }

      // user to delete
      const user_to_delete = await User.findById(req.params.id);

      if (user_to_delete.profile_picture) {
        const user_picture_to_delete = await Picture.findById(
          user_to_delete.profile_picture
        );

        if (user_picture_to_delete.is_active) {
          await cloudinary.uploader.destroy(
            user_picture_to_delete.infos.public_id
          );
          user_picture_to_delete.is_active = false;

          await user_picture_to_delete.save();
        }
      }

      await user_to_delete.remove();

      res.json({ message: "User and rooms deleted" });
    } else {
      res.status(400).json({ message: "User ID is missing" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
