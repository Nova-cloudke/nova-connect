const assert = require("node:assert/strict");
const orchestrator = require("./connection-orchestrator");

console.log("Testing Connection Orchestrator...");

// 1. Reject missing device
assert.throws(() => {
  orchestrator.requestConnection(null);
});

// 2. Reject incomplete device
assert.throws(() => {
  orchestrator.requestConnection({});
});

// 3. Test smartphone request
const phone = orchestrator.requestConnection({
  type: "smartphone",
  model: "Test Phone"
});

// 4. No unverified provider may be selected
assert.equal(phone.success, false);
assert.equal(phone.status, "provider_unavailable");

// 5. Test laptop request
const laptop = orchestrator.requestConnection({
  type: "laptop",
  model: "Test Laptop"
});

assert.equal(laptop.success, false);
assert.equal(laptop.status, "provider_unavailable");

// 6. Confirm no false connection is reported
assert.equal(phone.connection, undefined);
assert.equal(laptop.connection, undefined);

console.log("All 6 connection orchestrator checks passed.");
