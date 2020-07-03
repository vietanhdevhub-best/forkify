import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
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
      recipeView.renderRecipe(state.recipe, state.like.isLiked(id));
    } catch (error) {
      alert(error);
    }
  }
};

// List controller

const controlList = () => {
  if (!state.list) {
    state.list = new List();
  }
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItems(el.count, el.unit, el.ingredients);
    listView.renderItem(item);
  });
};

// Like controller
state.like = new Likes();
likeView.toggleLikeMenu(state.like.getNumberOfLikes());
const controlLike = () => {
  if (!state.like) {
    state.like = new Likes();
  }
  const currentId = state.recipe.id;
  if (!state.like.isLiked(currentId)) {
    const newLike = state.like.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likeView.toggleLike(true);
    likeView.renderLike(newLike);
  } else {
    state.like.deleteLike(currentId);
    likeView.toggleLike(false);
    likeView.deleteLike(currentId);
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
  } else if (e.target.matches('.recipe__btn, .recipe__btn *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
  likeView.toggleLikeMenu(state.like.getNumberOfLikes());
});

elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.id;
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    listView.deleteItem(id);
    state.list.deleteItems(id);
  }
});

window.addEventListener('load', () => {
  state.like = new Likes();
  state.like.readStorage();
  likeView.toggleLikeMenu(state.like.getNumberOfLikes());
  state.like.likes.forEach((el) => likeView.renderLike(el));
});
