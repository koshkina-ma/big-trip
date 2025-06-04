import { createElement } from '../render.js';

function createTripCostTemplate(totalCost) {
  return /*html*/ `
      <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  `;
}

export default class TripCostView {
  element = null;
  tripData = null;

  constructor(totalCost) {
    this.tripData = totalCost;
  }

  getTemplate() {
    return createTripCostTemplate(this.tripData);
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
