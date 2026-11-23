
const assert = require("node:assert/strict");
const manager = require("./device-connection-manager");

console.log("Testing Device Connection Manager...");

// 1. Request smartphone connection
const phoneResult = manager.requestConnection(
  { type: "smartphone", model: "Test Phone" },
  "ast-spacemobile"
);

assert.equal(phoneResult.success, true);
assert.equal(phoneResult.connection.mode, "simulation");
assert.equal(phoneResult.connection.connectionMethod, "direct_device");

// 2. Request laptop connection
const laptopResult = manager.requestConnection(
  { type: "laptop", model: "Test Laptop" },
  "starlink-direct-to-cell"
);

assert.equal(laptopResult.success, true);
assert.equal(laptopResult.connection.deviceType, "laptop");

// 3. Battery efficiency preference
assert.equal(phoneResult.connection.batteryEfficient, true);

// 4. Retrieve connection
const saved = manager.getConnection(phoneResult.connection.id);
assert.equal(saved.status, "awaiting_provider_verification");

// 5. List connections
assert.equal(manager.getAllConnections().length, 2);

// 6. Disconnect
const disconnected = manager.disconnect(phoneResult.connection.id);
assert.equal(disconnected.connection.status, "disconnected");

// 7. Unknown connection
assert.equal(manager.getConnection("unknown-id"), null);

// 8. Invalid device
assert.throws(() =>
  manager.requestConnection(
    { type: "tablet", model: "Test Tablet" },
    "ast-spacemobile"
  )
);

console.log("All 8 device connection manager checks passed.");
             
