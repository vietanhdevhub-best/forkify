import { elements } from './base';
// fixed file name
export const toggleLike = (isLiked) => {
  const attributeString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document
    .querySelector('.recipe__love use')
    .setAttribute('href', `img/icons.svg#${attributeString}`);
};

export const toggleLikeMenu = (numberOfLike) => {
  elements.likeMenu.style.visibility = numberOfLike > 0 ? 'visible' : 'hidden';
};

export const renderLike = (like) => {
  const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">P${like.title}</h4>
                    <p class="likes__author">${like.title}</p>
                </div>
            </a>
        </li>
    `;
  elements.likeList.insertAdjacentHTML('beforeend', markup);
};
export const deleteLike = (id) => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`)
    .parentElement;
  if (el) {
    el.parentElement.removeChild(el);
  }
};
