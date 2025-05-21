import ListFilterView from './view/list-filter-view.js';
import ListSortView from './view/list-sort-view.js';
import TripEventListView from './view/trip-event-list-view.js';
import TripEventItem from './view/trip-event-item-view.js';
import AddNewPoint from './view/add-new-point-view.js';
import EditPointView from './view/edit-point-view.js';
import {render, RenderPosition} from './render.js';

//const siteMainElement = document.querySelector('.main');
//const siteHeaderElement = siteMainElement.querySelector('.main__control');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
//const tripEventListElement = document.querySelector('.trip-events__list');



render(new ListFilterView(), filtersElement);
render(new ListSortView(), tripEventsElement, RenderPosition.AFTERBEGIN);
render(new TripEventListView(), tripEventsElement);
render(new AddNewPoint(), tripEventsElement);
render(new TripEventItem(), tripEventsElement);
render(new EditPointView(), tripEventsElement);




