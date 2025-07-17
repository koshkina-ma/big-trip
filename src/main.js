import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { filters } from './mock/filter.js';
import { SortType } from './const.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();

const currentFilter = 'everything';
const currentSortType = SortType.DAY;

const tripPresenter = new TripPresenter({
  eventsContainer: siteMainElement,
  eventsModel: eventsModel,
});

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(
  filtersElement,
  filters,
  filterModel,
  (filterType) => {
    filterModel.setFilter(filterType); // Обновляем модель
    tripPresenter.init({ filterType, sortType: SortType.DAY });
  }
);

filterPresenter.init();
tripPresenter.init({ filterType: currentFilter, sortType: currentSortType });
