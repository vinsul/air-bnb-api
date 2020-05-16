const express = require("express");
const User = require("../models/User");
const Picture = require("../models/Picture");

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  if (req.params.id) {
    try {
      const user = await User.findById(req.params.id)
        .select("_id email username name description profile_picture")
        .populate("profile_picture");

      const profile_picture_displayed = {};

      if (user) {
        if (user.profile_picture) {
          const pic = await Picture.findById(user.profile_picture._id);
          if (pic.is_active) {
            profile_picture_displayed.id = pic._id;
            profile_picture_displayed.secure_url = pic.infos.secure_url;
          }
        }

        res.json({
          _id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
          description: user.description,
          profile_picture: profile_picture_displayed,
        });
      } else {
        res.json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(400).json({ error: "Missing user id" });
  }
});

module.exports = router;
