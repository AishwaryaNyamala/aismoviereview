require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.static(path.join(__dirname, 'public'))); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Stop the server if DB connection fails
    });

// Review Schema & Model
const reviewSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String, required: true }
});
const Review = mongoose.model("Review", reviewSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a New Review
app.post('/reviews', async (req, res) => {
    try {
        const { movieName, reviewer, rating, comment } = req.body;
        if (!movieName || !reviewer || !rating || !comment) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json({ message: "✅ Review added successfully!", review: newReview });
    } catch (error) {
        console.error("❌ Error adding review:", error);
        res.status(500).json({ error: "Failed to add review" });
    }
});

// Get All Reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

// Update a Review
app.put('/reviews/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.json(updatedReview);
    } catch (error) {
        console.error("❌ Error updating review:", error);
        res.status(500).json({ error: "Failed to update review" });
    }
});

// Delete a Review
app.delete('/reviews/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json({ message: "✅ Review deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting review:", error);
        res.status(500).json({ error: "Failed to delete review" });
    }
});

// Start Server with Error Handling for Port Conflict
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Trying another port...`);
        const newPort = PORT + 1;
        app.listen(newPort, () => {
            console.log(`🚀 Server running on http://localhost:${newPort}`);
        });
    } else {
        console.error("❌ Server Error:", err);
    }
});
