import AbstractView from '../framework/view/abstract-view.js';

function createEditPointTemplate(event) {
  const {
    type,
    destination,
    offers,
    dateFrom,
    dateTo,
    basePrice,
    id // если нужно для уникальных id в элементах
  } = event;

  const { name, description: destinationDescription, pictures } = destination;

  const offerMarkup = offers.map(({ id: offerId, title, price, isChecked }) => `
  <div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${offerId}-${id}"
      type="checkbox"
      name="event-offer-${offerId}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="event__offer-label" for="event-offer-${offerId}-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`).join('');

  const photosMarkup = pictures.map(({ src, description }) => `
  <img class="event__photo" src="${src}" alt="${description}">
`).join('');

  return (/*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'].map((eventType) => `
                  <div class="event__type-item">
                    <input
                      id="event-type-${eventType}-${id}"
                      class="event__type-input visually-hidden"
                      type="radio"
                      name="event-type"
                      value="${eventType}"
                      ${eventType === type ? 'checked' : ''}
                    >
                    <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
                  </div>
                `).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-${id}">
              ${type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${name}"
              list="destination-list-${id}"
              required
            >
            <datalist id="destination-list-${id}">
              <!-- сюда можно динамически подставлять все доступные destinations -->
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${dateFrom}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${dateTo}"
            >
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-${id}"
              type="number"
              name="event-price"
              value="${basePrice}"
              required
            >
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offerMarkup}
            </div>
          </section>

          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationDescription}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosMarkup}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `);
}

export default class EditPointView extends AbstractView {
  /** @type {object} */
  #event;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEditPointTemplate(this.#event);
  }
}
