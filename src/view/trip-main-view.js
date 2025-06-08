import AbstractView from '../framework/view/abstract-view.js';

function createTripMainTemplate({ title, dateRange }) {
  return /*html*/ `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dateRange}</p>
    </div>
  `;
}

export default class TripMainView extends AbstractView {
  #tripData;

  constructor({ title, dateRange }) {
    super();
    this.#tripData = { title, dateRange };
  }


  get template() {
    return createTripMainTemplate(this.#tripData);
  }
}
