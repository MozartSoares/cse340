import utilities from "../utilities/index.js";

export const buildHome = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};
