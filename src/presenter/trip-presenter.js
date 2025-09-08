import TripInfoPresenter from './trip-info-presenter.js';
import TripSortPresenter from './trip-sort-presenter.js';
import TripEventsPresenter from './trip-events-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #eventsContainer = null;
  #sortContainer = null;
  #listContainer = null;
  #tripInfoContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #filterPresenter = null; //TODO фильтры

  #currentSortType = SortType.DAY;
  #tripInfoPresenter = null;
  #tripSortPresenter = null;
  #tripEventsPresenter = null;
  #newEventPresenter = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ eventsContainer, eventsModel, filterModel, filterPresenter }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#filterPresenter = filterPresenter;

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

    this.#newEventPresenter = new NewEventPresenter({
      container: this.#listContainer,
      eventsModel: this.#eventsModel,
      filterModel: this.#filterModel,
      onDataChange: this.#handleViewAction,
      newEventButton: document.querySelector('.trip-main__event-add-btn')
    });
  }

  init({ sortType = SortType.DAY } = {}) {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
    }

    this.#renderTrip([]);
    this.#newEventPresenter.init();

    if (!this.#eventsModel.isLoading) {
      const events = this.#getFilteredSortedEvents();
      this.#renderTrip(events);
    }
  }

  _computeFilterAvailability() {//TODO фильтры
    return {
      [FilterType.EVERYTHING]: this.#eventsModel.getEvents(FilterType.EVERYTHING).length > 0,
      [FilterType.PAST]: this.#eventsModel.getEvents(FilterType.PAST).length > 0,
      [FilterType.PRESENT]: this.#eventsModel.getEvents(FilterType.PRESENT).length > 0,
      [FilterType.FUTURE]: this.#eventsModel.getEvents(FilterType.FUTURE).length > 0,
    };
  }

  #getFilteredSortedEvents() {
    const filteredEvents = this.#eventsModel.getEvents(this.#filterModel.filter);
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
    console.log('[TripPresenter.#handleModelEvent] updateType:', updateType, 'data:', data);
    switch (updateType) {
      case UpdateType.INIT:
        console.log('[TripPresenter] Model INIT — rendering events');
        this.#renderTrip(this.#getFilteredSortedEvents());
        break;

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

    if (this.#filterPresenter) {//TODO фильтры
      const availability = this._computeFilterAvailability(); // метод, который считает, есть ли события для фильтров
      this.#filterPresenter.updateFilterAvailability(availability);
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

  #handleViewAction = async (actionType, updateType, update) => {
    console.log('[TripPresenter.#handleViewAction] args: ', { actionType, updateType, update });

    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#tripEventsPresenter.setSaving();
        console.log('🔄 TripPresenter: calling update', update);

        try {
          await this.#eventsModel.update(update);
          console.log('✅ TripPresenter: update successful', update);
        } catch(err) {
          console.error('❌ TripPresenter: update error', err, update);
          this.#tripEventsPresenter.setAborting();
        }
        break;

      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.add(update);
          console.log('✅ TripPresenter: add successful', update);
          this.#newEventPresenter.destroyForm();
        } catch(err) {
          console.error('❌ TripPresenter: add error', err, update);
          this.#newEventPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_EVENT:
        this.#tripEventsPresenter.setDeleting();
        try {
          await this.#eventsModel.delete(update);
          console.log('✅ TripPresenter: delete successful', update);
        } catch(err) {
          console.error('❌ TripPresenter: delete error', err, update);
          this.#tripEventsPresenter.setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };


  #handleModeChange = () => {
    this.#tripEventsPresenter.resetView();
  };

  destroy() {
    this.#tripInfoPresenter.destroy();
    this.#tripSortPresenter?.destroy();
    this.#newEventPresenter.destroyForm();
    this.#eventsContainer.innerHTML = '';
    this.#eventsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }
}
