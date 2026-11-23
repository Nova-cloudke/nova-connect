
const registry = require("./provider-registry");
const adapter = require("./provider-adapter");
const contract = require("./provider-contract");

function createProvider(providerId) {
  const providerInfo = registry.getProvider(providerId);

  if (!providerInfo) {
    throw new Error("Unsupported provider: " + providerId);
  }

  const validation = contract.validateProvider(adapter);

  if (!validation.valid) {
    throw new Error(
      "Provider adapter does not satisfy contract: " +
      validation.missingMethods.join(", ")
    );
  }

  return {
    providerId: providerInfo.id,
    providerName: providerInfo.name,
    mode: adapter.MODE,
    provider: adapter
  };
}

function getSupportedProviders() {
  return registry.getAllProviders().map(provider => ({
    id: provider.id,
    name: provider.name
  }));
}

module.exports = {
  createProvider,
  getSupportedProviders
};
                                        
