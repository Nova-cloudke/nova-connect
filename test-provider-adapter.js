
const assert = require("node:assert/strict");
const provider = require("./provider-adapter");

console.log("Testing Registry-Connected Provider Adapter...");

assert.equal(provider.MODE, "simulation");

// 1. Provider lookup
const ast = provider.getProvider("ast-spacemobile");
assert.equal(ast.name, "AST SpaceMobile");

// 2. Unknown provider
assert.throws(() =>
  provider.getProvider("unknown-provider")
);

// 3. Eligibility
const eligibility = provider.checkEligibility({
  phone: "+254700000000"
});
assert.equal(eligibility.eligible, true);

// 4. Coverage
const coverage = provider.checkCoverage(
  "Kenya",
  "ast-spacemobile"
);
assert.equal(coverage.availability, "unknown");

// 5. Activation
const activation = provider.activate(
  { phone: "+254700000000" },
  "1-hour",
  "ast-spacemobile"
);

assert.equal(activation.success, true);
assert.equal(
  activation.service.providerId,
  "ast-spacemobile"
);

const serviceId = activation.service.id;

// 6. Status
const status = provider.getStatus(serviceId);
assert.equal(status.success, true);
assert.equal(status.service.status, "simulated_pending");

// 7. Deactivation
const deactivation = provider.deactivate(serviceId);
assert.equal(
  deactivation.service.status,
  "simulated_deactivated"
);

// 8. Invalid customer
assert.throws(() => provider.checkEligibility(null));

// 9. Missing package
assert.throws(() =>
  provider.activate(
    { phone: "+254700000000" },
    "",
    "ast-spacemobile"
  )
);

console.log("All 9 adapter checks passed.");
  
