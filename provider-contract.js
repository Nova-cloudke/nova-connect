
const REQUIRED_METHODS = [
  "checkEligibility",
  "checkCoverage",
  "activate",
  "getStatus",
  "deactivate"
];

function validateProvider(provider) {
  if (!provider || typeof provider !== "object") {
    return {
      valid: false,
      missingMethods: REQUIRED_METHODS
    };
  }

  const missingMethods = REQUIRED_METHODS.filter(
    method => typeof provider[method] !== "function"
  );

  return {
    valid: missingMethods.length === 0,
    missingMethods
  };
}

function getRequiredMethods() {
  return [...REQUIRED_METHODS];
}

function getContractVersion() {
  return "1.0.0";
}

module.exports = {
  validateProvider,
  getRequiredMethods,
  getContractVersion
};
      
