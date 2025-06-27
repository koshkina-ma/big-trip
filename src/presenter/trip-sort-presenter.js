import ListSortView from '../view/list-sort-view.js';
import { render, replace } from '../framework/render.js';

export default class TripSortPresenter {
  #container = null;
  #sortComponent = null;
  #currentSortType = null;
  #callback = null;

  constructor(container, initialSortType, onSortTypeChange) {
    this.#container = container;
    this.#currentSortType = initialSortType;
    this.#callback = onSortTypeChange;
  }

  init() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new ListSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#container);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
  }

  setSortType(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.init();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#callback(sortType);
  };

  destroy() {
    if (this.#sortComponent) {
      this.#sortComponent.element.remove();
      this.#sortComponent = null;
    }
  }
}
