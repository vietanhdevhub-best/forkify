import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};

// Search controller
const controlSearch = async () => {
  const query = searchView.getInput();
  if (query) {
    state.search = new Search(query);
  }
  elements.searchResult.innerHTML = '';
  elements.resultPages.innerHTML = '';
  renderLoader(elements.searchResult);
  await state.search.fetchData();
  clearLoader();
  searchView.renderResult(state.search.result);
};
elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});
elements.resultPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    elements.searchResult.innerHTML = '';
    elements.resultPages.innerHTML = '';
    const gotoPage = Number(btn.dataset.goto);
    searchView.renderResult(state.search.result, gotoPage);
  }
});

// Recipe controller

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  elements.recipe.innerHTML = '';
  if (id) {
    renderLoader(elements.recipe);
    state.recipe = new Recipe(id);
    if (state.search) {
      searchView.highlightedChoice(id);
    }
    try {
      await state.recipe.getRecipe();
      state.recipe.caclTime();
      state.recipe.caclService();
      state.recipe.parseIng();
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(error);
    }
  }
};

['load', 'hashchange'].forEach((e) => addEventListener(e, controlRecipe));
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServing('dec');
      recipeView.updateServing(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServing('inc');
    recipeView.updateServing(state.recipe);
  }
});
