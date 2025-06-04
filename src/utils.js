import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);

const DATE_FORMAT = 'MMM DD';

function getFormattedDate(date) {
  return dayjs(date).format(DATE_FORMAT).toUpperCase();
}

function formatRouteTime(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const timeRange = `${start.format('HH:mm')} — ${end.format('HH:mm')}`;
  const diff = dayjs.duration(end.diff(start));

  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();

  let durationStr = '';

  if (days > 0) {
    durationStr = `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else if (hours > 0) {
    durationStr = `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    durationStr = `${minutes}M`;
  }

  return { timeRange, duration: durationStr };
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatTripTitle(points) {
  const cities = points.map((point) => point.destination.name);

  if (cities.length <= 3) {
    return cities.join(' — ');
  }

  return `${cities[0]} — ... — ${cities[cities.length - 1]}`;
}

function formatTripDates(points) {
  if (!points.length) {
    return '';
  }

  const startDate = dayjs(points[0].dateFrom);
  const endDate = dayjs(points[points.length - 1].dateTo);

  const sameMonth = startDate.month() === endDate.month();

  const startFormat = 'MMM D';
  const endFormat = sameMonth ? 'D' : 'MMM D';

  return `${startDate.format(startFormat)} — ${endDate.format(endFormat)}`;
}

function calculateTotalCost(points) {
  return points.reduce((total, point) => {
    const offersTotal = point.offers.reduce((sum, offer) => sum + offer.price, 0);
    return total + point.basePrice + offersTotal;
  }, 0);
}


export {
  getFormattedDate,
  formatRouteTime,
  getRandomArrayElement,
  formatTripTitle,
  formatTripDates,
  calculateTotalCost,
};
