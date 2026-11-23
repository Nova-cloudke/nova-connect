
const assert = require("node:assert/strict");
const contract = require("./provider-contract");

console.log("Testing Provider Integration Contract...");

// 1. Contract version
assert.equal(contract.getContractVersion(), "1.0.0");

// 2. Required methods
const methods = contract.getRequiredMethods();
assert.equal(methods.length, 5);

// 3. Valid provider
const validProvider = {
  checkEligibility() {},
  checkCoverage() {},
  activate() {},
  getStatus() {},
  deactivate() {}
};

const validResult = contract.validateProvider(validProvider);
assert.equal(validResult.valid, true);
assert.deepEqual(validResult.missingMethods, []);

// 4. Missing methods
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

// 5. Invalid provider
const invalidResult = contract.validateProvider(null);
assert.equal(invalidResult.valid, false);
assert.equal(invalidResult.missingMethods.length, 5);

console.log("All 5 provider contract checks passed.");
  
