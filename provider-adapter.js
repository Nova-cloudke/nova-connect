
const registry = require("./provider-registry");

const MODE = "simulation";

const services = new Map();

const SERVICE_STATUS = Object.freeze({
  PENDING: "simulated_pending",
  PROVISIONED: "simulated_provisioned",
  ACTIVE: "simulated_active",
  DEACTIVATED: "simulated_deactivated",
  FAILED: "simulated_failed"
});

const PROVIDER_TYPES = Object.freeze({
  MOBILE: "mobile_operator",
  SATELLITE: "satellite_d2d"
});

function getProvider(providerId) {
  const provider = registry.getProvider(providerId);

  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  return provider;
}

function getIntegrationPath(provider) {
  switch (provider.providerType) {
    case PROVIDER_TYPES.MOBILE:
      return "mobile_operator_integration";

    case PROVIDER_TYPES.SATELLITE:
      return "satellite_d2d_integration";

    default:
      return "unsupported";
  }
}

function getIntegrationReadiness(provider) {
  const integration = provider.integration || {};

  const ready =
    provider.partnership === "established" &&
    integration.apiAvailable === "verified" &&
    integration.authentication === "verified" &&
    integration.activationMethod === "verified";

  return {
    providerId: provider.id,
    providerType: provider.providerType,
    integrationPath: getIntegrationPath(provider),

    partnership: provider.partnership,
    apiAvailable: integration.apiAvailable || "unverified",
    authentication: integration.authentication || "unconfirmed",
    activationMethod: integration.activationMethod || "unconfirmed",

    ready,
    mode: MODE
  };
}

function authenticate(providerId) {
  const provider = getProvider(providerId);
  const readiness = getIntegrationReadiness(provider);

  return {
    success: false,
    authenticated: false,

    providerId: provider.id,
    providerName: provider.name,
    providerType: provider.providerType,
    integrationPath: readiness.integrationPath,

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
    providerType: provider.providerType,

    integrationPath: getIntegrationPath(provider),

    location: location || null,
    availability: "unknown",
    verified: false,

    mode: MODE,

    message:
      "Live provider coverage has not been verified."
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
    providerType: provider.providerType,

    technology: provider.technology,
    networkType: provider.networkType,

    integrationPath: getIntegrationPath(provider),

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

function activate(customer, packageCode, providerId) {
  const provider = getProvider(providerId);

  const readiness = getIntegrationReadiness(provider);

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

  const service = provision(
    customer,
    packageCode,
    providerId
  );

  return {
    ...service,

    activationAllowed: false,

    integrationReady: readiness.ready,

    message: readiness.ready
      ? "Simulation only. Live activation requires a configured and authorized provider adapter."
      : "Simulation only. Provider integration is not verified. No internet connection has been activated."
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
  PROVIDER_TYPES,

  getProvider,
  getIntegrationPath,
  getIntegrationReadiness,

  authenticate,
  checkEligibility,
  checkCoverage,

  provision,
  activate,
  getStatus,
  deactivate
};
  
