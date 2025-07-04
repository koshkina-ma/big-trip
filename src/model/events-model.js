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
}

//добавить обновление точки, добавление, удаление и в каждом методе - нотификация подписчиков
//7.3 Доработает модель и датабиндинг. WIP 13.00 и ранее
