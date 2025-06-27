import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './model/events-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { filters } from './mock/filter.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const tripPresenter = new TripPresenter({
  eventsContainer: siteMainElement,
  eventsModel: eventsModel,
});

let currentFilter = 'everything';

const handleFilterChange = (filterType) => {
  currentFilter = filterType;
  tripPresenter.destroy();
  tripPresenter.init({ filterType: currentFilter });
};

const filterPresenter = new FilterPresenter(
  filtersElement,
  filters,
  currentFilter,
  handleFilterChange
);

filterPresenter.init();
tripPresenter.init({ filterType: currentFilter });
