import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  Item: { type: String },
  ratings: [{ type: Number, min: 1, max: 5 }] // Array to store ratings
});

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
