import pool from "../database/index.js";

/* *****************************
 *   Add new review
 * *************************** */
export async function addReview(inventory_id, account_id, review_text) {
  try {
    const sql =
      "INSERT INTO reviews (inventory_id, account_id, review_text) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(sql, [
      inventory_id,
      account_id,
      review_text,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("addReview error: " + error);
    throw error;
  }
}

/* *****************************
 *   Get reviews by vehicle
 * *************************** */
export async function getReviewsByVehicle(inventory_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM reviews r 
      JOIN account a ON r.account_id = a.account_id 
      WHERE r.inventory_id = $1 
      ORDER BY r.created_date DESC`;
    const result = await pool.query(sql, [inventory_id]);
    return result.rows;
  } catch (error) {
    console.error("getReviewsByVehicle error: " + error);
    throw error;
  }
}

/* *****************************
 *   Delete review
 * *************************** */
export async function deleteReview(review_id, account_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1 AND account_id = $2";
    const result = await pool.query(sql, [review_id, account_id]);
    return result.rowCount;
  } catch (error) {
    console.error("deleteReview error: " + error);
    throw error;
  }
}

/* *****************************
 *   Get reviews by account
 * *************************** */
export async function getReviewsByAccount(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year
      FROM reviews r 
      JOIN inventory i ON r.inventory_id = i.inv_id 
      WHERE r.account_id = $1 
      ORDER BY r.created_date DESC`;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("getReviewsByAccount error: " + error);
    throw error;
  }
}

/* *****************************
 *   Update review
 * *************************** */
export async function updateReview(review_id, account_id, review_text) {
  try {
    const sql =
      "UPDATE reviews SET review_text = $1 WHERE review_id = $2 AND account_id = $3 RETURNING *";
    const result = await pool.query(sql, [review_text, review_id, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updateReview error: " + error);
    throw error;
  }
}
