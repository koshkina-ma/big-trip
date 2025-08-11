import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      if (!Array.isArray(destinations)) {
        throw new Error('Destinations is not an array');
      }
      this.#destinations = destinations;
      console.log('Загружены направления в модели:', this.#destinations);
    } catch (err) {
      console.error('Ошибка загрузки направлений:', err);
      this.#destinations = [];
    }
  }

  getDestinations() {
    return [...this.#destinations];
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id) || null;
  }

  getDestinationByName(name) {
    return this.#destinations.find((dest) => dest.name === name) || null;
  }

}
