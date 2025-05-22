import TripEventListView from './view/trip-event-list-view.js';
import ListSortView from './view/list-sort-view.js';
import TripEventItem from './view/trip-event-item-view.js';
import AddNewPoint from './view/add-new-point-view.js';
import EditPointView from './view/edit-point-view.js';
import {render, RenderPosition} from './render.js';

render(new ListSortView(), tripEventsElement, RenderPosition.AFTERBEGIN);
render(new TripEventListView(), tripEventsElement);
render(new AddNewPoint(), tripEventsElement);
render(new TripEventItem(), tripEventsElement);
render(new EditPointView(), tripEventsElement);

export default class EventsListPresenter {
  

}

