async function loadReviews(inventoryId) {
  try {
    const response = await fetch(`/reviews/vehicle/${inventoryId}`);
    const data = await response.json();
    document.getElementById("reviews-container").innerHTML = data.reviews;
  } catch (error) {
    console.error("Error loading reviews:", error);
    document.getElementById("reviews-container").innerHTML =
      '<p class="error">Error loading reviews. Please try again later.</p>';
  }
}

async function submitReview(inventoryId) {
  const reviewText = document.getElementById("review-text");
  if (!reviewText) {
    // If the review text element doesn't exist, user is not logged in
    window.location.href = "/account/login";
    return;
  }

  const text = reviewText.value.trim();
  if (!text) {
    alert("Please write a review before submitting.");
    return;
  }

  try {
    const response = await fetch("/reviews/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory_id: inventoryId,
        review_text: text,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      reviewText.value = "";
      document.getElementById("reviews-container").innerHTML = data.reviews;
    } else {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = "/account/login";
      } else {
        alert(data.message || "Error submitting review. Please try again.");
      }
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Error submitting review. Please try again.");
  }
}

async function deleteReview(reviewId) {
  try {
    const response = await fetch(`/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Refresh the reviews list
      const vehicleContainer = document.querySelector(".vehicle-container");
      const inventoryId = vehicleContainer.dataset.invId;
      if (inventoryId) {
        loadReviews(inventoryId);
      }
    } else {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = "/account/login";
      } else {
        const data = await response.json();
        alert(data.message || "Error deleting review. Please try again.");
      }
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    alert("Error deleting review. Please try again.");
  }
}

// Load reviews when page loads
document.addEventListener("DOMContentLoaded", () => {
  const vehicleContainer = document.querySelector(".vehicle-container");
  if (vehicleContainer) {
    const inventoryId = vehicleContainer.dataset.invId;
    if (inventoryId) {
      loadReviews(inventoryId);
    }
  }
});
