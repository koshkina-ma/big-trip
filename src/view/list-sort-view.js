import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createListSortTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="day" ${currentSortType === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="time" ${currentSortType === SortType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="price" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>`
  );
}

export default class ListSortView extends AbstractView {
  #currentSortType = null;
  #sortTypeChangeHandler = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createListSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this.#sortTypeChangeHandler = callback;
    this.element.addEventListener('change', this.#sortTypeChangeHandlerInner);
  }

  #sortTypeChangeHandlerInner = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#sortTypeChangeHandler(evt.target.value);
  };
}
