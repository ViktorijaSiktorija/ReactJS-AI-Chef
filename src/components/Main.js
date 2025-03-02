import { useEffect, useState, useRef } from 'react';
import IngredientsLis from './IngredientsList';
import ClaudeRecipe from './ClaudeRecipe';
import { getRecipeFromMistral } from '../ai';

export default function Main() {
  const [ingredients, setingredients] = useState([]);
  const [recipe, setRecipe] = useState('');
  const recipeSection = useRef(null);

  useEffect(() => {
    if (recipe !== '' && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [recipe]);

  function addIngredient(formData) {
    const newIngredient = formData.get('ingredient');
    setingredients((prev) => [...prev, newIngredient]);
  }

  async function getRecipe() {
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown);
  }

  return (
    <main>
      <form className="add-ingredient-form" action={addIngredient}>
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        ></input>
        <button>Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsLis
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
        />
      )}
      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
