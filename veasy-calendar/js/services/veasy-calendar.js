angular.module('veasy.calendar').factory('vCalendarService', function ($compile) {
  const buildCalendar = function (config, events) {
    const date = config.date || moment().startOf('day');
    return {
      date,
      title: date.format('MMMM YYYY'),
      year: date.year(),
      month: date.month(),
      // weekDays: moment.weekdays(),
      weekDays: moment.weekdaysShort(),
      // weekDays: moment.weekdaysMin(),
      weeks: buildMonth(date, events, date.clone().month()),
      events
    };
  };

  const buildMonth = function (date, events, currentMonth) {
    const weeks = [];
    const startDate = date.clone().startOf('month');
    const totalWeeks = 6;
    let currentWeek = 1;
    while (currentWeek <= totalWeeks) {
      weeks.push(buildWeek(startDate, events, currentMonth));
      currentWeek++;
    };
    return weeks;
  };

  const buildWeek = function (date, events, currentMonth) {
    const days = [];
    date.day(0);
    let dayOfWeek = date.day();
    do {
      days.push(buildDay(date.clone(), events, currentMonth));
      date.add(1, 'days')
      dayOfWeek++;
    } while (dayOfWeek < 7);
    return days;
  };

  const buildDay = function (date, events, currentMonth) {
    return {
      date,
      day: date.format('DD'),
      month: date.format('MM'),
      year: date.format('YYYY'),
      events: fetchDayEvents(date, events),
      isCurrentMonth: date.month() === currentMonth,
      isWeekend: date.day() === 0 || date.day() === 6,
      isToday: date.isSame(moment().startOf('day'))
    };
  };

  const fetchDayEvents = function (date, allEvents) {
    const year = date.year();
    const month = date.month();
    const day = date.date();
    if (allEvents[year]) {
      if (allEvents[year][month]) {
        return (allEvents[year][month][day] || []).sort((a, b) => moment(a.date).isSameOrBefore(b.date) ? -1 : 1);
      }
    }
    return [];
  };

  const catalogEvents = function (events) {
    const parsedEvents = {};
    for (const event of events) {
      const year = moment(event.date).year();
      const month = moment(event.date).month();
      const day = moment(event.date).date();
      parsedEvents[year] = parsedEvents[year] || {};
      parsedEvents[year][month] = parsedEvents[year][month] || {};
      parsedEvents[year][month][day] = parsedEvents[year][month][day] || [];
      parsedEvents[year][month][day].push(event);
    }
    return parsedEvents;
  };

  return { buildCalendar, catalogEvents };
});