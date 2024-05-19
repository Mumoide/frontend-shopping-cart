const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');

// Use the integration credentials for development
const commerceCode = IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = IntegrationApiKeys.WEBPAY;
const environment = Environment.Integration;

// Configure WebpayPlus for Testing
WebpayPlus.configureForTesting(commerceCode, apiKey, environment);

const webpayPlus = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));

module.exports = { webpayPlus, WebpayPlus };
