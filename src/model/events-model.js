import { enrichedEventItems } from '../mock/event-item.js';

export default class EventsModel {
  constructor() {
    this.events = enrichedEventItems;
  }

  getEvents() {
    return this.events;
  }
}

