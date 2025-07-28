import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import { getEditPointFormattedDate } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { DEFAULT_EVENT_TYPE, UserAction } from '../const.js';

function createAddNewPointTemplate(state, destinations) {
  const {
    type = DEFAULT_EVENT_TYPE,
    destination,
    offers = [],
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0
  } = state;

  const { name = '', description = '', pictures = [] } = destination || {};

  const offersMarkup = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${offer.id}-new"
             type="checkbox"
             name="event-offer"
             data-offer-id="${offer.id}">
      <label class="event__offer-label" for="event-offer-${offer.id}-new">
        <span class="event__offer-title">${offer.title}</span>
        +€&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');

  const photosMarkup = pictures.map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description}">
  `).join('');

  return (/*html*/
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <!-- Type selection -->
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-new">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-new" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant']
      .map((eventType) => `
                    <div class="event__type-item">
                      <input id="event-type-${eventType}-new"
                             class="event__type-input visually-hidden"
                             type="radio"
                             name="event-type"
                             value="${eventType}"
                             ${eventType === type ? 'checked' : ''}>
                      <label class="event__type-label event__type-label--${eventType}"
                             for="event-type-${eventType}-new">
                        ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                      </label>
                    </div>
                  `).join('')}
              </fieldset>
            </div>
          </div>

          <!-- Destination -->
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-new">
              ${type}
            </label>
            <select class="event__input event__input--destination"
                    id="event-destination-new"
                    name="event-destination"
                    required>
              <option value=""></option>
              ${destinations.map((dest) => `
                <option value="${dest.name}" ${dest.name === name ? 'selected' : ''}>
                  ${dest.name}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Dates -->
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-new">From</label>
            <input class="event__input event__input--time"
                   id="event-start-time-new"
                   type="text"
                   name="event-start-time"
                   value="${getEditPointFormattedDate(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-new">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-new"
                   type="text"
                   name="event-end-time"
                   value="${getEditPointFormattedDate(dateTo)}">
          </div>

          <!-- Price -->
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-new">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price"
                   id="event-price-new"
                   type="number"
                   name="event-price"
                   value="${basePrice}"
                   min="0"
                   required>
          </div>

          <!-- Buttons -->
          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="button">Cancel</button>
        </header>

        <!-- Details -->
        ${offers.length > 0 || description || pictures.length > 0 ? `
        <section class="event__details">
          ${offers.length > 0 ? `
            <section class="event__section event__section--offers">
              <h3 class="event__section-title event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offersMarkup}
              </div>
            </section>
          ` : ''}

          ${description || pictures.length > 0 ? `
            <section class="event__section event__section--destination">
              <h3 class="event__section-title event__section-title--destination">Destination</h3>
              ${description ? `<p class="event__destination-description">${description}</p>` : ''}
              ${pictures.length > 0 ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${photosMarkup}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
        ` : ''}
      </form>
    </li>`
  );
}

export default class AddNewPointView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #eventsModel = null;
  #handleFormSubmit = null;
  #handleCancelClick = null;
  #flatpickrStart = null;
  #flatpickrEnd = null;

  constructor({ destinations, offers, eventsModel, onFormSubmit, onCancelClick }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.eventsModel = eventsModel;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelClick = onCancelClick;

    this._setState(this.#getDefaultState());
    this.#setFlatpickr();
    this._restoreHandlers();
  }

  #getDefaultState() {
    const defaultDestination = this.#destinations.length > 0
      ? this.#destinations[0]
      : { name: '', description: '', pictures: [] };

    return {
      type: DEFAULT_EVENT_TYPE,
      destination: defaultDestination,
      offers: this.#offers.filter((offer) => offer.type === DEFAULT_EVENT_TYPE),
      dateFrom: new Date(),
      dateTo: new Date(),
      basePrice: 0
    };
  }

  get template() {
    return createAddNewPointTemplate(this._state, this.#destinations);
  }

  removeElement() {
    if (this.#flatpickrStart) {
      this.#flatpickrStart.destroy();
      this.#flatpickrStart = null;
    }

    if (this.#flatpickrEnd) {
      this.#flatpickrEnd.destroy();
      this.#flatpickrEnd = null;
    }

    super.removeElement();
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);

    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);

    this.#setFlatpickr();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(UserAction.ADD_EVENT, this._state);
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;
    this.updateElement({
      type: newType,
      offers: this.#eventsModel.getOffersByType(newType, [])
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);
    if (selectedDestination) {
      this._setState({
        destination: selectedDestination
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: Math.max(0, Math.trunc(Number(evt.target.value)) || 0),
    });
  };

  #setFlatpickr() {
    const startDateElement = this.element.querySelector('#event-start-time-new');
    const endDateElement = this.element.querySelector('#event-end-time-new');

    this.#flatpickrStart = flatpickr(startDateElement, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: (dates) => {
        this._setState({
          dateFrom: dates[0]
        });
      }
    });

    this.#flatpickrEnd = flatpickr(endDateElement, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: (dates) => {
        this._setState({
          dateTo: dates[0]
        });
      }
    });
  }

}
