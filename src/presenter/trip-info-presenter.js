import TripMainView from '../view/trip-main-view.js';
import TripCostView from '../view/trip-cost-view.js';
import { formatTripTitle, formatTripDates, calculateTotalCost } from '../utils/utils.js';
import { render } from '../framework/render.js';

export default class TripInfoPresenter {
  #container = null;

  constructor(container) {
    this.#container = container;
  }

  init(events) {
    this.#container.innerHTML = '';
    if (events.length === 0) {
      return;
    }

    const tripMainComponent = new TripMainView({
      title: formatTripTitle(events),
      dateRange: formatTripDates(events),
    });

    const tripCostComponent = new TripCostView(calculateTotalCost(events));

    render(tripMainComponent, this.#container);
    render(tripCostComponent, this.#container);
  }

  destroy() {
    this.#container.innerHTML = '';
  }
}
