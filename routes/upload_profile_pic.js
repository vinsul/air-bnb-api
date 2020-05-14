const express = require("express");
const User = require("./../models/User");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
const isAuthenticated = require("./../middleware/isAuthenticated")
const router = express.Router();

router.post("/profile/picture", isAuthenticated, async (req, res) => {
    try {
        const profile_picture = req.files.profile_picture.path;
        const pp_upload_result = await cloudinary.uploader.upload(profile_picture);
        
        const userToUpdate = await User.findById(req.user._id);
        userToUpdate.profile_picture = pp_upload_result;
        await userToUpdate.save();

        res.status(200).json({message: "profile picture uploaded"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;