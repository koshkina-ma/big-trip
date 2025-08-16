import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class EventsApiService extends ApiService {

  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addEvent(event) {
    console.log('[EventsApiService.addEvent] sending:', event);
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    console.log('[EventsApiService.addEvent] received:', parsedResponse);

    return parsedResponse;
  }

  async deleteEvent(id) {
    console.log('[EventsApiService.deleteEvent] sending id:', id);
    const response = await this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });

    console.log('[EventsApiService.deleteEvent] response status:', response.status);
    return response;
  }

  #adaptToServer(event) {

    if (!event.dateFrom || !event.dateTo) {
      throw new Error('Missing required date fields');
    }
    if (!event.destination?.id) {
      throw new Error('Destination ID is required');
    }

    const adaptedEvent = {
      'base_price': Math.max(1, Number(event.basePrice)),
      'date_from': event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
      'date_to': event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
      'destination': String(event.destination.id),
      'is_favorite': Boolean(event.isFavorite),
      'offers': event.offers?.map((offer) => String(offer.id)) || [],
      'type': String(event.type),
    };

    if (event.dateTo <= event.dateFrom) {
      adaptedEvent['date_to'] = new Date(event.dateFrom.getTime() + 60 * 1000).toISOString();
    }

    console.log('[AdaptToServer] Input:', event);
    console.log('[AdaptToServer] Output:', adaptedEvent);

    return adaptedEvent;
  }
}

//https://21.objects.htmlacademy.pro/big-trip
