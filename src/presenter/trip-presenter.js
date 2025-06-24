import TripEventListView from '../view/trip-event-list-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripMainView from '../view/trip-main-view.js';
import TripCostView from '../view/trip-cost-view.js';
import NoPointsView from '../view/no-points-view.js';

import { formatTripTitle, formatTripDates, calculateTotalCost } from '../utils/utils.js';
import { render, replace } from '../framework/render.js';

export default class TripPresenter {
  eventListComponent = new TripEventListView();
  noPointsComponent = new NoPointsView();
  #openedEditForm = null;
  #openedEventComponent = null;

  constructor({ eventsContainer, eventsModel }) {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.tripInfoContainer = document.querySelector('.trip-main__trip-info');
  }

  init() {
    this.#renderAll();
  }

  #renderAll() {
    const eventItems = this.eventsModel.getEvents();
    const sortedEvents = [...eventItems].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    this.tripInfoContainer.innerHTML = '';

    if (eventItems.length === 0) {
      render(this.noPointsComponent, this.eventsContainer);
      return;
    }

    const tripMainComponent = new TripMainView({
      title: formatTripTitle(sortedEvents),
      dateRange: formatTripDates(sortedEvents)
    });

    const tripCostComponent = new TripCostView(
      calculateTotalCost(sortedEvents)
    );

    render(tripMainComponent, this.tripInfoContainer);
    render(tripCostComponent, this.tripInfoContainer);
    render(new ListSortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);

    this.#renderPoints(eventItems);
  }

  #renderPoints(eventItems) {
    eventItems.forEach((event) => {
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

    const addNewPointView = new AddNewPointView(eventItems[0]);
    render(addNewPointView, this.eventListComponent.element);
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
}
