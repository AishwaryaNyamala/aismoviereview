const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
