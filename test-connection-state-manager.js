const assert = require("node:assert/strict");
const manager = require("./connection-state-manager");

console.log("Testing Connection State Manager...");

// 1. Create connection
const created = manager.createConnection(
  "test-connection-001",
  "ast-spacemobile"
);

assert.equal(created.state, manager.STATES.AWAITING);

// 2. Prevent connection before confirmation
assert.throws(() => {
  manager.startConnecting("test-connection-001");
});

// 3. Reject simulated provider confirmation
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

// 4. Create a fresh connection
manager.createConnection(
  "test-connection-002",
  "ast-spacemobile"
);

// 5. Accept valid provider confirmation
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

// 6. Move to connecting
const connecting = manager.startConnecting("test-connection-002");
assert.equal(connecting.state, manager.STATES.CONNECTING);

// 7. Move to connected
const connected = manager.markConnected("test-connection-002");
assert.equal(connected.state, manager.STATES.CONNECTED);

// 8. Disconnect
const disconnected = manager.disconnect("test-connection-002");
assert.equal(disconnected.state, manager.STATES.DISCONNECTED);

// 9. Retrieve connection
assert.equal(
  manager.getConnection("test-connection-002").state,
  manager.STATES.DISCONNECTED
);

// 10. Reject unknown connection
assert.equal(manager.getConnection("unknown"), null);

assert.throws(() => {
  manager.createConnection("", "ast-spacemobile");
});

console.log("All 11 connection state manager checks passed.");
