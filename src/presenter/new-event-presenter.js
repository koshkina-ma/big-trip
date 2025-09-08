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


  setSaving() {//TODO метод из учебного проекта, нужен ли он тут вообще?, адаптировать под мой
    if (!this.#addFormComponent) {
      return;
    }
    console.log('🔄 setSaving: блокируем форму, отправка на сервер...');
    this.#addFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {//TODO метод из учебного проекта, адаптировать под мой, в какие места еще добавить? в создание и редактирование?
    if (!this.#addFormComponent) {
      return; // форма уже удалена, ничего не делаем
    }

    const resetFormState = () => {
      this.#addFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#addFormComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    console.log('Received form data:', {
      hasDestination: !!event.destination,
      rawData: event
    });

    this.setSaving();

    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event
    );

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
