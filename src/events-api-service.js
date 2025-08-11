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

  #adaptToServer(event) {

    if (!event.dateFrom || !event.dateTo) {
      throw new Error('Missing required date fields');
    }
    if (!event.destination?.id) {
      throw new Error('Destination ID is required');
    }

    const adaptedEvent = {
      ...event,
      'base_price': Number(event.basePrice),
      'date_from': event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
      'date_to': event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
      'destination': event.destination?.id || '',
      'offers': event.offers?.map((offer) => offer.id) || [],
      'is_favorite': event.isFavorite || false,
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    console.log('[AdaptToServer] Input:', event);
    console.log('[AdaptToServer] Output:', adaptedEvent);

    return adaptedEvent;
  }

}

//https://21.objects.htmlacademy.pro/big-trip
