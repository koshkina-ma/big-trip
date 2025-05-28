import ListFilterView from './view/list-filter-view.js';
import EventsListPresenter from './presenter/event-list-presenter.js';
import {render} from './render.js';
import EventsModel from './model/events-model.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
//const tripEventListElement = document.querySelector('.trip-events__list');
//const tripEventsElement = document.querySelector('.trip-events');


const eventsModel = new EventsModel();

const eventsListPresenter = new EventsListPresenter({
  eventsContainer: siteMainElement,
  eventsModel: eventsModel,
});

//console.log('Events:', eventsModel.getEvents());

render(new ListFilterView(), filtersElement);


eventsListPresenter.init();

