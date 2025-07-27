import TripInfoPresenter from './trip-info-presenter.js';
import TripSortPresenter from './trip-sort-presenter.js';
import TripEventsPresenter from './trip-events-presenter.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';

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

    this.#tripInfoPresenter = new TripInfoPresenter({
      container: this.#tripInfoContainer,
      eventsModel: this.#eventsModel
    });

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
    this.#tripInfoPresenter.init();

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
        this.#tripInfoPresenter.init();
        this.#tripEventsPresenter.updateEvent(data);
        if (this.#currentSortType === SortType.DAY) {
          this.#renderTrip(this.#getFilteredSortedEvents());
        }
        break;
      case UpdateType.MINOR:
        if (Object.values(FilterType).includes(data)) {
          this.#resetSortToDay();
        }
        this.#tripInfoPresenter.init();
        this.#renderTrip(this.#getFilteredSortedEvents());
        break;
      case UpdateType.MAJOR:
        this.#resetSortToDay();
        this.init();
        break;
    }
  };

  #resetSortToDay() {
    if (this.#currentSortType !== SortType.DAY) {
      this.#currentSortType = SortType.DAY;
      if (this.#tripSortPresenter) {
        this.#tripSortPresenter.setSortType(SortType.DAY);
      }
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
     console.log('[TripPresenter] handleViewAction', actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.update(update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.add(update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.delete(update);
        break;
    }
  };

  #handleModeChange = () => {
    this.#tripEventsPresenter.resetView();
  };

  destroy() {
    this.#tripInfoPresenter.destroy();
    this.#tripSortPresenter?.destroy();
    this.#eventsContainer.innerHTML = '';
  }
}
