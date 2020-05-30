const db = require("../data/dbConfig");

module.exports = {
  find,
  findBy,
  addRecipe,
  findRecipeById,
  addIngredient,
  findIngredientsById,
  addInstruction,
  findInstructionById,
  remove,
};

function find() {
  return db("recipes").select("user_id", "email", "username", "password");
}

function findBy(filter) {
  return db("recipes").where(filter);
}

async function addRecipe(recipe) {
  const [user_id] = await db("recipes").insert(recipe).returning("user_id");

  return findRecipeById(user_id);
}

function findRecipeById(user_id) {
  return db("recipes").where({ user_id }, req.params.id).first();
}

async function addIngredient(ingredient) {
  const [ingr_id] = await db("ingredients")
    .insert(ingredient)
    .returning("ingr_id");

  return findIngredientsById(ingr_id);
}

function findIngredientsById(ingr_id) {
  return (
    db("ingredients")
      .where({ ingr_id })
      // .select("user_id", "ingr_id", "ingr_name", "amount", "recipe_id")
      .first()
  );
}

async function addInstruction(instruction) {
  const [instr_id] = await db("instructions").insert(instruction);

  return findInstructionById(instr_id);
}

function findInstructionById(instr_id) {
  return db("instructions")
    .where({ instr_id })
    .select("user_id", "instr_id", "step_#", "instruction", "recipe_id")
    .first();
}

function remove(user_id) {
  return db("recipes").where({ user_id }).del();
}
