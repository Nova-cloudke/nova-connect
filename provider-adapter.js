
const registry = require("./provider-registry");

const MODE = "simulation";

const services = new Map();

const SERVICE_STATUS = Object.freeze({
  PENDING: "pending",
  PROVISIONED: "provisioned",
  ACTIVE: "active",
  DEACTIVATED: "deactivated",
  FAILED: "failed"
});

function getProvider(providerId) {
  const provider = registry.getProvider(providerId);

  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  return provider;
}

function getIntegrationReadiness(provider) {
  return {
    partnership: provider.partnership,
    apiAvailable: provider.integration.apiAvailable,
    authentication: provider.integration.authentication,
    activationMethod: provider.integration.activationMethod,
    ready:
      provider.partnership === "established" &&
      provider.integration.apiAvailable === "verified" &&
      provider.integration.authentication === "verified" &&
      provider.integration.activationMethod === "verified"
  };
}

function authenticate(providerId) {
  const provider = getProvider(providerId);
  const readiness = getIntegrationReadiness(provider);

  return {
    success: false,
    authenticated: false,
    providerId: provider.id,
    mode: MODE,
    reason: readiness.ready
      ? "Live authentication adapter is not configured."
      : "Provider partnership and technical integration are not verified."
  };
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
    mode: MODE,
    status: "simulation_only"
  };
}

function checkCoverage(location, providerId) {
  const provider = getProvider(providerId);

  return {
    providerId: provider.id,
    providerName: provider.name,
    location: location || null,
    availability: "unknown",
    verified: false,
    mode: MODE,
    message: "Live provider coverage has not been verified."
  };
}

function provision(customer, packageCode, providerId) {
  const provider = getProvider(providerId);
  const eligibility = checkEligibility(customer);

  if (!eligibility.eligible) {
    throw new Error(eligibility.reason);
  }

  if (
    typeof packageCode !== "string" ||
    !packageCode.trim()
  ) {
    throw new Error("Package code is required");
  }

  const serviceId =
    `NOVA-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const now = new Date().toISOString();

  const service = {
    serviceId,
    providerId: provider.id,
    providerName: provider.name,
    customer,
    packageCode: packageCode.trim(),

    status: SERVICE_STATUS.PENDING,

    mode: MODE,
    providerConnection: "not_connected",

    provisionRequestedAt: now,
    provisionedAt: null,
    activatedAt: null,
    expiresAt: null,
    deactivatedAt: null,

    providerReference: null,
    usage: null,

    createdAt: now,
    updatedAt: now,

    message:
      "Simulation only. No provider service has been provisioned."
  };

  services.set(serviceId, service);

  return service;
}

function activate(serviceId) {
  const service = services.get(serviceId);

  if (!service) {
    return {
      success: false,
      reason: "Service not found"
    };
  }

  return {
    success: false,
    service,
    mode: MODE,
    reason:
      "Live provider activation is unavailable. No internet access was activated."
  };
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

  if (service.status === SERVICE_STATUS.DEACTIVATED) {
    return {
      success: true,
      service
    };
  }

  service.status = SERVICE_STATUS.DEACTIVATED;
  service.providerConnection = "not_connected";
  service.deactivatedAt = new Date().toISOString();
  service.updatedAt = service.deactivatedAt;

  service.message =
    "Simulated deactivation only. No live provider service was changed.";

  return {
    success: true,
    service
  };
}

module.exports = {
  MODE,
  SERVICE_STATUS,
  getProvider,
  getIntegrationReadiness,
  authenticate,
  checkEligibility,
  checkCoverage,
  provision,
  activate,
  getStatus,
  deactivate
};
    
