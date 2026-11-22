
/**
 * NOVA CONNECT
 * Provider Capability Registry v1.0
 *
 * Provider information registry.
 * Does not connect to satellite networks.
 */

const providers = [
  {
    id: "ast-spacemobile",
    name: "AST SpaceMobile",
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
      kenya: "verification_required",
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

function getProviderCount() {
  return providers.length;
}

module.exports = {
  getAllProviders,
  getProvider,
  getProvidersByTechnology,
  getProviderCount
};
      
