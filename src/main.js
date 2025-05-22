import ListFilterView from './view/list-filter-view.js';
import {render} from './render.js';

//const siteMainElement = document.querySelector('.main');
//const siteHeaderElement = siteMainElement.querySelector('.main__control');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
//const tripEventListElement = document.querySelector('.trip-events__list');



render(new ListFilterView(), filtersElement);





