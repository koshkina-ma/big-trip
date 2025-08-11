import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return [...this.#offers];
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = [...offers];
      this._notify(UpdateType.MINOR);
    } catch (error) {
      this.#offers = [];
      this._notify(UpdateType.MINOR);
    }
  }

  getOffersByType(type, selectedOfferIds = []) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    if (!offerGroup) {
      return [];
    }

    return offerGroup.offers.map((offer) => ({
      ...offer,
      isChecked: selectedOfferIds.includes(offer.id)
    }));
  }

}
