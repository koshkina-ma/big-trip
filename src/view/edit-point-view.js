import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getEditPointFormattedDate } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { UserAction } from '../const.js';


function createEditPointTemplate(state, destinations) {
  const {
    type,
    destination,
    offers = [],
    dateFrom,
    dateTo,
    basePrice,
    id
  } = state;

  const { name, description: destinationDescription, pictures = [] } = destination;

  const hasOffers = offers.length > 0;
  const offerMarkup = hasOffers ? offers.map(({ id: offerId, title, price, isChecked }) => `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offerId}-${id}"
        type="checkbox"
        name="event-offer"
        data-offer-id="${offerId}"
        ${isChecked ? 'checked' : ''}
      >
      <label class="event__offer-label" for="event-offer-${offerId}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `).join('') : '';

  const hasPhotos = pictures.length > 0;
  const photosMarkup = hasPhotos ? pictures.map(({ src, description }) => `
    <img class="event__photo" src="${src}" alt="${description}">
  `).join('') : '';

  const hasDescription = destinationDescription && destinationDescription.trim() !== '';
  const shouldRenderDetails = hasOffers || hasDescription || hasPhotos;

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
            <select
              class="event__input event__input--destination"
              id="event-destination-${id}"
              name="event-destination"
              required
             >
              ${destinations.map((dest) => `
               <option
                  value="${dest.name}"
                  ${dest.name === name ? 'selected' : ''}
               >
                  ${dest.name}
               </option>
               `).join('')}
            </select>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${getEditPointFormattedDate(dateFrom)}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${getEditPointFormattedDate(dateTo)}"
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
          <button class="event__reset-btn" type="button">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        ${shouldRenderDetails ? `
        <section class="event__details">
        ${hasOffers ? `
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offerMarkup}
            </div>
          </section>
          ` : ''}

          ${hasDescription || hasPhotos ? `
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            ${hasDescription ? `
            <p class="event__destination-description">${destinationDescription}</p>
            ` : ''}
          ${hasPhotos ? `
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
    </li>
  `);
}

export default class EditPointView extends AbstractStatefulView {
  #eventsModel = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleRollupClick = null;
  #handleTypeChange = null;
  #flatpickrStart = null;
  #flatpickrEnd = null;

  constructor({ event, eventsModel }) {
    super();
    this.#eventsModel = eventsModel;
    this._setState(EditPointView.parseEventToState(event));

    this.#setFlatpickr();
    this._restoreHandlers();
  }

  static parseEventToState(event) {
    return {...event};
  }

  static parseStateToEvent(state) {
    return {...state};
  }

  get template() {
    return createEditPointTemplate(this._state, this.#eventsModel.getDestinations());
  }

  resetForm = () => {
    this._setState(EditPointView.parseEventToState(this._state));
  };

  setFormSubmitHandler(callback) {
    this.#handleFormSubmit = callback;
  }

  setRollupClickHandler(callback) {
    this.#handleRollupClick = callback;
  }

  setTypeChangeHandler(callback) {
    this.#handleTypeChange = callback;
  }

  setDeleteClickHandler(callback) {
    this.#handleDeleteClick = callback;
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');

    // Обработчик цены
    form.querySelector('.event__input--price').addEventListener('change', (evt) => {
      this._setState({
        basePrice: Number(evt.target.value),
      });
    });

    // Обработчик направления (используем модель)
    form.querySelector('.event__input--destination').addEventListener('change', (evt) => {
      const newDestination = this.#eventsModel.getDestinationByName(evt.target.value);
      if (newDestination) {
        this.updateElement({ destination: newDestination });
      }
    });

    // Обработчики офферов
    form.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (evt) => {
        const offerId = evt.target.dataset.offerId;
        if (!offerId) {
          return;
        }

        const offers = this._state.offers.map((offer) =>
          offer.id === offerId
            ? { ...offer, isChecked: evt.target.checked }
            : offer
        );
        this._setState({ offers });
      });
    });

    // Обработчики типа события
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', (evt) => {
        this.updateElement({ type: evt.target.value });
        this.#handleTypeChange?.(evt.target.value);
      });
    });

    // Обработчики кнопок
    form.addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', (evt) => {
        console.log('[1] Native click on Delete');
        evt.preventDefault();
        this.#deleteClickHandler(evt);
      });

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.#setFlatpickr();
  }

  #setFlatpickr() {
    if (this.#flatpickrStart) {
      this.#flatpickrStart.destroy();
      this.#flatpickrStart = null;
    }
    if (this.#flatpickrEnd) {
      this.#flatpickrEnd.destroy();
      this.#flatpickrEnd = null;
    }

    const { id, dateFrom, dateTo } = this._state;
    const startInput = this.element.querySelector(`#event-start-time-${id}`);
    const endInput = this.element.querySelector(`#event-end-time-${id}`);

    // 1. Инициализируем flatpickr для конечной даты ПЕРВЫМ
    this.#flatpickrEnd = flatpickr(endInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: dateTo,
      minDate: dateFrom,
      onChange: (dates) => this._setState({ dateTo: dates[0] })
    });

    // 2. Инициализируем flatpickr для начальной даты
    this.#flatpickrStart = flatpickr(startInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: dateFrom,
      onChange: (dates) => {
        const newStart = dates[0];
        const currentEnd = this.#flatpickrEnd.selectedDates[0] || this._state.dateTo;

        // Атомарное обновление
        this._setState({
          dateFrom: newStart,
          dateTo: newStart >= currentEnd ? newStart : currentEnd
        });

        // Принудительное обновление flatpickr после рендера
        requestAnimationFrame(() => {
          this.#flatpickrEnd.set('minDate', newStart);
          if (newStart >= currentEnd) {
            this.#flatpickrEnd.setDate(newStart);
          }
        });
      }
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.('UPDATE', EditPointView.parseStateToEvent(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    console.log('[2] Data sent to presenter:', {
      action: UserAction.DELETE_EVENT,
      id: this._state.id
    });
    this.#handleDeleteClick?.(
      this._state.id
    );
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

}
