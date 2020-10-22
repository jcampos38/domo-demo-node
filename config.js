'use strict';

const tenantName    = "23b71ad0-0cec-49cc-adbf-ad7eb52167f3";
const clientID      = "aa2fbe63-69b7-4df9-bf47-25f13753558e";
const clientSecret  = "laZ_uXlkjNT.2L1P118i3OVgveGHA.1-xS";
const serverPort    = 3001;

module.exports.serverPort = serverPort;

module.exports.credentials = {
  identityMetadata: `https://login.microsoftonline.com/${tenantName}/v2.0/.well-known/openid-configuration`, 
  clientID: clientID,
  clientSecret: clientSecret,
  audience: ['aa2fbe63-69b7-4df9-bf47-25f13753558e', '1442849d-a597-42ba-bda2-d9620b40e845']
  // loggingLevel: 'info',
  // loggingNoPII: false
};