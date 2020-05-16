const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const router = express.Router();
const is_authenticated = require("../middleware/is_authenticated");

router.post("/uptdate_password", is_authenticated, async(req, res) => {
    try {
        const user_finded = await User.findOne({ email: req.fields.email });

        if (!user_finded) {
            return res.status(400).json({ message: "Account not find" });
        }
        const new_password = req.fields.password;
        const verification = req.fields.verification;

        const new_hash = SHA256(new_password + user_finded.salt).toString(
            encBase64
        );
        const verification_hash = SHA256(verification + user_finded.salt).toString(
            encBase64
        );

        if (new_hash === verification_hash) {
            user_finded.hash = new_hash;
            console.log(user_finded.hash);
            await user_finded.save();
            return res.status(200).json({ message: "Password as changed" });
        } else {
            return res
                .status(400)
                .json({ error: "Password or Verification not matching" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;