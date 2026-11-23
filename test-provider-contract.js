
const assert = require("node:assert/strict");
const contract = require("./provider-contract");
const adapter = require("./provider-adapter");

console.log("Testing Provider Integration Contract...");

// 1. Contract version
assert.equal(contract.getContractVersion(), "1.0.0");

// 2. Required methods
assert.equal(contract.getRequiredMethods().length, 5);

// 3. Actual Nova adapter satisfies the contract
const adapterResult = contract.validateProvider(adapter);
assert.equal(adapterResult.valid, true);
assert.deepEqual(adapterResult.missingMethods, []);

// 4. Valid example provider
const validProvider = {
  checkEligibility() {},
  checkCoverage() {},
  activate() {},
  getStatus() {},
  deactivate() {}
};

assert.equal(contract.validateProvider(validProvider).valid, true);

// 5. Incomplete provider
const incompleteProvider = {
  checkEligibility() {},
  activate() {}
};

const incompleteResult = contract.validateProvider(incompleteProvider);
assert.equal(incompleteResult.valid, false);
assert.deepEqual(incompleteResult.missingMethods, [
  "checkCoverage",
  "getStatus",
  "deactivate"
]);

// 6. Invalid provider
const invalidResult = contract.validateProvider(null);
assert.equal(invalidResult.valid, false);
assert.equal(invalidResult.missingMethods.length, 5);

console.log("All 6 provider contract checks passed.");
  
