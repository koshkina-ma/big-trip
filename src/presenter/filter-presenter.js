import ListFilterView from '../view/list-filter-view.js';
import { render, replace } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #filters = null;
  #filterModel = null;
  #onFilterChange = null;
  #filterComponent = null;

  constructor(container, filters, filterModel, onFilterChange) {
    this.#container = container;
    this.#filters = filters;
    this.#filterModel = filterModel;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new ListFilterView({
      filters: this.#filters,
      currentFilterType: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
  }

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(filterType);
    this.#onFilterChange(filterType);
  };

  destroy() {
    if (this.#filterComponent) {
      this.#filterComponent.element.remove();
      this.#filterComponent = null;
    }
  }
}
