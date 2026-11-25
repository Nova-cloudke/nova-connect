
const registry = require("./provider-registry");
const capabilities = require("./provider-capabilities");
const readiness = require("./provider-readiness");

function evaluateProvider(providerId) {
  const provider = registry.getProvider(providerId);
  const details = capabilities.getCapabilities(providerId);
  const assessment = readiness.assessProvider(providerId);

  if (!provider || !details || !assessment) return null;

  return {
    providerId,
    providerName: provider.name,
    technology: details.technology,
    requirements: details.capabilities,
    totalRequirements: assessment.totalRequirements,
    confirmedRequirements: assessment.confirmedRequirements,
    outstandingRequirements: assessment.outstandingRequirements,
    integrationReady: assessment.connectionReady,
    decision: assessment.connectionReady
      ? "eligible_for_integration_review"
      : "research_required"
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
  if (!assessment || !assessment.providerId) return null;

  const provider = evaluateProvider(assessment.providerId);

  if (!provider || !provider.integrationReady) return null;

  return provider;
}

module.exports = {
  evaluateProvider,
  compareProviders,
  getRecommendedProvider,
  selectProvider
};
    
