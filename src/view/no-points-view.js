import AbstractView from '../framework/view/abstract-view.js';
import { FilterType, NoPointsText } from '../const.js';


function createNoPointsTemplate(filterType) {
  const message = NoPointsText[filterType] || NoPointsText[FilterType.EVERYTHING];
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType = FilterType.EVERYTHING;

  constructor(filterType = FilterType.EVERYTHING) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
