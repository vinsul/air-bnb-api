const express = require("express");
const Room = require("./../models/Room");
const Picture = require("./../models/Picture");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
const isAuthenticated = require("./../middleware/isAuthenticated")
const router = express.Router();

router.post("/room/picture/:room_id", isAuthenticated, async (req, res) => {
    try {
        const room_pictures = [];
        const files_name = Object.keys(req.files);
        for (let i = 0; i < files_name.length; i++){
            if(req.files[files_name[i]].type){
                room_pictures.push(req.files[files_name[i]].path)
            }
        }
        if(files_name.length === 0 || room_pictures.length === 0){
            return res.status(400).json({message: "No picture added !"});
        }
        const rp_upload_result = [];
        for(let i = 0; i < room_pictures.length; i++){
            const result = await cloudinary.uploader.upload(room_pictures[i]);
            rp_upload_result.push(result);
        }
        const picturesToCreate = [];
        rp_upload_result.forEach(async (picture) => {
            const picToCreate = new Picture({
                type: "room_picture",
                isActive: true,
                infos: picture
            });
            picturesToCreate.push(picToCreate);
            await picToCreate.save();
        });
        const roomToUpdate = await Room.findById(req.params.room_id);
        if(roomToUpdate.creator.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Unauthorized !"});
        }
        const pic = roomToUpdate.room_picture;
        for (let i = 0; i < picturesToCreate.length; i++){
            pic.push(picturesToCreate[i]);
        }
        roomToUpdate.room_pictures = pic;
        await roomToUpdate.save();
        res.status(200).json({message: "Pictures added"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;