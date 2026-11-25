
const registry = require("./provider-registry");
const adapter = require("./provider-adapter");
const contract = require("./provider-contract");
const readiness = require("./provider-readiness");

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

  const assessment = readiness.assessProvider(providerId);

  if (!assessment) {
    throw new Error("Provider readiness assessment unavailable");
  }

  return {
    providerId: providerInfo.id,
    providerName: providerInfo.name,

    mode: "simulation",
    connectionState: "simulation_only",
    realIntegrationAvailable: false,

    integrationReady: assessment.connectionReady,
    readiness: assessment,

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
      
