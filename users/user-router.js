const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await db("users");
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errorMessage: "Cannot retrieve users",
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await db("users").where("user_id", req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errorMessage: "Cannot retrieve user",
    });
  }
});

router.get("/:id/recipes", async (req, res, next) => {
  try {
    const recipes = await db("recipes as r")
      .join("users as u", "u.user_id")
      .where("u.user_id", req.params.id)

      .select
      // "r.recipe_id",
      // "r.name",
      // "r.prep_time",
      // "r.category",
      // "r.source",
      // "r.path_name"
      ();
    res.json(animals);
  } catch (err) {
    next(err);
  }
});

module.exports = router;