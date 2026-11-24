
const assert = require("node:assert/strict");
const selector = require("./provider-selector");

console.log("Testing Provider Selection Engine...");

// 1. Compare all providers
const providers = selector.compareProviders();
assert.equal(providers.length, 2);

// 2. AST SpaceMobile
const ast = selector.evaluateProvider("ast-spacemobile");
assert.equal(ast.providerName, "AST SpaceMobile");
assert.equal(ast.integrationReady, false);
assert.equal(ast.decision, "research_required");

// 3. Starlink Direct to Cell
const starlink = selector.evaluateProvider("starlink-direct-to-cell");
assert.equal(starlink.providerName, "Starlink Direct to Cell");
assert.equal(starlink.integrationReady, false);
assert.equal(starlink.decision, "research_required");

// 4. Unknown provider
assert.equal(
  selector.evaluateProvider("unknown-provider"),
  null
);

// 5. No recommendation while requirements are unverified
assert.equal(selector.getRecommendedProvider(), null);

console.log("All 5 provider selector checks passed.");
