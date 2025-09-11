import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);

const ROUTE_DATE_FORMAT = 'MMM DD';
const HEADER_DATE_FORMAT = 'DD MMM';
const EDIT_POINT_DATE_FORMAT = 'DD/MM/YY HH:mm';

function getFormattedDate(date) {
  return dayjs(date).format(ROUTE_DATE_FORMAT).toUpperCase();
}

function getEditPointFormattedDate(date) {
  return dayjs(date).format(EDIT_POINT_DATE_FORMAT);
}

function getHeaderFormattedDate(date) {
  return dayjs(date).format(HEADER_DATE_FORMAT).toUpperCase();
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

// function formatTripTitle(points) {
//   const cities = points.map((point) => point.destination.name);

//   if (cities.length <= 3) {
//     return cities.join(' — ');
//   }

//   return `${cities[0]} — ... — ${cities[cities.length - 1]}`;
// }

function formatTripTitle(points) {
  const cities = points
    .map((point) => point.destination?.name || '') // Защита от undefined
    .filter((name) => name !== ''); // Фильтруем пустые значения

  if (!cities.length) {
    return '';
  } // Если нет городов

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
    const basePrice = point.basePrice || 0;
    const offersTotal = point.offers?.reduce((sum, offer) => sum + (offer.price || 0), 0) || 0;
    return total + basePrice + offersTotal;
  }, 0);
}


export {
  getFormattedDate,
  getHeaderFormattedDate,
  getEditPointFormattedDate,
  formatRouteTime,
  formatTripTitle,
  formatTripDates,
  calculateTotalCost,
};
