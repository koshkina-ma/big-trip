import Observable from '../framework/observable.js';
import { FilterType, UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #destinationsModel = null;
  #offersModel = null;
  #events = [];
  #isLoading = true;

  constructor({ eventsApiService, destinationsModel, offersModel }) {
    super();
    this.#eventsApiService = eventsApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get isLoading() {
    return this.#isLoading;
  }

  getEvents(filterType = FilterType.EVERYTHING) {
    switch (filterType) {
      case FilterType.FUTURE:
        return this.#getFutureEvents();
      case FilterType.PRESENT:
        return this.#getPresentEvents();
      case FilterType.PAST:
        return this.#getPastEvents();
      default:
        return [...this.#events];
    }
  }

  async init() {
    this.#isLoading = true;

    try {
      await this.#destinationsModel.init();
      await this.#offersModel.init();

      const events = await this.#eventsApiService.events;
      this.#events = events.map((event) => this.#adaptToClient(event));

      this.#isLoading = false;

      console.log('Loaded destinations:', this.#destinationsModel.getDestinations());
      console.log('Loaded offers:', this.#offersModel.offers);
      console.log('Loaded events:', this.#events);

      this._notify(UpdateType.INIT);
    } catch (error) {
      this.#events = [];
      this.#isLoading = false;
      this._notify(UpdateType.INIT);
    }
  }

  update(updatedEvent) {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      throw new Error('Event not found');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      updatedEvent,
      ...this.#events.slice(index + 1)
    ];
    this._notify(UpdateType.MINOR, updatedEvent);
  }

  add(event) {
    this.#events = [...this.#events, event];
    this._notify(UpdateType.MINOR, event);
  }

  delete(id) {
    if (!id || typeof id !== 'string') {
      return;
    }
    this.#events = this.#events.filter((event) => event.id !== id);
    this._notify(UpdateType.MINOR);
  }

  findById(id) {
    return this.#events.find((event) => event.id === id);
  }

  set(events) {
    this.#events = [...events];
    this._notify(UpdateType.MAJOR, this.#events);
  }


  #getFutureEvents() {
    const now = new Date();
    return this.#events.filter((event) => {
      const start = new Date(event.dateFrom);
      return start > now;
    });
  }

  #getPresentEvents() {
    const now = new Date();
    return this.#events.filter((event) => {
      const start = new Date(event.dateFrom);
      const end = new Date(event.dateTo);
      return start <= now && end >= now;
    });
  }

  #getPastEvents() {
    const now = new Date();
    return this.#events.filter((event) => new Date(event.dateTo) < now);
  }

  getOffersByType(type, selectedOfferIds) {
    return this.#offersModel.getOffersByType(type, selectedOfferIds);
  }

  getDestinations() {
    return this.#destinationsModel.getDestinations();
  }

  getDestinationById(id) {
    return this.#destinationsModel.getDestinationById(id);
  }

  getDestinationByName(name) {
    return this.#destinationsModel.getDestinationByName(name);
  }


  #adaptToClient(serverEvent) {
    if (!serverEvent || typeof serverEvent !== 'object') {
      throw new Error('Invalid server event data');
    }

    const destination = this.#destinationsModel.getDestinationById(serverEvent.destination) || null;

    const offers = this.#offersModel.getOffersByType(
      serverEvent.type,
      serverEvent.offers || []
    ).filter((offer) => offer.isChecked);

    const adaptedEvent = {
      ...serverEvent,
      basePrice: serverEvent['base_price'],
      dateFrom: new Date(serverEvent['date_from']),
      dateTo: new Date(serverEvent['date_to']),
      isFavorite: serverEvent['is_favorite'],
      destination,
      offers
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

}
