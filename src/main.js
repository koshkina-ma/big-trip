import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './model/events-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { filters } from './mock/filter.js';
import { SortType } from './const.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();

let currentFilter = 'everything';
let currentSortType = SortType.DAY;

const tripPresenter = new TripPresenter({
  eventsContainer: siteMainElement,
  eventsModel: eventsModel,
});

const filterPresenter = new FilterPresenter(
  filtersElement,
  filters,
  currentFilter,
  (filterType) => {
    if (currentFilter === filterType) {
      return;
    }

    currentFilter = filterType;
    currentSortType = SortType.DAY;

    tripPresenter.init({ filterType: currentFilter, sortType: currentSortType });
    filterPresenter.init();
  }
);

filterPresenter.init();
tripPresenter.init({ filterType: currentFilter, sortType: currentSortType });
