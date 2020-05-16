const express = require("express");
const cloudinary = require("cloudinary").v2;
const Room = require("./../models/Room");
const Picture = require("./../models/Picture");

const is_authenticated = require("./../middleware/is_authenticated");

const router = express.Router();

router.post("/room/picture/:room_id", is_authenticated, async (req, res) => {
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

        const room_picture_upload_result = [];

        for(let i = 0; i < room_pictures.length; i++){
            const result = await cloudinary.uploader.upload(room_pictures[i]);
            room_picture_upload_result.push(result);
        }

        const pictures_to_create = [];
        room_picture_upload_result.forEach(async (picture) => {
            const pic_to_create = new Picture({
                type: "room_picture",
                is_active: true,
                infos: picture
            });
            pictures_to_create.push(pic_to_create);
            await pic_to_create.save();
        });

        const room_to_update = await Room.findById(req.params.room_id);
        if(room_to_update.creator.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Unauthorized !"});
        }

        const pic = room_to_update.room_picture;
        for (let i = 0; i < pictures_to_create.length; i++){
            pic.push(pictures_to_create[i]);
        }

        room_to_update.room_pictures = pic;
        await room_to_update.save();

        res.status(200).json({message: "Pictures added"});
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;