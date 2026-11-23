
const registry = require("./provider-registry");
const capabilities = require("./provider-capabilities");

const requiredCapabilities = [
  "kenyaCoverage",
  "compatiblePhoneList",
  "publicIntegrationAPI",
  "automaticActivation",
  "subscriberProvisioning",
  "usageTrackingAPI",
  "commercialPartnership",
  "kenyaRegulatoryApproval",
  "wholesalePricing"
];

function assessProvider(providerId) {
  const provider = registry.getProvider(providerId);
  const details = capabilities.getCapabilities(providerId);

  if (!provider || !details) {
    return null;
  }

  const checks = requiredCapabilities.map(name => ({
    name,
    status: details.capabilities[name] || "unknown"
  }));

  const confirmed = checks.filter(
    item => item.status === "confirmed" ||
            item.status === "documented"
  ).length;

  const outstanding = checks.filter(
    item => item.status !== "confirmed" &&
            item.status !== "documented"
  );

  return {
    providerId,
    providerName: provider.name,
    totalRequirements: checks.length,
    confirmedRequirements: confirmed,
    outstandingRequirements: outstanding,
    connectionReady: outstanding.length === 0,
    decision: outstanding.length === 0
      ? "ready_for_integration_review"
      : "not_ready"
  };
}

function assessAllProviders() {
  return registry.getAllProviders().map(
    provider => assessProvider(provider.id)
  );
}

module.exports = {
  assessProvider,
  assessAllProviders
};
  
