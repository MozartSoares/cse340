async function editReview(reviewId) {
  const reviewTextElement = document.getElementById(`review-text-${reviewId}`);
  const currentText = reviewTextElement.textContent;

  // Create edit form
  const form = document.createElement("div");
  form.innerHTML = `
    <textarea class="edit-textarea">${currentText}</textarea>
    <div class="edit-actions">
      <button onclick="saveReview(${reviewId})" class="btn-save">Save</button>
      <button onclick="cancelEdit(${reviewId}, '${currentText}')" class="btn-cancel">Cancel</button>
    </div>
  `;

  reviewTextElement.innerHTML = "";
  reviewTextElement.appendChild(form);
}

async function saveReview(reviewId) {
  const textarea = document.querySelector(`#review-text-${reviewId} textarea`);
  const newText = textarea.value.trim();

  if (!newText) {
    alert("Review text cannot be empty");
    return;
  }

  try {
    const response = await fetch("/reviews/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review_id: reviewId,
        review_text: newText,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      document.querySelector(".reviews-card").innerHTML = data.reviews;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    alert(error.message || "Error updating review");
  }
}

function cancelEdit(reviewId, originalText) {
  const reviewTextElement = document.getElementById(`review-text-${reviewId}`);
  reviewTextElement.textContent = originalText;
}

async function deleteReview(reviewId) {
  if (!confirm("Are you sure you want to delete this review?")) {
    return;
  }

  try {
    const response = await fetch(`/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Refresh the reviews list
      const reviewsResponse = await fetch("/account/reviews");
      const reviewsHtml = await reviewsResponse.text();
      document.body.innerHTML = reviewsHtml;
    } else {
      const data = await response.json();
      throw new Error(data.message);
    }
  } catch (error) {
    alert(error.message || "Error deleting review");
  }
}
