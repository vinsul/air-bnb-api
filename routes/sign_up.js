require("dotenv").config();
const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const mailgun = require("mailgun-js");
const User = require("./../models/User");

const router = express.Router();

router.post("/sign_up", async (req, res) => {
  try {
    const exist = await User.findOne({ email: req.fields.email });
    if (exist) {
      return res.status(400).json({ message: "Already exist" });
    }
    if (!req.fields.password) {
      return res.status(400).json({ error: "password parameter missing" });
    }
    if (!req.fields.username) {
      return res.status(400).json({ error: "username parameter missing" });
    }
    if (!req.fields.name) {
      return res.status(400).json({ error: "name parameter missing" });
    }
    if (!req.fields.email) {
      return res.status(400).json({ error: "email parameter missing" });
    }

    const salt = uid2(15);
    const hash = SHA256(req.fields.password + salt).toString(encBase64);
    const token = uid2(15);

    const new_user = new User({
      email: req.fields.email,
      username: req.fields.username,
      name: req.fields.name,
      description: req.fields.description,
      hash: hash,
      salt: salt,
      token: token,
    });
    await new_user.save();

    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });

    const data = {
      from:
        "Air-Bnb-Api <postmaster@" + process.env.MAILGUN_DOMAIN + ">",
      to: new_user.email,
      subject: "Welcome to Airbnb",
      text: "Thanks for using Airbnb !",
    };

    mg.messages().send(data, (error, body) => {
      if (body.id) {
        console.log(body);
        return res.status(200).json({
            message: "User created",
            email_status: `Ok :  ${body.message}`,
        });
    } else {
        return res.status(200).json({
            password_status: "User created",
            email_status: `Fail : ${body.message}`,
        });
    }
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
