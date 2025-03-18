import pool from "../database/index.js";

/* ***************************
 *  Get all classification data
 * ************************** */
export const getClassifications = async () => {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
};

export const getInventoryItemByID = async (inv_id) => {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = ${inv_id}`
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryItemByID error " + error);
  }
};

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
export async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}
