import ListFilterView from './view/list-filter-view.js';
import EventsListPresenter from './presenter/event-list-presenter.js';
import {render, RenderPosition} from './render.js';


const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
//const tripEventListElement = document.querySelector('.trip-events__list');
//const tripEventsElement = document.querySelector('.trip-events');

const eventsListPresenter = new EventsListPresenter({eventsContainer: siteMainElement});

render(new ListFilterView(), filtersElement);


eventsListPresenter.init();


