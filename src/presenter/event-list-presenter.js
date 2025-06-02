import TripEventListView from '../view/trip-event-list-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import AddNewPoint from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render} from '../render.js';

export default class EventsListPresenter {
  eventListComponent = new TripEventListView();

  constructor ({eventsContainer, eventsModel}) {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
  }

  init () {
    render(new ListSortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);

    render(new EditPointView(), this.eventListComponent.getElement());

    const events = this.eventsModel.getEvents();

    events.forEach((event) => {
      render(new TripEventItemView(event), this.eventListComponent.getElement());
    });

    render(new AddNewPoint(), this.eventListComponent.getElement());
  }

}

