const assert = require("node:assert/strict");
const orchestrator = require("./connection-orchestrator");

console.log("Testing Connection Orchestrator Integration...");

// 1. Reject missing device
assert.throws(() => orchestrator.requestConnection(null));

// 2. Reject incomplete device
assert.throws(() => orchestrator.requestConnection({}));

// 3. Request smartphone connection
const phone = orchestrator.requestConnection({
  type: "smartphone",
  model: "Test Phone"
});

assert.equal(phone.success, false);
assert.equal(phone.status, "provider_unavailable");

// 4. Request laptop connection
const laptop = orchestrator.requestConnection({
  type: "laptop",
  model: "Test Laptop"
});

assert.equal(laptop.success, false);
assert.equal(laptop.status, "provider_unavailable");

// 5. Ensure no false connection is reported
assert.equal(phone.connection, undefined);
assert.equal(laptop.connection, undefined);

// 6. Ensure no connection ID is returned
assert.equal(phone.connectionId, undefined);
assert.equal(laptop.connectionId, undefined);

console.log("All 6 orchestrator integration checks passed.");
