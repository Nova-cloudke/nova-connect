/**
 * NOVA CONNECT
 * Multi-Network Provider Registry v2.0
 *
 * Registry only. No real network connections or activations.
 */

const providers = [
  {
    id: "safaricom",
    name: "Safaricom",
    providerType: "mobile_operator",
    technology: "Mobile Network",
    networkType: "Terrestrial Cellular",
    integration: {
      apiAvailable: "unverified",
      activationMethod: "unconfirmed",
      authentication: "unconfirmed"
    },
    coverage: {
      kenya: "not_assessed"
    },
    partnership: "not_established",
    regulatory: "verification_required"
  },

  {
    id: "airtel",
    name: "Airtel",
    providerType: "mobile_operator",
    technology: "Mobile Network",
    networkType: "Terrestrial Cellular",
    integration: {
      apiAvailable: "unverified",
      activationMethod: "unconfirmed",
      authentication: "unconfirmed"
    },
    coverage: {
      kenya: "not_assessed"
    },
    partnership: "not_established",
    regulatory: "verification_required"
  },

  {
    id: "ast-spacemobile",
    name: "AST SpaceMobile",
    providerType: "satellite_d2d",
    technology: "Direct-to-Device",
    networkType: "Satellite Cellular",
    integration: {
      apiAvailable: "unverified",
      activationMethod: "unconfirmed",
      authentication: "unconfirmed"
    },
    compatibility: {
      existingSim: "requires_operator_confirmation",
      deviceRequirements: "provider_confirmation_required"
    },
    coverage: {
      kenya: "unconfirmed",
      global: "unconfirmed"
    },
    partnership: "not_established",
    regulatory: "verification_required"
  },

  {
    id: "starlink-direct-to-cell",
    name: "Starlink Direct to Cell",
    providerType: "satellite_d2d",
    technology: "Direct-to-Device",
    networkType: "Satellite Cellular",
    integration: {
      apiAvailable: "unverified",
      activationMethod: "unconfirmed",
      authentication: "unconfirmed"
    },
    compatibility: {
      existingSim: "requires_operator_confirmation",
      deviceRequirements: "provider_confirmation_required"
    },
    coverage: {
      kenya: "unconfirmed",
      global: "unconfirmed"
    },
    partnership: "not_established",
    regulatory: "verification_required"
  }
];

function getAllProviders() {
  return providers;
}

function getProvider(providerId) {
  return providers.find(
    provider => provider.id === providerId
  ) || null;
}

function getProvidersByTechnology(technology) {
  return providers.filter(
    provider =>
      provider.technology.toLowerCase() ===
      technology.toLowerCase()
  );
}

function getProvidersByType(providerType) {
  return providers.filter(
    provider => provider.providerType === providerType
  );
}

function getProviderCount() {
  return providers.length;
}

module.exports = {
  getAllProviders,
  getProvider,
  getProvidersByTechnology,
  getProvidersByType,
  getProviderCount
};
