export const environment = {
    production: true,
    homeUrl: 'https://black-bush-0ea41ce03.4.azurestaticapps.net/',
    tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
    loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=https://black-bush-0ea41ce03.4.azurestaticapps.net/callback&scope=openid%20profile%20email&prompt=login',
    usersApiUrl: 'https://sarmg031.azurewebsites.net/api/Users',
    verifyEmailUrl: 'https://sarmg031.azurewebsites.net/api/Users/verify',
    operationRequests: 'https://sarmg031.azurewebsites.net/api/OperationRequest',
    operationTypes: 'https://sarmg031.azurewebsites.net/api/OperationTypes',
    enums: 'https://sarmg031.azurewebsites.net/api/Enums',
    staffs: 'https://sarmg031.azurewebsites.net/api/Staff',
    patients: 'https://sarmg031.azurewebsites.net/api/Patient',
    surgeryRooms: 'https://sarmg031.azurewebsites.net/api/SurgeryRooms',
    prolog: 'https://sarmg031.azurewebsites.net/api/Prolog',
    appointments: 'https://sarmg031.azurewebsites.net/api/Appointments',
    three_d_module: 'http://localhost:63342/3DVisualizationModule/Basic_Thumb_Raiser/Thumb_Raiser.html?_ijt=fpr539t4ojcdr8oac0bkehc8j1&_ij_reload=RELOAD_ON_SAVE',
    authConfig: {
        clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
        clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
        redirectUri: 'https://black-bush-0ea41ce03.4.azurestaticapps.net/callback',
        authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
        audience: 'https://api.sarmg031.com'
    }
};

export const httpOptions = {
    contentType: 'application/json',
    observe: 'response' as const,
    accept: 'application/json'
};