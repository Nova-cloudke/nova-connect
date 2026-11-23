
const assert = require("node:assert/strict");
const compatibility = require("./device-compatibility");

console.log("Testing Device Compatibility...");

// 1. Smartphone assessment
const phone = compatibility.assessDevice(
  { type: "smartphone", model: "Test Phone" },
  "ast-spacemobile"
);

assert.equal(phone.deviceType, "smartphone");
assert.equal(phone.directSatelliteCompatibility, "unknown");
assert.equal(phone.providerDeviceSupport, "unverified");

// 2. Laptop assessment
const laptop = compatibility.assessDevice(
  { type: "laptop", model: "Test Laptop" },
  "starlink-direct-to-cell"
);

assert.equal(laptop.deviceType, "laptop");
assert.equal(laptop.directSatelliteCompatibility, "unknown");
assert.equal(laptop.providerDeviceSupport, "unverified");

// 3. Direct connectivity priority
assert.equal(
  laptop.connectionPriority,
  "direct_device_connectivity"
);

// 4. Unknown provider
assert.throws(() =>
  compatibility.assessDevice(
    { type: "smartphone", model: "Test Phone" },
    "unknown-provider"
  )
);

// 5. Missing device information
assert.throws(() =>
  compatibility.assessDevice(
    { type: "smartphone" },
    "ast-spacemobile"
  )
);

// 6. Unsupported device type
assert.throws(() =>
  compatibility.assessDevice(
    { type: "tablet", model: "Test Tablet" },
    "ast-spacemobile"
  )
);

console.log("All 6 device compatibility checks passed.");
