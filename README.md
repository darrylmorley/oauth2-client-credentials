# Oauth2 Client Credentials

Usage example:

```TS
const oauthClient = new OAuthClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  tokenUrl: 'https:authorization-server.com/oauth/token',
});

const token = await oauthClient.getAccessToken();
console.log('Access Token:', token);
```
