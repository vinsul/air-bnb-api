const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

const Room = require("../models/Room");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/room/delete", isAuthenticated, async(req, res) => {
    try {
        if (req.fields._id) {
            const roomToDelete = await Room.findById(req.fields._id);
            await roomToDelete.remove();
            res.status(200).json({ message: "Room deleted" });
        } else {
            res.status(400).json({ error: "Missing ID" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
module.exports = router;