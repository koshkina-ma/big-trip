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

export {
  getFormattedDate,
  formatRouteTime,
  getRandomArrayElement
};
