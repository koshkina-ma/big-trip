import Observable from '../framework/observable.js';
import { enrichedEventItems } from '../mock/event-item.js';
import { offers } from '../mock/offers.js';
import { destinations } from '../mock/destinations.js';
import { FilterType, UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #events;
  #offers;
  #destinations;
  #eventsApiService = null;

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;

    this.#eventsApiService.events.then((events) => {
      console.log(events.map((event) => this.#adaptToClient(event)));
    });

    this.#events = enrichedEventItems;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  // Основной метод с поддержкой фильтрации
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

  getDestinations() {
    return [...this.#destinations];
  }

  getDestinationByName(name) {
    return this.#destinations.find((dest) => dest.name === name);
  }


  #getFutureEvents() {
    const now = new Date();
    return this.#events.filter((event) => {
      const start = new Date(event.dateFrom);
      return start > now; // Строго в будущем
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


  getOffersByType(type, selectedOfferIds = []) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    if (!offerGroup) {
      return []; // Если нет офферов для типа
    }

    return offerGroup.offers.map((offer) => ({
      ...offer,
      isChecked: selectedOfferIds.includes(offer.id) // Помечаем выбранные
    }));
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
    if (!id || typeof id !== 'string') { // Жёсткая проверка
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
    this._notify(UpdateType.MAJOR, this.#events); // Для полной перезагрузки данных
  }

  #adaptToClient(serverEvent) {
      console.log('--- Adapt start ---');
  console.log('Raw serverEvent:', serverEvent);

    if (!serverEvent || typeof serverEvent !== 'object') {
      throw new Error('Invalid server event data');
    }

      // Проверка цены
  console.log('base_price:', serverEvent.base_price);

  // Проверка дат
  console.log('date_from:', serverEvent.date_from);
  console.log('date_to:', serverEvent.date_to);

  // Проверка favorite
  console.log('is_favorite:', serverEvent.is_favorite);

  // Проверка destination
  console.log('destination id from server:', serverEvent.destination);
  console.log('matched destination object:',
    this.#destinations.find((dest) => dest.id === serverEvent.destination)
  );

  // Проверка offers
  console.log('offers array from server:', serverEvent.offers);

    const adaptedEvent = {
      ...serverEvent,
      // Преобразование полей сервера → клиента
      basePrice: serverEvent['base_price'],
      dateFrom: new Date(serverEvent['date_from']),
      dateTo: new Date(serverEvent['date_to']),
      isFavorite: serverEvent['is_favorite'],
      // Восстанавливаем полный объект destination
      destination: this.#destinations.find((dest) => dest.id === serverEvent.destination) || null,
      // Восстанавливаем полные объекты offers
      offers: this.getOffersByType(
        serverEvent.type,
        serverEvent.offers || []
      ).filter((offer) => offer.isChecked)
    };

    // Удаляем серверные поля (опционально)
    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

console.log('--- Adapted event ---', adaptedEvent);

    return adaptedEvent;
  }

}
