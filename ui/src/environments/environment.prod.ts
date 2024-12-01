export const environment = {
    production: true,
    homeUrl: 'https://sarmg031.onrender.com',
    tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
    loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/callback&scope=openid%20profile%20email&prompt=login',
    usersApiUrl: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/Users',
    operationRequests: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/OperationRequest',
    operationTypes: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/OperationTypes',
    enums: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/Enums',
    staffs: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/Staff',
    patients: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/Patient',
    surgeryRooms: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/SurgeryRooms',
    prolog: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/Prolog',
    appointments: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/api/Appointments',
    three_d_module: 'https://backend-sarmg031-6a6528a6ecb5.herokuapp.com/3DVisualizationModule/Basic_Thumb_Raiser/Thumb_Raiser.html',  //TODO: correct this URL
    authConfig: {
        clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
        clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
        redirectUri: 'https://sarmg031.onrender.com/callback',
        authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
        audience: 'https://api.sarmg031.com'
    }
};

export const httpOptions = {
    contentType: 'application/json',
    observe: 'response' as const,
    accept: 'application/json'
};  