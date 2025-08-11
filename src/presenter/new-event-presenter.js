import AddNewPointView from '../view/add-new-point-view.js';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType, FilterType } from '../const.js';

export default class NewEventPresenter {
  #container = null;
  #eventsModel = null;
  #filterModel = null;
  #handleDataChange = null;
  #newEventButton = null;

  #addFormComponent = null;

  constructor({ container, eventsModel, filterModel, onDataChange, newEventButton }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#handleDataChange = onDataChange;
    this.#newEventButton = newEventButton;

    if (!this.#eventsModel) {
      throw new Error('EventsModel is required');
    }
  }

  init() {
    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
  }

  #handleNewEventButtonClick = () => {
    this.#filterModel.setFilter(FilterType.EVERYTHING);
    this.#renderAddForm();
    this.#newEventButton.disabled = true;
  };

  #renderAddForm() {
    if (this.#addFormComponent) {
      return;
    }

    this.#addFormComponent = new AddNewPointView({
      eventsModel: this.#eventsModel,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick
    });

    render(this.#addFormComponent, this.#container, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroyForm() {
    if (!this.#addFormComponent) {
      return;
    }

    remove(this.#addFormComponent);
    this.#addFormComponent = null;
    this.#newEventButton.disabled = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  // #getDefaultOffers() {
  //   return this.#eventsModel.getOffersByType(DEFAULT_EVENT_TYPE, []);
  // }

  #handleFormSubmit = (event) => {
    console.log('Received form data:', {
      hasDestination: !!event.destination, // Проверить перед обработкой
      rawData: event
    });

    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      { ...event, id: crypto.randomUUID() }
    );
    this.destroyForm();
  };

  #handleCancelClick = () => {
    this.destroyForm();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroyForm();
    }
  };
}
