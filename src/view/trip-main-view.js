import { createElement } from '../render.js';

function createTripMainTemplate({ title, dateRange }) {
  return /*html*/ `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dateRange}</p>
    </div>
  `;
}

export default class TripMainView {
  element = null;
  tripData = null;

  constructor({ title, dateRange }) {
    this.tripData = { title, dateRange };
  }

  getTemplate() {
    return createTripMainTemplate(this.tripData);
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
