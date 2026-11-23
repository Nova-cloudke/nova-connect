const assert = require("node:assert/strict");
const gate = require("./provider-confirmation-gate");

console.log("Testing Provider Confirmation Gate...");

// 1. Reject missing response
const missing = gate.verifyConfirmation(null);
assert.equal(missing.connected, false);
assert.equal(missing.status, "awaiting_provider_confirmation");

// 2. Reject incomplete confirmation
const incomplete = gate.verifyConfirmation({
  providerId: "ast-spacemobile"
});
assert.equal(incomplete.connected, false);

// 3. Reject simulated confirmation
const simulated = gate.verifyConfirmation({
  providerId: "ast-spacemobile",
  connectionId: "test-001",
  status: "connected",
  confirmationSource: "live_provider",
  confirmedAt: new Date().toISOString(),
  simulation: true
});
assert.equal(simulated.status, "simulation_rejected");

// 4. Reject unverified source
const unverified = gate.verifyConfirmation({
  providerId: "ast-spacemobile",
  connectionId: "test-002",
  status: "connected",
  confirmationSource: "manual",
  confirmedAt: new Date().toISOString()
});
assert.equal(unverified.status, "unverified_confirmation");

// 5. Reject provider that is not connected
const disconnected = gate.verifyConfirmation({
  providerId: "starlink-direct-to-cell",
  connectionId: "test-003",
  status: "pending",
  confirmationSource: "live_provider",
  confirmedAt: new Date().toISOString()
});
assert.equal(disconnected.status, "provider_not_connected");

// 6. Reject invalid timestamp
const invalidTime = gate.verifyConfirmation({
  providerId: "ast-spacemobile",
  connectionId: "test-004",
  status: "connected",
  confirmationSource: "live_provider",
  confirmedAt: "not-a-date"
});
assert.equal(invalidTime.status, "invalid_confirmation");

// 7. Accept valid provider confirmation
const valid = gate.verifyConfirmation({
  providerId: "ast-spacemobile",
  connectionId: "test-005",
  status: "connected",
  confirmationSource: "live_provider",
  confirmedAt: new Date().toISOString()
});
assert.equal(valid.success, true);
assert.equal(valid.connected, true);
assert.equal(valid.status, "provider_confirmed");

console.log("All 7 provider confirmation checks passed.");
