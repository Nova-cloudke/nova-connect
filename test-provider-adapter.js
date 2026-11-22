
const assert = require("node:assert/strict");
const provider = require("./provider-adapter");

console.log("Testing Nova Connect Provider Adapter...");

assert.equal(provider.MODE, "simulation");

// 1. Eligibility
const eligibility = provider.checkEligibility({
  phone: "+254700000000"
});
assert.equal(eligibility.success, true);
assert.equal(eligibility.eligible, true);

// 2. Coverage must not pretend to confirm real coverage
const coverage = provider.checkCoverage("Kenya");
assert.equal(coverage.availability, "unknown");

// 3. Activation
const activation = provider.activate(
  { phone: "+254700000000" },
  "1-hour"
);
assert.equal(activation.success, true);
assert.equal(activation.simulated, true);

const serviceId = activation.service.id;

// 4. Status
const status = provider.getStatus(serviceId);
assert.equal(status.success, true);
assert.equal(status.service.status, "simulated_pending");

// 5. Deactivation
const deactivation = provider.deactivate(serviceId);
assert.equal(deactivation.success, true);
assert.equal(
  deactivation.service.status,
  "simulated_deactivated"
);

// 6. Invalid customer
assert.throws(() => provider.checkEligibility(null));

// 7. Missing package
assert.throws(() =>
  provider.activate({ phone: "+254700000000" }, "")
);

console.log("All 7 provider adapter checks passed.");
  
