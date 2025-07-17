import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType.MINOR, filter);
  }
}
//после этого нужно сделать изменения в майн
