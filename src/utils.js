import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DATE_FORMAT = 'MMM DD';
function getFormattedDate(date) {
  return dayjs(date).format(DATE_FORMAT).toUpperCase();
}

function formatRouteTime(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const timeRange = `${start.format('HH:mm')} — ${end.format('HH:mm')}`;

  const diff = dayjs.duration(end.diff(start));

  const totalMinutes = diff.asMinutes();

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();

  let durationStr = '';

  if (totalMinutes < 60) {
    // Менее часа — только минуты
    durationStr = `${minutes}M`;
  } else if (totalMinutes < 1440) {
    // Менее суток — часы и минуты
    durationStr = `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    // Более суток — дни, часы и минуты
    durationStr = `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
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
