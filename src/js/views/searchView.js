import { elements } from './base.js';

export const getInput = () => elements.searchInput.value;

const limitTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length < limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `<li>
    <a class="results__link " href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
  elements.searchResult.insertAdjacentHTML('beforeend', markup);
};

const createButton = (
  page,
  type
) => `<button class="btn-inline results__btn--${type}" data-goto="${
  type == 'prev' ? page - 1 : page + 1
}">
<span>Page ${type == 'prev' ? page - 1 : page + 1}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${
      type == 'prev' ? 'left' : 'right'
    }"></use>
</svg>
</button>`;

const renderButton = (page, numberResults, resultPerPage) => {
  const pages = Math.ceil(numberResults / resultPerPage);
  let button;
  if (page == 1 && pages > 1) {
    // render next button
    button = createButton(page, 'next');
  } else if (page > 1 && page < pages) {
    // render both button
    button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
  } else if (page == pages && page > 1) {
    // render previous page
    button = createButton(page, 'prev');
  }
  elements.resultPages.insertAdjacentHTML('afterbegin', button);
};

export const highlightedChoice = (id) => {
  const arrSelect = Array.from(document.querySelectorAll('.results__link'));
  arrSelect.forEach((e) => {
    e.classList.remove('results__link--active');
  });
  const li = document.querySelector(`.results__link[href*="${id}"]`);
  if (li) {
    li.classList.add('results__link--active');
  }
};
export const renderResult = (results, page = 1, resultPerPage = 10) => {
  const start = (page - 1) * resultPerPage;
  const end = page * resultPerPage;
  results.slice(start, end).forEach(renderRecipe);
  renderButton(page, results.length, resultPerPage);
};
