import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

function createNoPointsTemplate(filterType) {
  let message = NoPointsTextType.EVERYTHING;

  switch (filterType) {
    case 'past':
      message = NoPointsTextType.PAST;
      break;
    case 'present':
      message = NoPointsTextType.PRESENT;
      break;
    case 'future':
      message = NoPointsTextType.FUTURE;
      break;
  }

  return `<p class="trip-events__msg">${message}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType = 'everything') {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
