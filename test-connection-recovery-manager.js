const assert = require("node:assert/strict");
const manager = require("./connection-recovery-manager");

console.log("Testing Connection Recovery Manager...");

// 1. Register recovery
const registered = manager.registerRecovery(
  "recovery-001",
  "ast-spacemobile"
);

assert.equal(registered.attempts, 0);
assert.equal(registered.status, "ready");
assert.equal(registered.phoneHotspotAllowed, false);

// 2. First recovery attempt
const first = manager.requestRecovery(
  "recovery-001",
  "Connection interrupted"
);

assert.equal(first.success, true);
assert.equal(first.recovery.attempts, 1);
assert.equal(first.delaySeconds, 30);

// 3. Second recovery attempt
const second = manager.requestRecovery("recovery-001");

assert.equal(second.recovery.attempts, 2);
assert.equal(second.delaySeconds, 60);

// 4. Third recovery attempt
const third = manager.requestRecovery("recovery-001");

assert.equal(third.recovery.attempts, 3);
assert.equal(third.delaySeconds, 120);

// 5. Reject attempts beyond limit
const fourth = manager.requestRecovery("recovery-001");

assert.equal(fourth.success, false);
assert.equal(fourth.recovery.status, "retry_limit_reached");

// 6. Complete recovery
const recovered = manager.completeRecovery("recovery-001");

assert.equal(recovered.status, "recovered");
assert.equal(recovered.attempts, 0);
assert.equal(recovered.nextRetryAt, null);

// 7. Confirm recovery can restart
const restarted = manager.requestRecovery("recovery-001");

assert.equal(restarted.success, true);
assert.equal(restarted.recovery.attempts, 1);

// 8. Retrieve recovery record
assert.equal(
  manager.getRecovery("recovery-001").attempts,
  1
);

// 9. Reject unknown recovery
assert.equal(manager.getRecovery("unknown"), null);

// 10. Remove recovery
assert.equal(manager.removeRecovery("recovery-001"), true);
assert.equal(manager.getRecovery("recovery-001"), null);

// 11. Reject invalid registration
assert.throws(() => {
  manager.registerRecovery("", "ast-spacemobile");
});

console.log("All 11 connection recovery checks passed.");
