
const capabilities = {
  "ast-spacemobile": {
    providerId: "ast-spacemobile",
    providerName: "AST SpaceMobile",
    technology: "Direct-to-Device Satellite",

    capabilities: {
      directToDevice: "documented",
      ordinaryPhoneConnection: "documented",
      kenyaCoverage: "unknown",
      compatiblePhoneList: "unknown",
      publicIntegrationAPI: "unknown",
      automaticActivation: "unknown",
      subscriberProvisioning: "unknown",
      usageTrackingAPI: "unknown",
      commercialPartnership: "needs_verification",
      kenyaRegulatoryApproval: "unknown",
      wholesalePricing: "not_published"
    }
  },

  "starlink-direct-to-cell": {
    providerId: "starlink-direct-to-cell",
    providerName: "Starlink Direct to Cell",
    technology: "Direct-to-Device Satellite",

    capabilities: {
      directToDevice: "documented",
      ordinaryPhoneConnection: "documented",
      kenyaCoverage: "unknown",
      compatiblePhoneList: "unknown",
      publicIntegrationAPI: "unknown",
      automaticActivation: "unknown",
      subscriberProvisioning: "unknown",
      usageTrackingAPI: "unknown",
      commercialPartnership: "needs_verification",
      kenyaRegulatoryApproval: "unknown",
      wholesalePricing: "not_published"
    }
  }
};

function getCapabilities(providerId) {
  return capabilities[providerId] || null;
}

function getAllCapabilities() {
  return Object.values(capabilities);
}

function getCapabilityStatus(providerId, capabilityName) {
  const provider = getCapabilities(providerId);

  if (!provider) return null;

  return provider.capabilities[capabilityName] || null;
}

module.exports = {
  getCapabilities,
  getAllCapabilities,
  getCapabilityStatus
};
      
