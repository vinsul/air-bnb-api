const mongoose = require("mongoose");

const Picture = mongoose.model("Picture", {
    type: String,
    isActive: Boolean,
    infos: Object,
});

module.exports = Picture;