import {getRandomArrayElement} from '../utils/common.js';
import { offers } from './offers.js';
import { destinations } from './destinations.js';

const mockEventItems = [
  {
    id: 'event-1',
    basePrice: 1100,
    dateFrom: '2025-06-10T22:55:56.845Z',
    dateTo: '2025-06-11T11:22:13.375Z',
    destination: 'dest-1',
    isFavorite: false,
    offers: ['offer-1', 'offer-3'],
    type: 'taxi',
  },
  {
    id: 'event-2',
    basePrice: 980,
    dateFrom: '2025-06-25T09:15:00.000Z',
    dateTo: '2025-06-25T12:45:00.000Z',
    destination: 'dest-2',
    isFavorite: true,
    offers: ['offer-2', 'offer-4', 'offer-5'],
    type: 'bus',
  },
  {
    id: 'event-3',
    basePrice: 2100,
    dateFrom: '2025-08-15T08:00:00.000Z',
    dateTo: '2025-08-15T10:30:00.000Z',
    destination: 'dest-3',
    isFavorite: false,
    offers: ['offer-1', 'offer-6'],
    type: 'flight',
  },
  {
    id: 'event-4',
    basePrice: 750,
    dateFrom: '2025-09-18T15:20:00.000Z',
    dateTo: '2025-09-18T16:00:00.000Z',
    destination: 'dest-4',
    isFavorite: true,
    offers: ['offer-7', 'offer-2'],
    type: 'restaurant',
  },
  {
    id: 'event-5',
    basePrice: 1290,
    dateFrom: '2025-09-20T13:00:00.000Z',
    dateTo: '2025-09-20T16:00:00.000Z',
    destination: 'dest-5',
    isFavorite: false,
    offers: ['offer-3', 'offer-4'],
    type: 'sightseeing',
  },
];

const offersMap = new Map(offers.map((o) => [o.id, o]));
const destinationsMap = new Map(destinations.map((d) => [d.id, d]));

const enrichedEventItems = mockEventItems.map((event) => ({
  ...event,
  destination: destinationsMap.get(event.destination),
  offers: event.offers.map((id) => offersMap.get(id)).filter(Boolean),
}));

function getEventItem() {
  return getRandomArrayElement(enrichedEventItems);
}

export {getEventItem, enrichedEventItems};
