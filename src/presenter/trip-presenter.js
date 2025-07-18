import TripInfoPresenter from './trip-info-presenter.js';
import TripSortPresenter from './trip-sort-presenter.js';
import TripEventsPresenter from './trip-events-presenter.js';
import { SortType, UpdateType } from '../const.js';

export default class TripPresenter {
  #eventsContainer = null;
  #sortContainer = null;
  #listContainer = null;
  #tripInfoContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #currentSortType = SortType.DAY;
  #tripInfoPresenter = null;
  #tripSortPresenter = null;
  #tripEventsPresenter = null;

  constructor({ eventsContainer, eventsModel, filterModel }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#sortContainer = this.#eventsContainer.querySelector('.trip-events__sort-container');
    this.#listContainer = this.#eventsContainer.querySelector('.trip-events__list');
    this.#tripInfoContainer = document.querySelector('.trip-main__trip-info');

    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainer);
    this.#tripEventsPresenter = new TripEventsPresenter(
      this.#listContainer,
      {
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
      },
      eventsModel
    );
  }

  init({ sortType = SortType.DAY } = {}) {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
    }
    const events = this.#getFilteredSortedEvents();
    this.#renderTrip(events);
  }

  #getFilteredSortedEvents() {
    const filteredEvents = this.#eventsModel.getEvents(this.#filterModel.filter); // Используем модель фильтров
    return this.#getSortedEvents(filteredEvents);
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

  #renderTrip(events) {
    this.#tripInfoPresenter.init(events);

    if (!this.#tripSortPresenter) {
      this.#tripSortPresenter = new TripSortPresenter(
        this.#sortContainer,
        this.#currentSortType,
        this.#handleSortTypeChange
      );
    }
    this.#tripSortPresenter.init();
    this.#tripEventsPresenter.init(events, this.#filterModel.filter);
  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#renderTrip(this.#getFilteredSortedEvents());
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripEventsPresenter.updateEvent(data);
        break;
      case UpdateType.MINOR:
        this.#renderTrip(this.#getFilteredSortedEvents());
        break;
      case UpdateType.MAJOR:
        this.init();
        break;
    }
  };


  #handleViewAction = (actionType, updateType, update) => {
    console.log('Action:', actionType, 'Data:', update);
    switch (actionType) {
      case 'UPDATE':
        this.#eventsModel.update(update);
        break;
      case 'ADD':
        this.#eventsModel.add(update);
        break;
      case 'DELETE':
        this.#eventsModel.delete(update);
        break;
    }
  };

  #handleModeChange = () => {
    debugger;
    this.#tripEventsPresenter.resetView();
  };

  destroy() {
    this.#tripInfoPresenter.destroy();
    this.#tripSortPresenter?.destroy();
    this.#eventsContainer.innerHTML = '';
  }
}
