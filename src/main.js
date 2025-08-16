import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './model/events-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { SortType, FilterType } from './const.js';
import EventsApiService from './events-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS58wcl1sa8j1';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const filtersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const filters = Object.entries(FilterType).map(([key, type]) => ({
  type,
  name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
}));

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel({ destinationsApiService: eventsApiService });
const offersModel = new OffersModel({ offersApiService: eventsApiService });

const eventsModel = new EventsModel({
  eventsApiService: eventsApiService,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});

const filterModel = new FilterModel();

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
    filterModel.setFilter(filterType);
    tripPresenter.init({ sortType: SortType.DAY });
  }
});

filterPresenter.init();
tripPresenter.init({ sortType: SortType.DAY });

eventsModel.init().catch((err) => {
  console.error('eventsModel.init failed:', err);
});
