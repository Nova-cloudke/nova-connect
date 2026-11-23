
const assert = require("node:assert/strict");
const readiness = require("./provider-readiness");

console.log("Testing Provider Connection Readiness...");

// 1. Assess all providers
const all = readiness.assessAllProviders();
assert.equal(all.length, 2);

// 2. AST SpaceMobile
const ast = readiness.assessProvider("ast-spacemobile");
assert.equal(ast.providerName, "AST SpaceMobile");
assert.equal(ast.totalRequirements, 9);
assert.equal(ast.connectionReady, false);
assert.equal(ast.decision, "not_ready");

// 3. Starlink Direct to Cell
const starlink = readiness.assessProvider("starlink-direct-to-cell");
assert.equal(starlink.providerName, "Starlink Direct to Cell");
assert.equal(starlink.totalRequirements, 9);
assert.equal(starlink.connectionReady, false);
assert.equal(starlink.decision, "not_ready");

// 4. Outstanding requirements
assert.ok(ast.outstandingRequirements.length > 0);
assert.ok(starlink.outstandingRequirements.length > 0);

// 5. Unknown provider
assert.equal(
  readiness.assessProvider("unknown-provider"),
  null
);

console.log("All 5 readiness checks passed.");
