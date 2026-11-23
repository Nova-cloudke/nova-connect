const assert = require("node:assert/strict");
const monitor = require("./connection-health-monitor");

console.log("Testing Connection Health Monitor...");

// 1. Register connection
const registered = monitor.registerConnection(
  "health-001",
  "ast-spacemobile"
);

assert.equal(registered.status, "awaiting_provider_confirmation");
assert.equal(registered.failureCount, 0);
assert.equal(registered.reconnectRequired, false);

// 2. Confirm provider
const confirmed = monitor.updateConnection(
  "health-001",
  "provider_confirmed"
);

assert.equal(confirmed.status, "provider_confirmed");
assert.ok(confirmed.lastConfirmedAt);

// 3. Start connecting
const connecting = monitor.updateConnection(
  "health-001",
  "connecting"
);

assert.equal(connecting.status, "connecting");

// 4. Mark connected
const connected = monitor.updateConnection(
  "health-001",
  "connected"
);

assert.equal(connected.status, "connected");
assert.equal(connected.reconnectRequired, false);

// 5. Record failure
const failed = monitor.updateConnection(
  "health-001",
  "failed"
);

assert.equal(failed.failureCount, 1);
assert.equal(failed.reconnectRequired, true);

// 6. Record disconnection
const disconnected = monitor.updateConnection(
  "health-001",
  "disconnected"
);

assert.equal(disconnected.failureCount, 2);
assert.equal(disconnected.reconnectRequired, true);

// 7. Retrieve health
assert.equal(
  monitor.getConnectionHealth("health-001").status,
  "disconnected"
);

// 8. Retrieve all
assert.equal(monitor.getAllConnectionHealth().length, 1);

// 9. Reject invalid status
assert.throws(() => {
  monitor.updateConnection("health-001", "unknown");
});

// 10. Reject unknown connection
assert.equal(monitor.getConnectionHealth("unknown"), null);

// 11. Remove connection
assert.equal(monitor.removeConnection("health-001"), true);
assert.equal(monitor.getConnectionHealth("health-001"), null);

console.log("All 11 connection health checks passed.");
