import { createElement } from '../render.js';

function createTripInfoTemplate({ title, dateRange, totalCost }) {
  return /*html*/ `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dateRange}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  `;
}

export default class TripInfoView {
  element = null;
  tripData = null;

  constructor({ title, dateRange, totalCost }) {
    this.tripData = { title, dateRange, totalCost };
  }

  getTemplate() {
    return createTripInfoTemplate(this.getTemplate());
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
