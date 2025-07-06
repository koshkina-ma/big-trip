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

  #onDataChange = null;
  #onModeChange = null;

  constructor(eventsContainer, { onDataChange, onModeChange }) {
    this.#eventsContainer = eventsContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
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

  updateEvent(updatedEvent) {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      return;
    }

    this.#events[index] = updatedEvent;

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (!presenter) {
      return;
    }

    const { eventComponent: oldEventComponent, editFormComponent } = presenter;

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

    const newEditFormComponent = new EditPointView({ event: updatedEvent });

    newEditFormComponent.setFormSubmitHandler((evt) => {
      this.#onDataChange('UPDATE_EVENT', 'PATCH', evt);
    });

    newEditFormComponent.setRollupClickHandler(() => {
      this.#replaceFormToEvent(newEditFormComponent, newEventComponent);
    });

    // Логика безопасной замены
    if (oldEventComponent.element.parentElement) {
      replace(newEventComponent, oldEventComponent);
    } else if (editFormComponent.element.parentElement) {
      replace(newEventComponent, editFormComponent);
      this.#openedEditForm = null;
      this.#openedEventComponent = null;
    } else {
      render(newEventComponent, this.#eventListComponent.element);
    }

    // Обновляем мапу
    this.#eventPresenters.set(updatedEvent.id, {
      eventComponent: newEventComponent,
      editFormComponent: newEditFormComponent,
    });
  }

  resetView() {
    if (this.#openedEditForm && this.#openedEventComponent) {
      this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
    }
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
      this.#onDataChange(
        'UPDATE_EVENT',
        'PATCH',
        updatedEvent
      );
    });

    editFormComponent.setRollupClickHandler(() => {
      this.#replaceFormToEvent(editFormComponent, eventComponent);
    });

    render(eventComponent, this.#eventListComponent.element);
    this.#eventPresenters.set(event.id, { eventComponent, editFormComponent });
  }

  // #handleFormSubmit(updatedEvent, editFormComponent, eventComponent) { //тут изменения или в основном презентере
  //   const index = this.#events.findIndex((e) => e.id === updatedEvent.id);
  //   if (index === -1) {
  //     return;
  //   }

  //   this.#events[index] = updatedEvent;

  //   if (editFormComponent && eventComponent) {
  //     this.#replaceFormToEvent(editFormComponent, eventComponent);
  //   }


  //   const newEventComponent = new TripEventItemView({
  //     event: updatedEvent,
  //     onRollupClick: () => {
  //       if (this.#openedEditForm) {
  //         this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
  //       }
  //       this.#openedEditForm = this.#eventPresenters.get(updatedEvent.id).editFormComponent;
  //       this.#openedEventComponent = newEventComponent;
  //       this.#replaceEventToForm(newEventComponent, this.#openedEditForm);
  //     },
  //     onFavoriteClick: (evtEvent) => {
  //       this.#handleFavoriteToggle(evtEvent);
  //     }
  //   });

  //   replace(newEventComponent, eventComponent);


  //   this.#eventPresenters.set(updatedEvent.id, {
  //     eventComponent: newEventComponent,
  //     editFormComponent: editFormComponent,
  //   });
  // }


  #handleFavoriteToggle(event) {
    const updatedEvent = { ...event, isFavorite: !event.isFavorite };
    this.#onDataChange(
      'UPDATE_EVENT',
      'PATCH',
      updatedEvent
    );
  }

  #replaceEventToForm(eventComponent, editFormComponent) {
    if (this.#onModeChange) {
      this.#onModeChange();
    }
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

  #clear() {
    this.#eventsContainer.innerHTML = '';
    this.#eventListComponent = new TripEventListView();
    this.#noPointsComponent = null;
    this.#eventPresenters.clear();
    this.#openedEditForm = null;
    this.#openedEventComponent = null;
  }


}

