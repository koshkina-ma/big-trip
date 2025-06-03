import TripEventListView from '../view/trip-event-list-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripInfoView from '../view/trip-info-view.js';

import {formatTripTitle, formatTripDates, calculateTotalCost} from '../utils.js';
import {render} from '../render.js';

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

    const tripInfoComponent = new TripInfoView({
      title: formatTripTitle(sortedEvents),
      dateRange: formatTripDates(sortedEvents),
      totalCost: calculateTotalCost(sortedEvents),
    });
    this.tripInfoContainer.innerHTML = '';
    render(tripInfoComponent, this.tripInfoContainer);

    render(new ListSortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);

    const editPointView = new EditPointView(eventItems[0]);
    render(editPointView, this.eventListComponent.getElement());

    eventItems.forEach((event) => {
      render(new TripEventItemView(event), this.eventListComponent.getElement());
    });

    const addNewPointView = new AddNewPointView(eventItems[1]);
    render(addNewPointView, this.eventListComponent.getElement());
  }

}

