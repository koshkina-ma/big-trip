import TripEventListView from '../view/trip-event-list-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class TripEventsPresenter {
  #eventsContainer = null;
  #eventListComponent = new TripEventListView();
  #noPointsComponent = null;
  #eventPresenters = new Map();
  #editForm = null;
  #eventCard = null;
  #events = [];
  #eventsModel;

  #onDataChange = null;
  // #onModeChange = null;

  constructor(eventsContainer, { onDataChange }, eventsModel) {
    this.#eventsContainer = eventsContainer;
    this.#onDataChange = onDataChange;
    // this.#onModeChange = onModeChange;
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
    if (this.#editForm) {
      this.#closeEditForm();
    }
  }


  #renderEvents(events) {
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventComponent = new TripEventItemView({
      event,
      onRollupClick: () => {
        if (this.#editForm) {
          this.#closeEditForm();
        }

        // const { editFormComponent } = this.#eventPresenters.get(event.id);
        // this.#openEditForm(eventComponent, editFormComponent);
        this.#openEditForm(event.id, eventComponent);
      },

      onFavoriteClick: (evt) => {
        this.#handleFavoriteToggle(evt);
      }
    });

    render(eventComponent, this.#eventListComponent.element);
    this.#eventPresenters.set(event.id, {
      eventComponent
      // editFormComponent: formComponent
    });
  }

  updateEvent(updatedEvent) {
    const index = this.#events.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      this.#events[index] = updatedEvent;
    }

    if (this.#editForm) {
      this.#closeEditForm();
    }

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (presenter) {
      const newEventComponent = new TripEventItemView({
        event: updatedEvent,
        onRollupClick: () => {
          if (this.#editForm) {
            this.#closeEditForm();
          }
          const editFormComponent = this.#eventPresenters.get(updatedEvent.id).editFormComponent;
          this.#openEditForm(newEventComponent, editFormComponent);
        },
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
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      updatedEvent
    );
  };

  #openEditForm(eventId, eventComponent) {
    if (this.#editForm) {
      this.#closeEditForm();
    }

    const eventData = this.#eventsModel.findById(eventId);
    const formComponent = new EditPointView({
      event: {
        ...structuredClone(eventData),
        offers: this.#eventsModel.getOffersByType(
          eventData.type,
          eventData.offers.map((o) => o.id)
        )
      },
      eventsModel: this.#eventsModel
    });

    formComponent.setFormSubmitHandler((actionType, updatedEvent) => {
      console.log('[Presenter] submit handler', actionType, updatedEvent);
      const selectedOffers = updatedEvent.offers
        .filter((offer) => offer.isChecked)
        .map(({ id, title, price }) => ({ id, title, price }));

      console.log('[Presenter] SUBMIT form', actionType, updatedEvent);

      this.#onDataChange(actionType, UpdateType.MINOR, {
        ...updatedEvent,
        offers: selectedOffers
      });
    });

    formComponent.setDeleteClickHandler((pointId) => {
      this.#onDataChange(UserAction.DELETE_EVENT, UpdateType.MINOR, pointId);
      this.#closeEditForm();
    });

    formComponent.setTypeChangeHandler((type) => {
      const selectedIds = this.#eventsModel.findById(eventId).offers;
      const currentOffers = this.#eventsModel.getOffersByType(type, selectedIds);
      formComponent.updateElement({ offers: currentOffers, type });
    });

    formComponent.setRollupClickHandler(() => {
      this.#closeEditForm();
    });

    replace(formComponent, eventComponent);

    this.#editForm = formComponent;
    this.#eventCard = eventComponent;

    document.addEventListener('keydown', this.#handleEscKeyDown);
  }


  // #openEditForm(eventComponent, editFormComponent) {
  //   if (this.#onModeChange) {
  //     this.#onModeChange();
  //   }
  //   replace(editFormComponent, eventComponent);
  //   this.#editForm = editFormComponent;
  //   this.#eventCard = eventComponent;
  //   document.addEventListener('keydown', this.#handleEscKeyDown);
  // }

  #closeEditForm() {
    if (!this.#editForm || !this.#eventCard) {
      return;
    }

    this.#editForm.resetForm();

    replace(this.#eventCard, this.#editForm);
    document.removeEventListener('keydown', this.#handleEscKeyDown);

    this.#editForm = null;
    this.#eventCard = null;
  }

  #handleEscKeyDown = (evt) => {
    if ((evt.key === 'Escape' || evt.key === 'Esc') && this.#editForm) {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };

  #handleModelEvent = (updateType, data) => {
    // if (updateType === 'update')
    console.log('[Presenter] handleModelEvent', updateType, data);
    if (updateType === UpdateType.PATCH) {
      this.updateEvent(data); // Теперь форма будет закрываться
    }
  };

  #clear() {
    this.#eventsContainer.innerHTML = '';
    this.#eventListComponent = new TripEventListView();
    this.#noPointsComponent = null;
    this.#eventPresenters.clear();
    this.#editForm = null;
    this.#eventCard = null;
  }


}
