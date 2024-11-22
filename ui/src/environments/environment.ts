export const environment = {
  production: false,
  homeUrl: 'http://localhost:4200',
  tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
  loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=http://localhost:4200/callback&scope=openid%20profile%20email&prompt=login',
  usersApiUrl: 'http://localhost:5500/api/Users',
  operationRequests: 'http://localhost:5500/api/OperationRequest',
  operationTypes: 'http://localhost:5500/api/OperationTypes',
  enums: 'http://localhost:5500/api/Enums',
  staffs: 'http://localhost:5500/api/Staff',
  patients: 'http://localhost:5500/api/Patient',
  surgeryRooms: 'http://localhost:5500/api/SurgeryRooms',
  prolog: 'http://localhost:5500/api/Prolog',
  three_d_module: 'http://localhost:63342/3DVisualizationModule/Basic_Thumb_Raiser/Thumb_Raiser.html?_ijt=fpr539t4ojcdr8oac0bkehc8j1&_ij_reload=RELOAD_ON_SAVE',
  authConfig: {
    clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
    clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
    redirectUri: 'http://localhost:4200/callback',
    authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
    audience: 'https://api.sarmg031.com'
  }
};

export const httpOptions = {
  contentType: 'application/json',
  observe: 'response' as const,
  accept: 'application/json'
};
