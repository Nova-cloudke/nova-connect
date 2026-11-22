
/**
 * NOVA CONNECT
 * Provider Integration Module v1.1
 *
 * Registry-connected simulation mode.
 * No real satellite activation.
 */

const registry = require("./provider-registry");

const MODE = "simulation";

const services = new Map();

function createId() {
  return "NOVA-" + Date.now() + "-" +
    Math.random().toString(36).slice(2, 8);
}

function getProvider(providerId) {
  const provider = registry.getProvider(providerId);

  if (!provider) {
    throw new Error("Unknown provider: " + providerId);
  }

  return provider;
}

function checkEligibility(customer) {
  if (!customer || !customer.phone) {
    throw new Error("Customer phone number is required.");
  }

  return {
    success: true,
    simulated: true,
    eligible: true,
    customer: customer.phone,
    message: "Simulated eligibility check."
  };
}

function checkCoverage(location, providerId) {
  if (!location) {
    throw new Error("Location information is required.");
  }

  const provider = getProvider(providerId);

  return {
    success: true,
    simulated: true,
    providerId: provider.id,
    providerName: provider.name,
    availability: "unknown",
    message:
      "Real D2D coverage must be confirmed by the provider."
  };
}

function activate(customer, packageCode, providerId) {
  if (!customer || !customer.phone) {
    throw new Error("Valid customer information is required.");
  }

  if (!packageCode) {
    throw new Error("Package code is required.");
  }

  const provider = getProvider(providerId);

  const id = createId();

  const service = {
    id,
    customer: customer.phone,
    packageCode,
    providerId: provider.id,
    providerName: provider.name,
    status: "simulated_pending",
    providerConnection: "not_connected",
    createdAt: new Date().toISOString()
  };

  services.set(id, service);

  return {
    success: true,
    simulated: true,
    service
  };
}

function getStatus(serviceId) {
  const service = services.get(serviceId);

  if (!service) {
    return {
      success: false,
      message: "Service not found."
    };
  }

  return {
    success: true,
    simulated: true,
    service
  };
}

function deactivate(serviceId) {
  const service = services.get(serviceId);

  if (!service) {
    return {
      success: false,
      message: "Service not found."
    };
  }

  service.status = "simulated_deactivated";

  return {
    success: true,
    simulated: true,
    service
  };
}

module.exports = {
  MODE,
  getProvider,
  checkEligibility,
  checkCoverage,
  activate,
  getStatus,
  deactivate
};
