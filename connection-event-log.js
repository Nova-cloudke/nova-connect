const events = [];

const ALLOWED_EVENTS = [
  "connection_created",
  "provider_confirmation_received",
  "provider_confirmed",
  "connection_started",
  "connection_established",
  "connection_failed",
  "connection_disconnected"
];

function recordEvent(connectionId, eventType, details = {}) {
  if (!connectionId) {
    throw new Error("Connection ID is required");
  }

  if (!ALLOWED_EVENTS.includes(eventType)) {
    throw new Error("Invalid connection event type");
  }

  const event = {
    id: "event-" + (events.length + 1),
    connectionId,
    eventType,
    details: { ...details },
    timestamp: new Date().toISOString()
  };

  events.push(event);

  return { ...event, details: { ...event.details } };
}

function getConnectionEvents(connectionId) {
  return events
    .filter(event => event.connectionId === connectionId)
    .map(event => ({
      ...event,
      details: { ...event.details }
    }));
}

function getAllEvents() {
  return events.map(event => ({
    ...event,
    details: { ...event.details }
  }));
}

function clearEvents() {
  events.length = 0;
  return { success: true };
}

module.exports = {
  ALLOWED_EVENTS,
  recordEvent,
  getConnectionEvents,
  getAllEvents,
  clearEvents
};
