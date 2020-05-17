const express = require("express");
const User = require("./../models/User");

const is_authenticated = require("./../middleware/is_authenticated");

const router = express.Router();

router.post("/profile/update", is_authenticated, async (req, res) => {
    try {
        if (!req.fields.id){
            return res.status(400).json({message: "No id provided"});
        }
        const user_to_update = await User.findById(req.fields.id)
        .populate("profile_picture");
        if (req.fields.username){
            user_to_update.username = req.fields.username;
        }
        if (req.fields.email){
            user_to_update.email = req.fields.email;
        }
        if (req.fields.name){
            user_to_update.name = req.fields.name;
        }
        if (req.fields.description){
            user_to_update.description = req.fields.description;
        }

        await user_to_update.save();

        const profile_picture_displayed = {};
        profile_picture_displayed.id = user_to_update.profile_picture._id;
        profile_picture_displayed.secure_url = user_to_update.profile_picture.infos.secure_url;

        res.status(200).json({
            message: "profile uploaded",
            title: user_to_update.title,
            username: user_to_update.username,
            name: user_to_update.name,
            description: user_to_update.description,
            picture: profile_picture_displayed
        });

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;