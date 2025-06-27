import AbstractView from '../framework/view/abstract-view.js';

function createListFilterTemplate(filters = [], currentFilterType = '') {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map(({type, name}) => `
        <div class="trip-filters__filter">
          <input
            id="filter-${type}"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="${type}"
            ${type === currentFilterType ? 'checked' : ''}
          >
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
        </div>
      `).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class ListFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterChange = null;

  constructor({filters, currentFilterType, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createListFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };
}
