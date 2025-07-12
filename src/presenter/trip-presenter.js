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

  //какой-то одноименный геттер, проверить место в модели у меня getEvents
  get Events() {
    return this.#eventsModel.events;
  }

  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;

  #tripInfoPresenter = null;
  #tripSortPresenter = null;
  #tripEventsPresenter = null;

  constructor({ eventsContainer, eventsModel }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);

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

  init({ filterType = FilterType.EVERYTHING, sortType = SortType.DAY } = {}) {
    if (this.#filterType !== filterType) {
      this.#filterType = filterType;
      this.#currentSortType = SortType.DAY;
      if (this.#tripSortPresenter) {
        this.#tripSortPresenter.setSortType(this.#currentSortType);
      }
    }
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
    }

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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case 'UPDATE_EVENT':
        this.#eventsModel.updateEvent(update);
        break;
      case 'ADD_EVENT':
        // Если добавление реализовано
        if (this.#eventsModel.addEvent) {
          this.#eventsModel.addEvent(update);
        }
        break;
      case 'DELETE_EVENT':
        // Если удаление реализовано
        if (this.#eventsModel.deleteEvent) {
          this.#eventsModel.deleteEvent(update.id);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case 'eventUpdated':
        this.#tripEventsPresenter.updateEvent(data);
        break;
      case 'eventsUpdated':
        this.init({ filterType: this.#filterType, sortType: this.#currentSortType });
        break;
    }
  };

  #handleModeChange = () => {
    //без изменений или пустой метод
  };

  destroy() {
    this.#tripInfoPresenter.destroy();
    this.#tripSortPresenter?.destroy();
    this.#eventsContainer.innerHTML = '';
  }
}

// //в этом файле надо добавить
//  #handleViewAction = (actionType, updateType, update) => { про типи патч минор мажор тип обновления из конст.
//     console.log(actionType, updateType, update);
//     // Здесь будем вызывать обновление модели. тут какие-то Case и break 30:23 комит 7.4
//     // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
//     // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
//     // update - обновленные данные
//   };

//   #handleModelEvent = (updateType, data) => { как и что будет перерисовываться пишем в этот метод, тут switch
//     console.log(updateType, data);
//     // В зависимости от типа изменений решаем, что делать:
//     // - обновить часть списка (например, когда поменялось описание)
//     // - обновить список (например, когда задача ушла в архив)
//     // - обновить всю доску (например, при переключении фильтра)
//   };

//   //      onDataChange: this.#handleViewAction,
//    //   onModeChange: this.#handleModeChange
//      });
//     taskPresenter.init(task);


