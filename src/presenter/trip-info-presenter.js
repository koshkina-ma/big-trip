import TripMainView from '../view/trip-main-view.js';
import TripCostView from '../view/trip-cost-view.js';
import { formatTripTitle, formatTripDates, calculateTotalCost } from '../utils/utils.js';
import { render } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class TripInfoPresenter {
  #container = null;
  #eventsModel = null;
  #currentEvents = [];
  #tripMainComponent = null;
  #tripCostComponent = null;

  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#currentEvents = this.#eventsModel.getEvents();
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    this.#container.innerHTML = '';

    if (this.#currentEvents.length === 0) {
      return;
    }

    this.#tripMainComponent = new TripMainView({
      title: formatTripTitle(this.#currentEvents),
      dateRange: formatTripDates(this.#currentEvents),
    });

    this.#tripCostComponent = new TripCostView(calculateTotalCost(this.#currentEvents));

    render(this.#tripMainComponent, this.#container);
    render(this.#tripCostComponent, this.#container);
  }

  #handleModelEvent = (updateType) => {
    // Обновляем только при изменениях событий
    if (updateType === UpdateType.PATCH || updateType === UpdateType.MINOR || updateType === UpdateType.MAJOR) {
      this.#currentEvents = this.#eventsModel.getEvents();
      this.#renderTripInfo();
    }
  };

  destroy() {
    this.#eventsModel.removeObserver(this.#handleModelEvent);
    this.#container.innerHTML = '';
  }
}
