const { WebpayPlus, Options, Environment } = require('transbank-sdk');

// Configuración del comercio en modo desarrollador
const commerceCode = '597055555532';
const apiKey = '01234567890123456789012345678901';

const options = new Options(commerceCode, apiKey, Environment.Integration);

const webpayPlus = new WebpayPlus.Transaction(options);

module.exports = webpayPlus;