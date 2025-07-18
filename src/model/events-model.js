import Observable from '../framework/observable.js';
import { enrichedEventItems } from '../mock/event-item.js';
import { offers } from '../mock/offers.js';
import { FilterType, UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #events;
  #offers;

  constructor() {
    super();
    this.#events = enrichedEventItems;
    this.#offers = offers;
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

  #getFutureEvents() {
    const now = new Date();
    return this.#events.filter((event) => new Date(event.dateFrom) > now);
  }

  #getPresentEvents() {
    const now = new Date();
    return this.#events.filter((event) => {
      const start = new Date(event.dateFrom);
      const end = new Date(event.dateTo);
      return start <= now && now <= end;
    });
  }

  #getPastEvents() {
    const now = new Date();
    return this.#events.filter((event) => new Date(event.dateTo) < now);
  }

  // Методы для работы с офферами
  getOffersByType(type, selectedOfferIds = []) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    return offerGroup?.offers.map((offer) => ({
      ...offer,
      isChecked: selectedOfferIds.includes(offer.id)
    })) || [];
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
    this._notify(UpdateType.PATCH, updatedEvent);
  }

  add(event) {
    this.#events = [...this.#events, event];
    this._notify(UpdateType.MINOR, event);
  }

  delete(id) {
    this.#events = this.#events.filter((event) => event.id !== id);
    this._notify(UpdateType.MINOR, id);
  }

  findById(id) {
    return this.#events.find((event) => event.id === id);
  }

  set(events) {
    this.#events = [...events];
    this._notify(UpdateType.MAJOR, this.#events); // Для полной перезагрузки данных
  }

}
