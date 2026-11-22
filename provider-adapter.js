
const registry = require("./provider-registry");

const MODE = "simulation";
const services = new Map();

function getProvider(providerId) {
  const provider = registry.getProvider(providerId);

  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  return provider;
}

function checkEligibility(customer) {
  if (!customer || !customer.phone) {
    return {
      eligible: false,
      reason: "Customer phone number is required"
    };
  }

  return {
    eligible: true,
    status: "simulation_only"
  };
}

function checkCoverage(location, providerId) {
  const provider = getProvider(providerId);

  return {
    providerId: provider.id,
    providerName: provider.name,
    location,
    availability: "unknown",
    verified: false,
    mode: MODE
  };
}

function activate(customer, packageCode, providerId) {
  const provider = getProvider(providerId);

  const eligibility = checkEligibility(customer);

  if (!eligibility.eligible) {
    throw new Error(eligibility.reason);
  }

  if (!packageCode) {
    throw new Error("Package code is required");
  }

  const serviceId = `SIM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const service = {
    serviceId,
    providerId: provider.id,
    providerName: provider.name,
    customer,
    packageCode,
    status: "simulated_pending",
    providerConnection: "not_connected",
    mode: MODE,
    createdAt: new Date().toISOString()
  };

  services.set(serviceId, service);

  return service;
}

function getStatus(serviceId) {
  return services.get(serviceId) || null;
}

function deactivate(serviceId) {
  const service = services.get(serviceId);

  if (!service) {
    return {
      success: false,
      reason: "Service not found"
    };
  }

  service.status = "simulated_deactivated";

  return {
    success: true,
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
      
