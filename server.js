import express from "express";
import cors from "cors";
import { mongoDB } from "./config/db.js";
import foodRouter from "./routes/FoodRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CartRoute from "./routes/CartRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import contactRouter from "./routes/ContactRoute.js";
import Rating from './models/Rating.js'; // Import Rating model
import 'dotenv/config';
import AdminRoute from "./routes/AdminRoute.js";

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());

// Basic route to check API status
app.get("/", (req, res) => {
  res.send("API is working");
});

// MongoDB connection
mongoDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", UserRoute);
app.use("/api/cart", CartRoute);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", AdminRoute);

// Ratings API - Save ratings to MongoDB
app.post("/api/rateItem", async (req, res) => {
  const { itemId, rating, Item } = req.body;

  // Validate the incoming data
  if (!itemId || !Item || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid data. Ensure itemId, Item name, and rating between 1 and 5 are provided." });
  }

  try {
    // Find existing rating for the item
    let existingRating = await Rating.findOne({ itemId });

    if (!existingRating) {
      // If no ratings exist for the item, create a new entry
      existingRating = new Rating({ itemId, Item, ratings: [rating] });
    } else {
      // If ratings exist, add the new rating to the array
      existingRating.ratings.push(rating);
      // Optionally, update average rating
      const totalRatings = existingRating.ratings.reduce((sum, rate) => sum + rate, 0);
      existingRating.averageRating = totalRatings / existingRating.ratings.length;
    }

    // Save the updated rating data to the database
    await existingRating.save();

    // Return success response
    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Server connection
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
