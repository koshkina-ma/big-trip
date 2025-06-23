import TripEventListView from '../view/trip-event-list-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripMainView from '../view/trip-main-view.js';
import TripCostView from '../view/trip-cost-view.js';

import {formatTripTitle, formatTripDates, calculateTotalCost} from '../utils.js';
import {render} from '../framework/render.js';

export default class TripPresenter {
  eventListComponent = new TripEventListView();

  constructor ({eventsContainer, eventsModel}) {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.tripInfoContainer = document.querySelector('.trip-main__trip-info');
  }

  init () {
    const eventItems = this.eventsModel.getEvents();
    const sortedEvents = [...eventItems].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    const tripMainComponent = new TripMainView({
      title: formatTripTitle(sortedEvents),
      dateRange: formatTripDates(sortedEvents)
    });

    const tripCostComponent = new TripCostView(
      calculateTotalCost(sortedEvents)
    );

    this.tripInfoContainer.innerHTML = '';
    render(tripMainComponent, this.tripInfoContainer);
    render(tripCostComponent, this.tripInfoContainer);

    render(new ListSortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);

    this.#renderPoints(eventItems);
  }

  #renderPoints(eventItems) {
    const editPointView = new EditPointView(eventItems[0]);
    render(editPointView, this.eventListComponent.element);

    eventItems.forEach((event) => {
      render(new TripEventItemView(event), this.eventListComponent.element);
    });

    const addNewPointView = new AddNewPointView(eventItems[1]);
    render(addNewPointView, this.eventListComponent.element);
  }

}

