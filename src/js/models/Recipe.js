import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const { data } = await axios.get(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = data.recipe.title;
      this.author = data.recipe.publisher;
      this.img = data.recipe.image_url;
      this.ingredients = data.recipe.ingredients;
      this.url = data.recipe.source_url;
    } catch (error) {
      console.log(error);
    }
  }
  caclTime() {
    const ing = this.ingredients;
    this.time = Math.ceil(ing.length / 3) * 15;
  }
  caclService() {
    this.servings = 4;
  }
  parseIng() {
    const long = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoon',
      'teaspoons',
      'tsps',
      'cups',
      'pounds',
    ];
    const short = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const newIngredients = this.ingredients.map((el) => {
      let ingredients = el.toLowerCase();
      long.forEach((el, i) => {
        ingredients = ingredients.replace(el, short[i]);
      });
      ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');
      const arrIng = ingredients.split(' ');
      const unitIndex = arrIng.findIndex((el2) => short.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length == 1) {
          count = eval(arrCount[0].replace('-', '+'));
        } else if (arrCount.length > 1) {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          ingredients: arrIng.slice(unitIndex + 1).join(' '),
          unit: arrIng[unitIndex],
        };
      } else if (Number(arrIng[0])) {
        objIng = {
          count: Number(arrIng[0]),
          ingredients: arrIng.slice(1).join(' '),
          unit: '',
        };
      } else if (unitIndex == -1) {
        objIng = {
          count: 1,
          ingredients: arrIng.join(' '),
          unit: '',
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
  updateServing(type) {
    let newServings;
    newServings = type == 'dec' ? this.servings - 1 : this.servings + 1;
    this.ingredients.forEach((e) => {
      e.count = e.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}
