
const registry = require("./provider-registry");
const adapter = require("./provider-adapter");
const contract = require("./provider-contract");

function createProvider(providerId) {
  const providerInfo = registry.getProvider(providerId);

  if (!providerInfo) {
    throw new Error("Unsupported provider: " + providerId);
  }

  const supportedTypes = [
    "mobile_operator",
    "satellite_d2d"
  ];

  if (!supportedTypes.includes(providerInfo.providerType)) {
    throw new Error(
      "Unsupported provider type: " + providerInfo.providerType
    );
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
    providerType: providerInfo.providerType,
    technology: providerInfo.technology,
    networkType: providerInfo.networkType,
    integration: providerInfo.integration,
    coverage: providerInfo.coverage,
    partnership: providerInfo.partnership,
    regulatory: providerInfo.regulatory,
    mode: adapter.MODE,
    provider: adapter
  };
}

function getSupportedProviders() {
  return registry.getAllProviders().map(provider => ({
    id: provider.id,
    name: provider.name,
    providerType: provider.providerType,
    technology: provider.technology,
    partnership: provider.partnership
  }));
}

module.exports = {
  createProvider,
  getSupportedProviders
};
    
