
const assert = require("node:assert/strict");
const registry = require("./provider-registry");

console.log("Testing Nova Provider Registry...");

assert.equal(registry.getProviderCount(), 2);

const providers = registry.getAllProviders();
assert.equal(providers.length, 2);

const ast = registry.getProvider("ast-spacemobile");
assert.equal(ast.name, "AST SpaceMobile");

const starlink = registry.getProvider(
  "starlink-direct-to-cell"
);
assert.equal(starlink.name, "Starlink Direct to Cell");

const d2d = registry.getProvidersByTechnology(
  "Direct-to-Device"
);
assert.equal(d2d.length, 2);

assert.equal(
  registry.getProvider("unknown-provider"),
  null
);

console.log("All 6 registry checks passed.");
