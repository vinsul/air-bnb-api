const express = require("express");
const Room = require("./../models/Room");
const User = require("./../models/User");
const isAuthenticated = require("./../middleware/isAuthenticated")
const router = express.Router();

router.post("/room/publish", isAuthenticated, async (req, res) =>{
    try {
        
    } catch (error) {
        
    }
})