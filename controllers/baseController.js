import utilities from "../utilities/index.js";

export const buildHome = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    console.error("Error fetching home page:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};
