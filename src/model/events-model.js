import Observable from '../framework/observable.js';
import { enrichedEventItems } from '../mock/event-item.js';
import { offers } from '../mock/offers.js';

export default class EventsModel extends Observable {
  #events;
  #offers;

  constructor() {
    super();
    this.#events = enrichedEventItems;
    console.log('Initial events:', this.#events.map((e) => e.id));
    this.#offers = offers;
  }

  // Read (получение всех точек)
  getEvents() {
    return this.#events;
  }

  // Read (получение офферов по типу)
  getOffersByType(type, selectedOfferIds = []) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    if (!offerGroup) {
      return [];
    }
    return offerGroup.offers.map((offer) => ({
      ...offer,
      // Правильно выставляем флаг выбранности
      isChecked: selectedOfferIds.includes(offer.id)
    }));
  }


  set(events) {
    this.#events = [...events];
    this._notify('set', this.#events); // Для полной перезагрузки данных
  }

  add(event) {
    this.#events = [...this.#events, event];
    this._notify('add', event); // Для добавления одной точки
  }


  update(updatedEvent) {
    if (!updatedEvent?.id) {
      throw new Error('Cannot update event without ID');
    }

    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);

    if (index === -1) {
      throw new Error('Event not found');
    }

    // Сброс офферов при смене типа
    if (this.#events[index].type !== updatedEvent.type) {
      updatedEvent.offers = [];
    }

    this.#events = [
      ...this.#events.slice(0, index),
      updatedEvent,
      ...this.#events.slice(index + 1)
    ];

    console.log('MODEL UPDATING EVENT');

    this._notify('update', updatedEvent);
  }

  delete(id) {
    this.#events = this.#events.filter((event) => event.id !== id);
    this._notify('delete', id);
  }

  // === Утилиты ===
  findById(id) {
    return this.#events.find((event) => event.id === id);
  }

}
