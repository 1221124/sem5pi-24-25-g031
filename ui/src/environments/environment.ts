import {HttpHeaders} from '@angular/common/http';

export const environment = {
  production: false,
  homeUrl: 'http://localhost:4200',
  tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
  loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=code&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=http://localhost:4200/callback&scope=openid%20profile%20email&prompt=login',
  usersApiUrl: 'http://localhost:5500/api/Users',
  operationRequests: 'http://localhost:5500/api/OperationRequest',
  operationTypes: 'http://localhost:5500/api/OperationTypes',
  staffs: 'http://localhost:5500/api/Staff',
  patients: 'http://localhost:5500/api/Patient',
  authConfig: {
    clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
    clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
    redirectUri: 'http://localhost:4200/callback',
    authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
    audience: 'https://api.sarmg031.com'
  }
};

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
