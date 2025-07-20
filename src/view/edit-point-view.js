import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { destinations } from '../mock/destinations.js';
import { getEditPointFormattedDate } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


function createEditPointTemplate(state) {
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
          <button class="event__reset-btn" type="reset">Delete</button>
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
  #isResetting = false;
  #originalData = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleRollupClick = null;
  #handleTypeChange = null;
  #flatpickrStart = null;
  #flatpickrEnd = null;

  constructor({ event }) {
    super();
    console.log('--- Форма создается ---');
    console.log('Полученные данные:', JSON.parse(JSON.stringify(event)));

    this.#originalData = {
      ...event,
      destination: {...event.destination},
      offers: event.offers.map((offer) => ({...offer})),
      dateFrom: new Date(event.dateFrom),
      dateTo: new Date(event.dateTo)
    };
    this._state = structuredClone(this.#originalData);

    console.log('Сохранено как исходные данные:', JSON.parse(JSON.stringify(this.#originalData)));
    console.log('Текущее состояние:', JSON.parse(JSON.stringify(this._state)));

    this.#setFlatpickr();
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

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

  resetForm = () => {
    console.group('--- СБРОС ФОРМЫ ---');

    if (!this.#originalData) {
      console.error('Ошибка: исходные данные не найдены!');
      return;
    }

    console.log('Текущее состояние:', JSON.parse(JSON.stringify(this._state)));
    console.log('Сбрасываем к:', JSON.parse(JSON.stringify(this.#originalData)));

    if (this.#isResetting) {
      console.warn('Предотвращен повторный сброс');
      return;
    }

    this.#isResetting = true;

    this.updateElement(structuredClone(this.#originalData));
    console.log('Сброс завершен. Новое состояние:', JSON.parse(JSON.stringify(this._state)));

    this.#isResetting = false;
    console.groupEnd();
  };

  _restoreHandlers() {

    const form = this.element.querySelector('form');

    form.addEventListener('input', (evt) => {
      const { name, value } = evt.target;

      if (name === 'event-price') {
        this.updateElement({ basePrice: Number(value) });
      } else if (name === 'event-destination') {
        const newDest = destinations.find((d) => d.name === value);
        if (newDest) {
          this.updateElement({ destination: newDest });
        }
      }
      // Новые простые поля добавляются здесь
    });

    form.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (evt) => {
        const offerId = evt.target.dataset.offerId;
        if (!offerId) {
          console.error('Offer ID not found in:', evt.target);
          return;
        }

        const offers = this._state.offers.map((offer) => {
          const isSelected = offer.id === offerId;
          if (isSelected) {
            console.log(`Updating offer ${offerId} to`, evt.target.checked);
          }
          return isSelected ? { ...offer, isChecked: evt.target.checked } : offer;
        });

        this.updateElement({ offers });
      });
    });


    form.addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element.querySelectorAll('.event__type-input')
      .forEach((input) => input.addEventListener('change', this.#eventTypeChangeHandler));

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

    const startInput = this.element.querySelector(`#event-start-time-${ this._state.id}`);
    const endInput = this.element.querySelector(`#event-end-time-${ this._state.id}`);

    this.#flatpickrStart = flatpickr(startInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: (selectedDates) => {
        this.#startDateChangeHandler(selectedDates);
        this._setState({ dateFrom: selectedDates[0] });
      },
    });

    this.#flatpickrEnd = flatpickr(endInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onChange: (selectedDates) => {
        this.#endDateChangeHandler(selectedDates);
        this._setState({ dateTo: selectedDates[0] });
      },
    });
  }

  #startDateChangeHandler = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }
    const update = {
      dateFrom: selectedDate,
      ...(selectedDate > this._state.dateTo && { dateTo: selectedDate })
    };
    this.updateElement(update);
  };

  #endDateChangeHandler = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    const update = {
      dateTo: selectedDate,
      ...(selectedDate < this._state.dateFrom && { dateFrom: selectedDate })
    };

    this.updateElement(update);
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this.#handleFormSubmit) {
      return;
    }

    const formData = new FormData(evt.target);
    const updatedPoint = {
      ...this._state,
      basePrice: Number(formData.get('event-price')),
      destination: destinations.find((dest) => dest.name === formData.get('event-destination')) || this._state.destination,
      offers: this._state.offers
        ? this._state.offers.map((offer) => ({
          ...offer,
          isChecked: formData.get(`event-offer-${offer.id}`) === 'on'
        }))
        : []
    };
    this.#handleFormSubmit('UPDATE', updatedPoint);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick?.(this._state);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleRollupClick) {
      this.#handleRollupClick(evt);
    }
  };

  #eventTypeChangeHandler = (evt) => {
    this.updateElement({ type: evt.target.value });
    this.#handleTypeChange?.(evt.target.value);
  };

  #destinationChangeHandler = (evt) => {
    const newDestinationName = evt.target.value;
    const newDestination = destinations.find((dest) => dest.name === newDestinationName);
    if (!newDestination) {
      return;
    }
    this.updateElement({ destination: newDestination });
  };
}
