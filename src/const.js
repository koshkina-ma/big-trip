const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const NoPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { SortType, FilterType, NoPointsText };
