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

const filterPresenter = new FilterPresenter(
  filtersElement,
  filters,
  currentFilter,
  (filterType) => {
    if (currentFilter === filterType) {
      return;
    }

    currentFilter = filterType;

    filterPresenter.init();
    tripPresenter.init({ filterType: currentFilter });
  }
);

filterPresenter.init();
tripPresenter.init({ filterType: currentFilter });
