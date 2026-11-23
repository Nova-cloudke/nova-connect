
const assert = require("node:assert/strict");
const capabilities = require("./provider-capabilities");

console.log("Testing Provider Capabilities...");

// 1. Both providers exist
assert.equal(capabilities.getAllCapabilities().length, 2);

// 2. AST SpaceMobile
const ast = capabilities.getCapabilities("ast-spacemobile");
assert.equal(ast.providerName, "AST SpaceMobile");
assert.equal(ast.capabilities.directToDevice, "documented");

// 3. Starlink Direct to Cell
const starlink = capabilities.getCapabilities("starlink-direct-to-cell");
assert.equal(starlink.providerName, "Starlink Direct to Cell");
assert.equal(starlink.capabilities.directToDevice, "documented");

// 4. Unknown provider
assert.equal(capabilities.getCapabilities("unknown-provider"), null);

// 5. Capability lookup
assert.equal(
  capabilities.getCapabilityStatus(
    "ast-spacemobile",
    "kenyaCoverage"
  ),
  "unknown"
);

// 6. Unknown capability
assert.equal(
  capabilities.getCapabilityStatus(
    "ast-spacemobile",
    "unknownCapability"
  ),
  null
);

console.log("All 6 capability checks passed.");
