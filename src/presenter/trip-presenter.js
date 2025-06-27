import TripInfoPresenter from './trip-info-presenter.js';
import TripSortPresenter from './trip-sort-presenter.js';
import TripEventsPresenter from './trip-events-presenter.js';

import { filter } from '../utils/filter.js';
import { SortType, FilterType } from '../const.js';

export default class TripPresenter {
  #eventsContainer = null;
  #sortContainer = null;
  #listContainer = null;
  #tripInfoContainer = null;
  #eventsModel = null;
  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #tripInfoPresenter = null;
  #tripSortPresenter = null;
  #tripEventsPresenter = null;

  constructor({ eventsContainer, eventsModel }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;

    this.#sortContainer = this.#eventsContainer.querySelector('.trip-events__sort-container');
    this.#listContainer = this.#eventsContainer.querySelector('.trip-events__list');

    this.#tripInfoContainer = document.querySelector('.trip-main__trip-info');

    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainer);
    this.#tripEventsPresenter = new TripEventsPresenter(this.#listContainer);
  }

  init({ filterType = FilterType.EVERYTHING } = {}) {
    this.#filterType = filterType;
    this.#currentSortType = SortType.DAY;

    const allEvents = this.#eventsModel.getEvents();
    const filteredEvents = filter[this.#filterType](allEvents);
    const sortedEvents = this.#getSortedEvents(filteredEvents);

    this.#tripInfoPresenter.init(allEvents);

    if (!this.#tripSortPresenter) {
      this.#tripSortPresenter = new TripSortPresenter(
        this.#sortContainer,
        this.#currentSortType,
        this.#handleSortTypeChange
      );
    }
    this.#tripSortPresenter.init();

    this.#tripEventsPresenter.init(sortedEvents, this.#filterType);
  }

  #getSortedEvents(events) {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...events].sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
      case SortType.PRICE:
        return [...events].sort((a, b) => b.basePrice - a.basePrice);
      default:
        return [...events].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const allEvents = this.#eventsModel.getEvents();
    const filteredEvents = filter[this.#filterType](allEvents);
    const sortedEvents = this.#getSortedEvents(filteredEvents);

    this.#tripEventsPresenter.init(sortedEvents, this.#filterType);
  };

  destroy() {
    this.#tripInfoPresenter.destroy();
    this.#tripSortPresenter?.destroy();
    this.#eventsContainer.innerHTML = '';
  }
}
