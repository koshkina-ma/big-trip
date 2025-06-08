import AbstractView from '../framework/view/abstract-view.js';

function createTripCostTemplate(totalCost) {
  return /*html*/ `
      <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  `;
}

export default class TripCostView extends AbstractView {
/** @type {number} */
  #totalCost;

  constructor(totalCost) {
    super();
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripCostTemplate(this.#totalCost);
  }
}
