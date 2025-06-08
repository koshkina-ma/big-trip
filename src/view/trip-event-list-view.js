import AbstractView from '../framework/view/abstract-view.js';

function createTripEventListTemplate() {
  return (/*html*/
    `<ul class="trip-events__list">
    </ul>`

  );
}

export default class TripEventListView extends AbstractView {
  get template() {
    return createTripEventListTemplate();
  }
}
