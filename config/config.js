'use strict';

const tenantName    = process.env.MSAL_TENANT_NAME;
const clientID      = process.env.MSAL_CLIENT_ID;
const clientSecret  = process.env.MSAL_CLIENT_SECRET;
const serverPort    = 3001;

module.exports.serverPort = serverPort;

module.exports.credentials = {
  identityMetadata: `https://login.microsoftonline.com/${tenantName}/v2.0/.well-known/openid-configuration`, 
  clientID: clientID,
  clientSecret: clientSecret,
  audience: [process.env.MSAL_AUDIENCE1, process.env.MSAL_AUDIENCE2]
  // loggingLevel: 'info',
  // loggingNoPII: false
};