import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { SortType, FilterType } from './const.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

// Генерация filters на основе FilterType
const filters = Object.entries(FilterType).map(([key, type]) => ({
  type,
  name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
}));

// 1. Инициализация моделей
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

// 2. Инициализация презентеров
const tripPresenter = new TripPresenter({
  eventsContainer: siteMainElement,
  eventsModel: eventsModel,
  filterModel: filterModel
});

const filterPresenter = new FilterPresenter({
  container: filtersElement,
  filters: filters,
  filterModel: filterModel,
  onFilterChange: (filterType) => {
    filterModel.setFilter(filterType); // Обновляем модель
    tripPresenter.init({ sortType: SortType.DAY });
  }
});

filterPresenter.init();
tripPresenter.init({ sortType: SortType.DAY });
