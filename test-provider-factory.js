
const assert = require("node:assert/strict");
const factory = require("./provider-factory");

console.log("Testing Provider Factory...");

// 1. Load AST SpaceMobile
const ast = factory.createProvider("ast-spacemobile");
assert.equal(ast.providerId, "ast-spacemobile");
assert.equal(ast.providerName, "AST SpaceMobile");
assert.equal(ast.mode, "simulation");

// 2. Load Starlink Direct to Cell
const starlink = factory.createProvider("starlink-direct-to-cell");
assert.equal(starlink.providerId, "starlink-direct-to-cell");
assert.equal(starlink.providerName, "Starlink Direct to Cell");
assert.equal(starlink.mode, "simulation");

// 3. Unsupported provider
assert.throws(() =>
  factory.createProvider("unknown-provider")
);

// 4. Supported providers list
const providers = factory.getSupportedProviders();
assert.equal(providers.length, 2);

// 5. Provider adapter is available
assert.equal(typeof ast.provider.activate, "function");

console.log("All 5 provider factory checks passed.");
