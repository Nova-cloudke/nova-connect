const assert = require("node:assert/strict");
const manager = require("./connection-state-manager");
const eventLog = require("./connection-event-log");

console.log("Testing Integrated Connection State Manager...");

eventLog.clearEvents();

// 1. Create connection
const created = manager.createConnection(
  "test-connection-001",
  "ast-spacemobile"
);

assert.equal(created.state, manager.STATES.AWAITING);

// 2. Confirm creation event
assert.equal(
  eventLog.getConnectionEvents("test-connection-001")[0].eventType,
  "connection_created"
);

// 3. Prevent connecting before confirmation
assert.throws(() => {
  manager.startConnecting("test-connection-001");
});

// 4. Reject simulated confirmation
const rejected = manager.confirmConnection(
  "test-connection-001",
  {
    providerId: "ast-spacemobile",
    connectionId: "test-connection-001",
    status: "connected",
    confirmationSource: "live_provider",
    confirmedAt: new Date().toISOString(),
    simulation: true
  }
);

assert.equal(rejected.success, false);
assert.equal(rejected.connection.state, manager.STATES.FAILED);

// 5. Create fresh connection
manager.createConnection(
  "test-connection-002",
  "ast-spacemobile"
);

// 6. Confirm provider response
const confirmation = manager.confirmConnection(
  "test-connection-002",
  {
    providerId: "ast-spacemobile",
    connectionId: "test-connection-002",
    status: "connected",
    confirmationSource: "live_provider",
    confirmedAt: new Date().toISOString()
  }
);

assert.equal(confirmation.success, true);
assert.equal(confirmation.connection.state, manager.STATES.CONFIRMED);

// 7. Start connection
assert.equal(
  manager.startConnecting("test-connection-002").state,
  manager.STATES.CONNECTING
);

// 8. Mark connected
assert.equal(
  manager.markConnected("test-connection-002").state,
  manager.STATES.CONNECTED
);

// 9. Disconnect
assert.equal(
  manager.disconnect("test-connection-002").state,
  manager.STATES.DISCONNECTED
);

// 10. Check recorded lifecycle events
const events = eventLog.getConnectionEvents("test-connection-002");

assert.deepEqual(
  events.map(event => event.eventType),
  [
    "connection_created",
    "provider_confirmation_received",
    "provider_confirmed",
    "connection_started",
    "connection_established",
    "connection_disconnected"
  ]
);

// 11. Check retrieval
assert.equal(
  manager.getConnection("test-connection-002").state,
  manager.STATES.DISCONNECTED
);

assert.equal(manager.getConnection("unknown"), null);

console.log("All 11 integrated connection checks passed.");
