import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventsApiService extends ApiService {
  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`, //это часть урла? должно быть points или events
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(event) { //TODO проверить, что нужно менять в моем ответе от сервера, заменить task на event

    const adaptedTask = {...task,
      'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
      'is_archived': task.isArchive,
      'is_favorite': task.isFavorite,
      'repeating_days': task.repeating,
    };

    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }

}

//https://21.objects.htmlacademy.pro/big-trip
