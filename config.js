'use strict';

const tenantName    = "23b71ad0-0cec-49cc-adbf-ad7eb52167f3";
const clientID      = "1442849d-a597-42ba-bda2-d9620b40e845";
const clientSecret  = "9vpN_zBU.lxplT5-o2-4oHH6r3bBO1L.Ay";
const serverPort    = 3000;

module.exports.serverPort = serverPort;

module.exports.credentials = {
  identityMetadata: `https://login.microsoftonline.com/${tenantName}/v2.0/.well-known/openid-configuration`, 
  clientID: clientID,
  clientSecret: clientSecret
};