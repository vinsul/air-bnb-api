const express = require("express");
const User = require("./../models/User");
const Picture = require("./../models/Picture");
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
        const pictureToCreate = new Picture({
            type: "profile_picture",
            isActive: true,
            infos: pp_upload_result
        });
        const userToUpdate = await User.findById(req.user._id);
        if(userToUpdate.profile_picture){
            const pictureToDelete = await Picture.findById(userToUpdate.profile_picture);
            await cloudinary.uploader.destroy(pictureToDelete.infos.public_id);
            pictureToDelete.isActive = false;
            await pictureToDelete.save();
        }
        userToUpdate.profile_picture = pictureToCreate;
        await pictureToCreate.save();
        await userToUpdate.save();

        const pp_displayed = {};
        pp_displayed.id = pictureToCreate._id;
        pp_displayed.secure_url = pictureToCreate.infos.secure_url;

        res.status(200).json({
            message: "profile picture uploaded",
            picture: pp_displayed
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;