const registry = require("./provider-registry");
const capabilities = require("./provider-capabilities");

function evaluateProvider(providerId) {
  const provider = registry.getProvider(providerId);
  const details = capabilities.getCapabilities(providerId);

  if (!provider || !details) return null;

  const checks = details.capabilities;

  const requirements = {
    directToDevice: checks.directToDevice,
    kenyaCoverage: checks.kenyaCoverage,
    commercialPartnership: checks.commercialPartnership,
    kenyaRegulatoryApproval: checks.kenyaRegulatoryApproval,
    publicIntegrationAPI: checks.publicIntegrationAPI
  };

  const ready = Object.values(requirements).every(
    status => status === "confirmed" || status === "documented"
  );

  return {
    providerId,
    providerName: provider.name,
    technology: details.technology,
    requirements,
    integrationReady: ready,
    decision: ready ? "eligible_for_review" : "research_required"
  };
}

function compareProviders() {
  return registry.getAllProviders().map(provider =>
    evaluateProvider(provider.id)
  );
}

function getRecommendedProvider() {
  return compareProviders().find(
    provider => provider && provider.integrationReady
  ) || null;
}

function selectProvider(assessment) {
  if (!assessment || !assessment.providerId) {
    return null;
  }

  const provider = evaluateProvider(assessment.providerId);

  if (!provider || !provider.integrationReady) {
    return null;
  }

  return provider;
}

module.exports = {
  evaluateProvider,
  compareProviders,
  getRecommendedProvider,
  selectProvider
};
