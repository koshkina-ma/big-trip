import TripEventListView from '../view/trip-event-list-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, replace } from '../framework/render.js';

export default class TripEventsPresenter {
  #eventsContainer = null;
  #eventListComponent = new TripEventListView();
  #noPointsComponent = null;
  #openedEditForm = null;
  #openedEventComponent = null;

  constructor(eventsContainer) {
    this.#eventsContainer = eventsContainer;
  }

  init(events, filterType) {
    this.#clear();

    if (events.length === 0) {
      this.#noPointsComponent = new NoPointsView(filterType);
      render(this.#noPointsComponent, this.#eventsContainer);
      return;
    }

    render(this.#eventListComponent, this.#eventsContainer);

    this.#renderEvents(events);
  }

  #clear() {
    this.#eventsContainer.innerHTML = '';
    this.#eventListComponent = new TripEventListView();
    this.#noPointsComponent = null;
    this.#openedEditForm = null;
    this.#openedEventComponent = null;
  }

  #renderEvents(events) {
    events.forEach((event) => {
      const eventComponent = new TripEventItemView({ event });
      const editFormComponent = new EditPointView({ event });

      eventComponent.setRollupClickHandler(() => {
        if (this.#openedEditForm) {
          this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
        }
        this.#openedEditForm = editFormComponent;
        this.#openedEventComponent = eventComponent;
        this.#replaceEventToForm(eventComponent, editFormComponent);
      });

      editFormComponent.setFormSubmitHandler(() => {
        this.#replaceFormToEvent(editFormComponent, eventComponent);
      });

      editFormComponent.setRollupClickHandler(() => {
        this.#replaceFormToEvent(editFormComponent, eventComponent);
      });

      render(eventComponent, this.#eventListComponent.element);
    });
  }

  #replaceEventToForm(eventComponent, editFormComponent) {
    replace(editFormComponent, eventComponent);
    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  #replaceFormToEvent(editFormComponent, eventComponent) {
    replace(eventComponent, editFormComponent);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#openedEditForm = null;
    this.#openedEventComponent = null;
  }

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      if (this.#openedEditForm && this.#openedEventComponent) {
        this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
      }
    }
  };
}
