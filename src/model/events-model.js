import Observable from '../framework/observable.js';
import { enrichedEventItems } from '../mock/event-item.js';
import { offers } from '../mock/offers.js';

export default class EventsModel extends Observable {
  #events;
  #offers;

  constructor() {
    super();
    this.#events = enrichedEventItems;
    this.#offers = offers;
  }

  getEvents() {
    return this.#events;
  }

  getOffersByType(type, selectedOfferIds = []) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    if (!offerGroup) {
      return [];
    }

    return offerGroup.offers.map((offer) => ({
      ...offer,
      isChecked: selectedOfferIds.includes(offer.id) // Добавляем флаг выбора
    }));
  }


  //чтобы записывать точки маршрута (заменять или обновлять массив).
  setEvents(events){
    this.#events = [...events];
    this._notify('eventsUpdated', this.#events);
  }

  //чтобы обновить конкретную точку по id.
  updateEvent(updatedEvent) {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      throw new Error('Event not found');
    }

    // Сбрасываем офферы, если изменился тип точки
    if (this.#events[index].type !== updatedEvent.type) {
      updatedEvent.offers = [];
    }

    this.#events[index] = updatedEvent;
    this._notify('eventUpdated', updatedEvent);
  }

}

//Добавьте в модель для точек маршрута 2 метода: один для получения точек маршрута, другой для их записи,
//Добавьте ещё один метод для обновления конкретной точки маршрута.
// и в каждом методе - нотификация подписчиков
//7.3 Доработает модель и датабиндинг. WIP 13.00 и ранее
