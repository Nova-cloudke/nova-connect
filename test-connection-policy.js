
const assert = require("node:assert/strict");
const policy = require("./connection-policy");

console.log("Testing Battery-Aware Connection Policy...");

// 1. Direct satellite compatibility
const direct = policy.selectConnectionMethod({
  deviceType: "laptop",
  directSatelliteCompatibility: "confirmed",
  providerDeviceSupport: "confirmed"
});

assert.equal(direct.method, "direct_satellite");
assert.equal(direct.phoneHotspotRequired, false);

// 2. Unverified compatibility
const unknown = policy.selectConnectionMethod({
  deviceType: "smartphone",
  directSatelliteCompatibility: "unknown",
  providerDeviceSupport: "unverified"
});

assert.equal(
  unknown.method,
  "alternative_connection_required"
);

// 3. Hotspot not allowed by default
assert.equal(unknown.phoneHotspotRequired, false);

// 4. Explicit hotspot permission
const fallback = policy.selectConnectionMethod(
  {
    deviceType: "laptop",
    directSatelliteCompatibility: "unknown",
    providerDeviceSupport: "unverified"
  },
  {
    allowPhoneHotspot: true,
    phoneBatteryPercent: 80
  }
);

assert.equal(fallback.method, "phone_hotspot");
assert.equal(fallback.decision, "user_authorized_fallback");

// 5. Low battery blocks hotspot
const lowBattery = policy.selectConnectionMethod(
  {
    deviceType: "laptop",
    directSatelliteCompatibility: "unknown",
    providerDeviceSupport: "unverified"
  },
  {
    allowPhoneHotspot: true,
    phoneBatteryPercent: 20
  }
);

assert.equal(
  lowBattery.method,
  "alternative_connection_required"
);

// 6. Connection priorities
assert.deepEqual(
  policy.getConnectionPriorities(),
  [
    "direct_satellite",
    "other_direct_device_connection",
    "user_authorized_phone_hotspot"
  ]
);

// 7. Invalid assessment
assert.throws(() =>
  policy.selectConnectionMethod(null)
);

console.log("All 7 connection policy checks passed.");
  
