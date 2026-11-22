
const assert = require("node:assert/strict");
const provider = require("./provider-adapter");

console.log("Testing Registry-Connected Provider Adapter...");

assert.equal(provider.MODE, "simulation");

// 1. Provider lookup
const ast = provider.getProvider("ast-spacemobile");
assert.equal(ast.name, "AST SpaceMobile");

// 2. Unknown provider
assert.throws(
  () => provider.getProvider("unknown-provider"),
  /Unknown provider/
);

// 3. Customer eligibility
const customer = {
  phone: "+254700000000"
};

assert.equal(
  provider.checkEligibility(customer).eligible,
  true
);

// 4. Invalid customer
assert.throws(
  () => provider.activate({}, "1-hour", "ast-spacemobile"),
  /Customer phone number is required/
);

// 5. Coverage check
const coverage = provider.checkCoverage(
  "Kenya",
  "ast-spacemobile"
);

assert.equal(coverage.availability, "unknown");
assert.equal(coverage.verified, false);

// 6. Activation
const service = provider.activate(
  customer,
  "1-hour",
  "ast-spacemobile"
);

assert.equal(service.providerId, "ast-spacemobile");
assert.equal(service.status, "simulated_pending");
assert.equal(service.providerConnection, "not_connected");

// 7. Status
const status = provider.getStatus(service.serviceId);
assert.equal(status.status, "simulated_pending");

// 8. Deactivation
const result = provider.deactivate(service.serviceId);
assert.equal(result.success, true);
assert.equal(result.service.status, "simulated_deactivated");

// 9. Missing package
assert.throws(
  () => provider.activate(customer, "", "ast-spacemobile"),
  /Package code is required/
);

console.log("All provider adapter tests passed.");
  
