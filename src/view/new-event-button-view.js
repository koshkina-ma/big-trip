// //TODO весь файл на удаление? проверить, как по факту реализована кнопка, нужна ли эта вьюшка вообще

// import AbstractView from '../framework/view/abstract-view.js';

// function createNewEventButtonTemplate() {
//   return `
//     <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
//   `;
// }

// export default class NewEventButtonView extends AbstractView {
//   #handleClick = null;

//   constructor({ onClick }) {
//     super();
//     this.#handleClick = onClick;
//     this.element.addEventListener('click', this.#clickHandler);
//   }

//   get template() {
//     return createNewEventButtonTemplate();
//   }

//   #clickHandler = (evt) => {
//     evt.preventDefault();
//     this.#handleClick();
//   };

//   setDisabled(isDisabled) {
//     this.element.disabled = isDisabled;
//   }
// }
