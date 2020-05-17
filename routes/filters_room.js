const express = require("express");
const mongoose = require("mongoose");
const Room = require("../models/Room");
const router = express.Router();

router.get("/filters_room", async (req, res) => {
  try {
    // ***** Gestion de tilte et Price *****
    const filters = {};

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i");
    }
    if (req.query.price_min) {
      filters.price = { $gte: Number(req.query.price_min) };
    }
    if (req.query.price_max) {
      filters.price = { $lte: Number(req.query.price_max) };
    }
    if (req.query.price_min && req.query.price_max) {
      filters.price = {
        $gte: req.query.price_min,
        $lte: req.query.price_max,
      };
    }

    // ***** Gestion de Sort *****

    let sorts = {};
    if (req.query.sort) {
      if (req.query.sort === "price_asc") {
        sorts = { price: 1 };
      }
      if (req.query.sort === "price_desc") {
        sorts = { price: -1 };
      }
      if (req.query.sort === "date_asc") {
        sorts = { created: 1 };
      }
      if (req.query.sort === "date_desc") {
        sorts = { created: -1 };
      }
    }

    const per_page = 4;
    let num_page_asked = Number(req.query.page);

    if (num_page_asked === 0) {
      num_page_asked = 1;
    }

    const room_filtered = await Room.find(filters)
      .sort(sorts)
      .limit(per_page)
      .skip(Number(num_page_asked - 1) * per_page);

    res.json(room_filtered);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
