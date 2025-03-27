const API_URL = "https://aismoviereview.onrender.com/reviews"; // Updated to deployed backend URL

// Fetch and display reviews
async function fetchReviews() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const reviews = await res.json();
        
        const reviewsDiv = document.getElementById('reviews');
        reviewsDiv.innerHTML = "";

        reviews.forEach(review => {
            const reviewEl = document.createElement('div');
            reviewEl.classList.add('review');
            reviewEl.innerHTML = `
                <h3>${review.movieName} (Rating: ${review.rating})</h3>
                <p><strong>By:</strong> ${review.reviewer}</p>
                <p>${review.comment}</p>
                <button class="delete-btn" onclick="deleteReview('${review._id}')">Delete</button>
                <button class="update-btn" onclick="updateReview('${review._id}')">Update</button>
            `;
            reviewsDiv.appendChild(reviewEl);
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

// Handle form submission to add review
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const movieName = document.getElementById("movieName").value;
    const reviewer = document.getElementById("reviewer").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movieName, reviewer, rating, comment })
        });

        if (!res.ok) throw new Error("Failed to add review");

        fetchReviews();
        e.target.reset(); 
    } catch (error) {
        console.error("Error adding review:", error);
    }
});

// Delete review
async function deleteReview(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete review");

        fetchReviews();
    } catch (error) {
        console.error("Error deleting review:", error);
    }
}

// Update review
async function updateReview(id) {
    const newRating = prompt("Enter new rating:");
    const newComment = prompt("Enter new comment:");

    if (!newRating || !newComment) {
        alert("Both rating and comment are required!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: newRating, comment: newComment })
        });

        if (!response.ok) {
            throw new Error("Failed to update review");
        }

        alert("Review updated successfully!");
        fetchReviews();
    } catch (error) {
        console.error("Update failed:", error);
        alert("Error updating review. Please try again.");
    }
}

// Scroll to top on load
window.onload = function() {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
};

fetchReviews();

