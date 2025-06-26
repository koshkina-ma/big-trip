import TripEventListView from '../view/trip-event-list-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripMainView from '../view/trip-main-view.js';
import TripCostView from '../view/trip-cost-view.js';
import NoPointsView from '../view/no-points-view.js';

import { formatTripTitle, formatTripDates, calculateTotalCost } from '../utils/utils.js';
import { render, replace } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { SortType, FilterType } from '../const.js';

export default class TripPresenter {
  eventListComponent = new TripEventListView();
  noPointsComponent = new NoPointsView();
  #openedEditForm = null;
  #openedEventComponent = null;

  #eventsContainer = null;
  #eventsModel = null;
  #tripInfoContainer = null;
  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #sortComponent = null;

  constructor({ eventsContainer, eventsModel }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#tripInfoContainer = document.querySelector('.trip-main__trip-info');
  }

  init({ filterType = FilterType.EVERYTHING } = {}) {
    this.#filterType = filterType;
    this.#currentSortType = SortType.DAY; // сброс сортировки при смене фильтра
    this.#renderAll();
  }

  destroy() {
    this.#clearBoard();
  }

  #clearBoard() {
    this.#tripInfoContainer.innerHTML = '';
    this.#eventsContainer.innerHTML = '';
    this.eventListComponent = new TripEventListView();
    this.noPointsComponent = new NoPointsView();
    this.#sortComponent = null;
  }

  #renderAll() {
    const allEvents = this.#eventsModel.getEvents();
    const filteredEvents = filter[this.#filterType](allEvents);
    const sortedEvents = this.#getSortedEvents(filteredEvents);

    this.#tripInfoContainer.innerHTML = '';
    this.#eventsContainer.innerHTML = '';

    // Рендерим шапку, если есть хоть одна точка в полном списке
    if (allEvents.length > 0) {
      const tripMainComponent = new TripMainView({
        title: formatTripTitle(allEvents),
        dateRange: formatTripDates(allEvents)
      });

      const tripCostComponent = new TripCostView(
        calculateTotalCost(allEvents)
      );

      render(tripMainComponent, this.#tripInfoContainer);
      render(tripCostComponent, this.#tripInfoContainer);
    }

    if (filteredEvents.length === 0) {
      this.noPointsComponent = new NoPointsView(this.#filterType);
      render(this.noPointsComponent, this.#eventsContainer);
      return;
    }

    this.#sortComponent = new ListSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#eventsContainer);

    render(this.eventListComponent, this.#eventsContainer);
    this.#renderPoints(sortedEvents);
  }


  #renderPoints(events) {
    events.forEach((event) => {
      const eventComponent = new TripEventItemView({ event });
      const editFormComponent = new EditPointView({ event });

      eventComponent.setRollupClickHandler(() => {
        if (this.#openedEditForm) {
          this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
        }
        this.#openedEditForm = editFormComponent;
        this.#openedEventComponent = eventComponent;
        this.#replaceEventToForm(eventComponent, editFormComponent);
      });

      editFormComponent.setFormSubmitHandler(() => {
        this.#replaceFormToEvent(editFormComponent, eventComponent);
      });

      editFormComponent.setRollupClickHandler(() => {
        this.#replaceFormToEvent(editFormComponent, eventComponent);
      });

      render(eventComponent, this.eventListComponent.element);
    });
  }

  #replaceEventToForm(eventComponent, editFormComponent) {
    replace(editFormComponent, eventComponent);
    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  #replaceFormToEvent(editFormComponent, eventComponent) {
    replace(eventComponent, editFormComponent);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#openedEditForm = null;
    this.#openedEventComponent = null;
  }

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      if (this.#openedEditForm && this.#openedEventComponent) {
        this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
      }
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#eventsContainer.innerHTML = '';
    this.eventListComponent = new TripEventListView();
    this.#renderAll();
  };

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
}
