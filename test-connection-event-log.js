const assert = require("node:assert/strict");
const log = require("./connection-event-log");

console.log("Testing Connection Event Log...");

// 1. Start clean
log.clearEvents();

// 2. Record connection creation
const created = log.recordEvent(
  "connection-001",
  "connection_created",
  { providerId: "ast-spacemobile" }
);

assert.equal(created.eventType, "connection_created");
assert.equal(created.connectionId, "connection-001");

// 3. Record provider confirmation
log.recordEvent(
  "connection-001",
  "provider_confirmed",
  { source: "prototype_test" }
);

// 4. Record connection attempt
log.recordEvent(
  "connection-001",
  "connection_started"
);

// 5. Record failure
log.recordEvent(
  "connection-002",
  "connection_failed",
  { reason: "Provider unavailable" }
);

// 6. Record disconnection
log.recordEvent(
  "connection-001",
  "connection_disconnected"
);

// 7. Retrieve events for one connection
const connectionEvents = log.getConnectionEvents("connection-001");

assert.equal(connectionEvents.length, 4);
assert.equal(
  connectionEvents[0].eventType,
  "connection_created"
);

// 8. Retrieve all events
assert.equal(log.getAllEvents().length, 5);

// 9. Reject invalid event type
assert.throws(() => {
  log.recordEvent("connection-001", "unknown_event");
});

// 10. Reject missing connection ID
assert.throws(() => {
  log.recordEvent("", "connection_created");
});

// 11. Clear event log
const cleared = log.clearEvents();

assert.equal(cleared.success, true);
assert.equal(log.getAllEvents().length, 0);

console.log("All 11 connection event log checks passed.");
