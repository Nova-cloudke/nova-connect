
const factory = require("./provider-factory");

const providerServices = new Map();

const MODE = "simulation";

function requestProviderConnection({
  providerId,
  customer,
  packageCode
}) {
  if (!providerId) {
    throw new Error("Provider ID is required");
  }

  if (!customer || !customer.phone) {
    throw new Error("Customer phone number is required");
  }

  if (
    typeof packageCode !== "string" ||
    !packageCode.trim()
  ) {
    throw new Error("Package code is required");
  }

  const providerConfig = factory.createProvider(providerId);

  const adapter = providerConfig.provider;

  if (!adapter || typeof adapter.activate !== "function") {
    throw new Error(
      "Selected provider does not support activation requests"
    );
  }

  const result = adapter.activate(
    customer,
    packageCode.trim(),
    providerId
  );

  if (!result || !result.serviceId) {
    throw new Error(
      "Provider adapter did not return a valid service"
    );
  }

  const record = {
    serviceId: result.serviceId,
    providerId: providerConfig.providerId,
    providerName: providerConfig.providerName,
    providerType: providerConfig.providerType,

    connectionId: null,

    status: result.status,
    mode: MODE,

    providerConfirmed: false,
    internetAccess: false,

    activationAllowed: false,

    createdAt: new Date().toISOString(),

    message: result.message
  };

  providerServices.set(record.serviceId, record);

  return {
    success: true,
    mode: MODE,
    providerService: { ...record }
  };
}

function linkConnection(serviceId, connectionId) {
  const service = providerServices.get(serviceId);

  if (!service) {
    throw new Error("Provider service not found");
  }

  if (!connectionId) {
    throw new Error("Connection ID is required");
  }

  service.connectionId = connectionId;
  service.updatedAt = new Date().toISOString();

  return { ...service };
}

function getProviderConnection(serviceId) {
  const service = providerServices.get(serviceId);

  if (!service) {
    return null;
  }

  const providerConfig = factory.createProvider(
    service.providerId
  );

  const adapterService = providerConfig.provider.getStatus(
    serviceId
  );

  return {
    ...service,
    adapterService
  };
}

function disconnectProviderConnection(serviceId) {
  const service = providerServices.get(serviceId);

  if (!service) {
    return {
      success: false,
      reason: "Provider service not found"
    };
  }

  const providerConfig = factory.createProvider(
    service.providerId
  );

  const result = providerConfig.provider.deactivate(serviceId);

  if (result.success) {
    service.status = "simulated_deactivated";
    service.internetAccess = false;
    service.updatedAt = new Date().toISOString();
    service.message = result.service.message;
  }

  return {
    success: result.success,
    mode: MODE,
    providerService: { ...service }
  };
}

module.exports = {
  MODE,
  requestProviderConnection,
  linkConnection,
  getProviderConnection,
  disconnectProviderConnection
};
    
