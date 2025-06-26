import {render} from './framework/render.js';
import ListFilterView from './view/list-filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './model/events-model.js';
import {filters} from './mock/filter.js';


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
  tripPresenter.init({filterType: currentFilter});
};

render(new ListFilterView({
  filters: filters,
  currentFilterType: currentFilter,
  onFilterChange: handleFilterChange
}), filtersElement);

tripPresenter.init({filterType: currentFilter});
