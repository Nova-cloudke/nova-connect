const assert = require("node:assert/strict");
const manager = require("./device-connection-manager");

console.log("Testing Battery-Aware Device Connection Manager...");

const phoneResult = manager.requestConnection(
  { type: "smartphone", model: "Test Phone" },
  "ast-spacemobile"
);

assert.equal(phoneResult.success, true);
assert.equal(phoneResult.connection.mode, "simulation");
assert.equal(phoneResult.connection.connectionMethod, "alternative_connection_required");
assert.equal(phoneResult.connection.phoneHotspotRequired, false);
assert.equal(phoneResult.connection.batteryPolicy, "protect_phone_battery");

const laptopResult = manager.requestConnection(
  { type: "laptop", model: "Test Laptop" },
  "starlink-direct-to-cell"
);

assert.equal(laptopResult.connection.deviceType, "laptop");
assert.equal(laptopResult.connection.phoneHotspotRequired, false);

const fallback = manager.requestConnection(
  { type: "laptop", model: "Test Laptop" },
  "starlink-direct-to-cell",
  { allowPhoneHotspot: true, phoneBatteryPercent: 80 }
);

assert.equal(fallback.connection.connectionMethod, "phone_hotspot");
assert.equal(fallback.connection.phoneHotspotRequired, true);

const low = manager.requestConnection(
  { type: "laptop", model: "Test Laptop" },
  "starlink-direct-to-cell",
  { allowPhoneHotspot: true, phoneBatteryPercent: 20 }
);

assert.equal(low.connection.connectionMethod, "alternative_connection_required");

const saved = manager.getConnection(phoneResult.connection.id);
assert.equal(saved.status, "awaiting_provider_verification");
assert.equal(manager.getAllConnections().length, 4);

const disconnected = manager.disconnect(phoneResult.connection.id);
assert.equal(disconnected.connection.status, "disconnected");
assert.equal(manager.getConnection("unknown-id"), null);

assert.throws(() =>
  manager.requestConnection(
    { type: "tablet", model: "Test Tablet" },
    "ast-spacemobile"
  )
);

console.log("All 9 integrated connection manager checks passed.");
