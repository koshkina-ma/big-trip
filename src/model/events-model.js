import Observable from '../framework/observable.js';
import { enrichedEventItems } from '../mock/event-item.js';

export default class EventsModel extends Observable {

  constructor() {
    super();
    this.events = enrichedEventItems;
  }

  getEvents() {
    return this.events;
  }

  //чтобы записывать точки маршрута (заменять или обновлять массив).
  setEvents(events){
    this.events = [...events];
    this._notify('eventsUpdated', this.events);
  }

  //чтобы обновить конкретную точку по id.
  updateEvent(updatedEvent){
    const index = this.events.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      throw new Error('Event not found');
    }
    this.events[index] = updatedEvent;
    this._notify('eventUpdated', updatedEvent);
  }

}

//Добавьте в модель для точек маршрута 2 метода: один для получения точек маршрута, другой для их записи,
//Добавьте ещё один метод для обновления конкретной точки маршрута.
// и в каждом методе - нотификация подписчиков
//7.3 Доработает модель и датабиндинг. WIP 13.00 и ранее
