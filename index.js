const express = require("express");
const app = express();

app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");
initializeDatabase();

// 3, 4, 5
async function createRecipe(recipe) {
  try {
    const newRecipe = new Recipe(recipe);
    const saveRecipe = await newRecipe.save();
    return saveRecipe;
  } catch (error) {
    console.log(error);
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the recipe" });
  }
});

// 6
async function getAllRecipes() {
  try {
    const recipes = Recipe.find();
    return recipes;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the recipes" });
  }
});

// 7
async function getRecipeByTitle(recipeTitle) {
  try {
    const recipe = await Recipe.findOne({ title: recipeTitle });
    return recipe;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await getRecipeByTitle(req.params.recipeTitle);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// 8
async function getRecipesByAuthor(author) {
  try {
    const recipes = await Recipe.find({ author: author });
    return recipes;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await getRecipesByAuthor(req.params.authorName);
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// 9
async function getRecipesByDifficultyLevel(level) {
  try {
    const recipes = await Recipe.find({ difficulty: level });
    return recipes;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes/difficultyLevel/:level", async (req, res) => {
  try {
    const recipes = await getRecipesByDifficultyLevel(req.params.level);
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// 10
async function updateRecipeById(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      dataToUpdate,
      { new: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log("Error in updating recipe", error);
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body);
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipes" });
  }
});

// 11
async function updateRecipeByTitle(title, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: title },
      dataToUpdate,
      { new: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log("Error in updating recipe", error);
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeByTitle(
      req.params.recipeTitle,
      req.body
    );
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipes" });
  }
});

// 12
async function deleteRecipe(recipeId) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({
        message: "Recipe deleted successfully",
        deletedRecipe: deletedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the recipe" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
