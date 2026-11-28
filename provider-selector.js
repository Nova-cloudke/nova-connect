
const registry = require("./provider-registry");
const capabilities = require("./provider-capabilities");
const readiness = require("./provider-readiness");

function evaluateProvider(providerId) {
  const provider = registry.getProvider(providerId);
  const details = capabilities.getCapabilities(providerId);
  const assessment = readiness.assessProvider(providerId);

  if (!provider || !details || !assessment) {
    return null;
  }

  const partnershipEstablished =
    provider.partnership === "established";

  const technicalRequirementsVerified =
    assessment.outstandingRequirements.length === 0;

  const integrationReady =
    partnershipEstablished &&
    technicalRequirementsVerified;

  return {
    providerId,
    providerName: provider.name,
    providerType: provider.providerType,
    technology: details.technology,
    partnership: provider.partnership,
    requirements: details.capabilities,

    totalRequirements: assessment.totalRequirements,
    confirmedRequirements: assessment.confirmedRequirements,
    outstandingRequirements: assessment.outstandingRequirements,

    partnershipEstablished,
    technicalRequirementsVerified,
    integrationReady,

    decision: integrationReady
      ? "eligible_for_integration_review"
      : "research_required"
  };
}

function compareProviders() {
  return registry.getAllProviders().map(
    provider => evaluateProvider(provider.id)
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

function getB2BProviders() {
  return compareProviders().filter(
    provider =>
      provider &&
      provider.providerType === "mobile_operator"
  );
}

module.exports = {
  evaluateProvider,
  compareProviders,
  getRecommendedProvider,
  selectProvider,
  getB2BProviders
};
      
