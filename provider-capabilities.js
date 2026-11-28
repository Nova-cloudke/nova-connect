
const capabilities = {
  "safaricom": {
    providerId: "safaricom",
    providerName: "Safaricom",
    technology: "Mobile Network",

    capabilities: {
      kenyaCoverage: "unknown",
      wholesaleInternet: "unknown",
      compatiblePhoneList: "unknown",
      publicIntegrationAPI: "unknown",
      automaticActivation: "unknown",
      subscriberProvisioning: "unknown",
      usageTrackingAPI: "unknown",
      commercialPartnership: "in_discussion",
      kenyaRegulatoryApproval: "needs_verification",
      wholesalePricing: "unknown"
    }
  },

  "airtel": {
    providerId: "airtel",
    providerName: "Airtel",
    technology: "Mobile Network",

    capabilities: {
      kenyaCoverage: "unknown",
      wholesaleInternet: "unknown",
      compatiblePhoneList: "unknown",
      publicIntegrationAPI: "unknown",
      automaticActivation: "unknown",
      subscriberProvisioning: "unknown",
      usageTrackingAPI: "unknown",
      commercialPartnership: "follow_up_required",
      kenyaRegulatoryApproval: "needs_verification",
      wholesalePricing: "unknown"
    }
  },

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
      wholesalePricing: "unknown"
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
      wholesalePricing: "unknown"
    }
  }
};

function getCapabilities(providerId) {
  return capabilities[providerId] || null;
}

function getAllCapabilities() {
  return Object.values(capabilities).filter(
    provider =>
      provider.providerId === "ast-spacemobile" ||
      provider.providerId === "starlink-direct-to-cell"
  ); 
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
  
