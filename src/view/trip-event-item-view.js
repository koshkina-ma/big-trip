import AbstractView from '../framework/view/abstract-view.js';
import { formatRouteTime, getFormattedDate } from '../utils/utils.js';

function createTripEventItemTemplate(event) {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = event;
  const { timeRange, duration } = formatRouteTime(dateFrom, dateTo);
  const formattedDate = getFormattedDate(dateFrom);

  return (/*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${formattedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeRange.split(' — ')[0]}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeRange.split(' — ')[1]}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers.map((offer) => `
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>
          `).join('')}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.229 4.326 1.572-9.163L.685 9.674 9.886 8.337 14 0l4.115 8.337 9.2 1.337-6.657 6.49 1.572 9.163L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class TripEventItemView extends AbstractView {
  #event = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({ event, onRollupClick, onFavoriteClick }) {
    super();
    this.#event = event;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#setHandlers();
  }

  get template() {
    return createTripEventItemTemplate(this.#event);
  }

  #setHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #rollupClickHandler = (evt) => {
    //evt.stopPropagation();
    evt.preventDefault();
    this.#handleRollupClick(evt);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleFavoriteClick) {
      this.#handleFavoriteClick(this.#event);
    }
  };
}
