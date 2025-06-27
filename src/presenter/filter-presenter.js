import ListFilterView from '../view/list-filter-view.js';
import { render, replace } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #filters = null;
  #currentFilter = null;
  #onFilterChange = null;
  #filterComponent = null;

  constructor(container, filters, currentFilter, onFilterChange) {
    this.#container = container;
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new ListFilterView({
      filters: this.#filters,
      currentFilterType: this.#currentFilter,
      onFilterChange: this.#handleFilterChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
  }

  #handleFilterChange = (filterType) => {
    if (this.#currentFilter === filterType) {
      return;
    }

    this.#currentFilter = filterType;
    this.#onFilterChange(filterType);
  };

  destroy() {
    if (this.#filterComponent) {
      this.#filterComponent.element.remove();
      this.#filterComponent = null;
    }
  }
}
