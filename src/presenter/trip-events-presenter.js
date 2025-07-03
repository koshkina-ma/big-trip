import TripEventListView from '../view/trip-event-list-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, replace } from '../framework/render.js';

export default class TripEventsPresenter {
  #eventsContainer = null;
  #eventListComponent = new TripEventListView();
  #noPointsComponent = null;
  #eventPresenters = new Map();
  #openedEditForm = null;
  #openedEventComponent = null;
  #events = [];

  constructor(eventsContainer) {
    this.#eventsContainer = eventsContainer;
  }

  init(events, filterType) {
    this.#events = events;
    this.#clear();

    if (events.length === 0) {
      this.#noPointsComponent = new NoPointsView(filterType);
      render(this.#noPointsComponent, this.#eventsContainer);
      return;
    }

    render(this.#eventListComponent, this.#eventsContainer);
    this.#renderEvents(this.#events);
  }

  #clear() {
    this.#eventsContainer.innerHTML = '';
    this.#eventListComponent = new TripEventListView();
    this.#noPointsComponent = null;
    this.#eventPresenters.clear();
    this.#openedEditForm = null;
    this.#openedEventComponent = null;
  }

  #renderEvents(events) {
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventComponent = new TripEventItemView({
      event,
      onRollupClick: () => {
        if (this.#openedEditForm) {
          this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
        }
        this.#openedEditForm = this.#eventPresenters.get(event.id).editFormComponent;
        this.#openedEventComponent = eventComponent;
        this.#replaceEventToForm(eventComponent, this.#openedEditForm);
      },
      onFavoriteClick: (evtEvent) => {
        this.#handleFavoriteToggle(evtEvent);
      }
    });

    const editFormComponent = new EditPointView({ event });

    editFormComponent.setFormSubmitHandler((updatedEvent) => {
      this.#handleFormSubmit(updatedEvent, editFormComponent, eventComponent);
    });

    editFormComponent.setRollupClickHandler(() => {
      this.#replaceFormToEvent(editFormComponent, eventComponent);
    });

    render(eventComponent, this.#eventListComponent.element);
    this.#eventPresenters.set(event.id, { eventComponent, editFormComponent });
  }

  #handleFormSubmit(updatedEvent, editFormComponent, eventComponent) {
    const index = this.#events.findIndex((e) => e.id === updatedEvent.id);
    if (index === -1) {
      return;
    }

    this.#events[index] = updatedEvent;

    if (editFormComponent && eventComponent) {
      this.#replaceFormToEvent(editFormComponent, eventComponent);
    }


    const newEventComponent = new TripEventItemView({
      event: updatedEvent,
      onRollupClick: () => {
        if (this.#openedEditForm) {
          this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
        }
        this.#openedEditForm = this.#eventPresenters.get(updatedEvent.id).editFormComponent;
        this.#openedEventComponent = newEventComponent;
        this.#replaceEventToForm(newEventComponent, this.#openedEditForm);
      },
      onFavoriteClick: (evtEvent) => {
        this.#handleFavoriteToggle(evtEvent);
      }
    });

    replace(newEventComponent, eventComponent);


    this.#eventPresenters.set(updatedEvent.id, {
      eventComponent: newEventComponent,
      editFormComponent: editFormComponent,
    });
  }


  #handleFavoriteToggle(event) {
    const updatedEvent = { ...event, isFavorite: !event.isFavorite };
    const index = this.#events.findIndex((e) => e.id === updatedEvent.id);
    if (index === -1) {
      return;
    }

    this.#events[index] = updatedEvent;

    const prevPresenter = this.#eventPresenters.get(updatedEvent.id);
    const newEventComponent = new TripEventItemView({
      event: updatedEvent,
      onRollupClick: () => {
        if (this.#openedEditForm) {
          this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
        }
        this.#openedEditForm = this.#eventPresenters.get(updatedEvent.id).editFormComponent;
        this.#openedEventComponent = newEventComponent;
        this.#replaceEventToForm(newEventComponent, this.#openedEditForm);
      },
      onFavoriteClick: (evtEvent) => {
        this.#handleFavoriteToggle(evtEvent);
      }
    });

    replace(newEventComponent, prevPresenter.eventComponent);

    this.#eventPresenters.set(updatedEvent.id, {
      eventComponent: newEventComponent,
      editFormComponent: prevPresenter.editFormComponent,
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
