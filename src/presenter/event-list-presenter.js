import TripEventListView from '../view/trip-event-list-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import AddNewPoint from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {EVENT_COUNT} from '../const.js';
import {render} from '../render.js';

export default class EventsListPresenter {
  eventListComponent = new TripEventListView();

  constructor ({eventsContainer}) {
    this.eventsContainer = eventsContainer;
  }

  init () {
    render (new ListSortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);

    render(new EditPointView(), this.eventListComponent.getElement());

    for (let i = 0; i < EVENT_COUNT; i++) {
      render(new TripEventItemView(), this.eventListComponent.getElement());
    }

    render(new AddNewPoint(), this.eventListComponent.getElement());
  }

}

