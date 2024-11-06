export const environment = {
  production: false,
  tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
  loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=code&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=http://localhost:4200/callback&scope=openid%20profile%20email&prompt=login',
  usersApiUrl: 'http://localhost:5500/api/Users',
  operationRequests: 'http://localhost:5500/api/OperationRequests',
  staffs: 'http://localhost:5500/api/Staff',
  authConfig: {
    clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
    clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
    redirectUri: 'http://localhost:4200/callback',
    authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
    audience: 'https://api.sarmg031.com'
  }
};