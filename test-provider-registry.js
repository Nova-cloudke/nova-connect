const assert = require("node:assert/strict");
const registry = require("./provider-registry");

console.log("Testing Nova Provider Registry...");

// Check provider count
assert.equal(registry.getProviderCount(), 4);

const providers = registry.getAllProviders();
assert.equal(providers.length, 4);

// Check AST SpaceMobile
const ast = registry.getProvider("ast-spacemobile");
assert.equal(ast.name, "AST SpaceMobile");

// Check Starlink
const starlink = registry.getProvider(
  "starlink-direct-to-cell"
);
assert.equal(starlink.name, "Starlink Direct to Cell");

// Check Safaricom
const safaricom = registry.getProvider("safaricom");
assert.equal(safaricom.name, "Safaricom");
assert.equal(safaricom.providerType, "mobile_operator");

// Check Airtel
const airtel = registry.getProvider("airtel");
assert.equal(airtel.name, "Airtel");
assert.equal(airtel.providerType, "mobile_operator");

// Check D2D providers
const d2d = registry.getProvidersByTechnology(
  "Direct-to-Device"
);
assert.equal(d2d.length, 2);

// Check provider categories
assert.equal(
  registry.getProvidersByType("mobile_operator").length,
  2
);

assert.equal(
  registry.getProvidersByType("satellite_d2d").length,
  2
);

// Check unknown provider
assert.equal(
  registry.getProvider("unknown-provider"),
  null
);

console.log("All provider registry checks passed.");
