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
  #eventsModel;

  #onDataChange = null;
  #onModeChange = null;

  constructor(eventsContainer, { onDataChange, onModeChange }, eventsModel) {
    this.#eventsContainer = eventsContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#handleModelEvent);
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

    const editFormComponent = new EditPointView({
      event: {
        ...event,
        offers: this.#eventsModel.getOffersByType(
          event.type,
          event.offers.map((o) => o.id)
        )
      },
      onFormSubmit: (actionType, updateData) => { // Добавляем actionType
        this.#onDataChange(actionType, 'PATCH', updateData);
      }
    });

    editFormComponent.setTypeChangeHandler((type) => {
      const selectedIds = this.#eventsModel.findById(event.id).offers; // Используем findById
      const currentOffers = this.#eventsModel.getOffersByType(type, selectedIds);
      editFormComponent.updateElement({ offers: currentOffers });
    });

    editFormComponent.setFormSubmitHandler((actionType, updatedEvent) => {
      console.log('HANDLING FORM SUBMIT');
      this.#onDataChange(actionType, 'PATCH', updatedEvent);
    });

    editFormComponent.setRollupClickHandler(() => {
      this.#replaceFormToEvent(editFormComponent, eventComponent);
    });

    render(eventComponent, this.#eventListComponent.element);
    this.#eventPresenters.set(event.id, { eventComponent, editFormComponent });
  }

  updateEvent(updatedEvent) {
    const index = this.#events.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      this.#events[index] = updatedEvent;
    }

    if (this.#openedEditForm) {
      this.#replaceFormToEvent(this.#openedEditForm, this.#openedEventComponent);
      this.#openedEditForm = null;
      this.#openedEventComponent = null;
    }

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (presenter) {
      const newEventComponent = new TripEventItemView({
        event: updatedEvent,
        onRollupClick: () => this.#openedEditForm(updatedEvent.id),
        onFavoriteClick: this.#handleFavoriteToggle
      });

      replace(newEventComponent, presenter.eventComponent);

      this.#eventPresenters.set(updatedEvent.id, {
        ...presenter,
        eventComponent: newEventComponent
      });
    }
  }

  #handleFavoriteToggle = (event) => {
    const updatedEvent = { ...event, isFavorite: !event.isFavorite };
    this.#onDataChange(
      'UPDATE',
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

  #handleModelEvent = (updateType, data) => {
    if (updateType === 'update') {
      this.updateEvent(data); // Теперь форма будет закрываться
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
