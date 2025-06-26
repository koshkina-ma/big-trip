const filter = {
  everything: (events) => events,
  future: (events) => events.filter((event) => new Date(event.dateFrom) > new Date()),
  present: (events) => events.filter((event) =>
    new Date(event.dateFrom) <= new Date() && new Date(event.dateTo) >= new Date()
  ),
  past: (events) => events.filter((event) => new Date(event.dateTo) < new Date())
};

export {filter};
