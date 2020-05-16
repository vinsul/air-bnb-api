const express = require("express");
const Room = require("./../models/Room.js");
const Picture = require("./../models/Picture");

const is_authenticated = require("./../middleware/is_authenticated");

const router = express.Router();

router.post("/room/update/:id", is_authenticated, async (req, res) => {
  try {
    
    const id_to_find = req.params.id;
    const room_to_update = await Room.findById(id_to_find)
    .populate({
      path: "creator",
      select: "username profile_picture",
    })
    .populate("room_picture");

    if (req.fields.title) {
      room_to_update.title = req.fields.title;
    }
    if (req.fields.description) {
      room_to_update.description = req.fields.description;
    }
    if (req.fields.price) {
      room_to_update.price = req.fields.price;
    }

    await room_to_update.save();

    const profile_picture_displayed = {};
    const room_picture_displayed = [];

    for (let i = 0; i < room_to_update.room_picture.length; i++){
        if(room_to_update.room_picture[i].is_active){
            room_picture_displayed.push({
                id: room_to_update.room_picture[i]._id,
                secure_url: room_to_update.room_picture[i].infos.secure_url
            });
        }
    }

    if(room_to_update.creator.profile_picture){
        const pic = await Picture.findById(room_to_update.creator.profile_picture);
        if(pic.is_active){
            profile_picture_displayed.id = room_to_update.creator.profile_picture;
            profile_picture_displayed.secure_url = pic.infos.secure_url;
        }
    }

    return res.json({
      id: room_to_update._id,
      title: room_to_update.title,
      rate: room_to_update.rate,
      description: room_to_update.description,
      price: room_to_update.price,
      room_picture: room_picture_displayed,
      creator: {
        username: room_to_update.creator.username,
        profile_picture: profile_picture_displayed,
      }
    });

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
