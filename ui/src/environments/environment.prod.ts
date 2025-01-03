export const environment = {
  production: false,
  homeUrl: 'https://sarmg031.netlify.app',
  patientBackend: 'http://localhost:4000/api',
  /*sarm*/
  usersApiUrl: 'https://backend-sarmg031.azurewebsites.net/api/Users',
  operationRequests: 'https://backend-sarmg031.azurewebsites.net/api/OperationRequest',
  operationTypes: 'https://backend-sarmg031.azurewebsites.net/api/OperationTypes',
  enums: 'https://backend-sarmg031.azurewebsites.net/api/Enums',
  staffs: 'https://backend-sarmg031.azurewebsites.net/api/Staff',
  patients: 'https://backend-sarmg031.azurewebsites.net/api/Patient',
  surgeryRooms: 'https://backend-sarmg031.azurewebsites.net/api/SurgeryRooms',
  roomTypes: 'https://backend-sarmg031.azurewebsites.net/api/RoomType',
  specializations: 'https://backend-sarmg031.azurewebsites.net/api/Specialization',
  /*patient backend*/
  medicalConditions: 'http://localhost:4000/api/medical-condition',
  allergies: 'http://localhost:4000/api/allergy',
  patientMedicalRecord: 'http://localhost:4000/api/patient-medical-record',
  /*algav*/
  prolog: 'https://backend-sarmg031.azurewebsites.net/api/Prolog',
  appointments: 'https://backend-sarmg031.azurewebsites.net/api/Appointments',
  three_d_module: 'http://localhost:63342/3DVisualizationModule/Basic_Thumb_Raiser/Thumb_Raiser.html?_ijt=m86s9d2mdo8vjm4a4bb9u7udi7&_ij_reload=RELOAD_ON_SAVE',
  /*auth0*/
  authConfig: {
    clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
    clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
    redirectUri: 'https://sarmg031.netlify.app/callback',
    authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
    audience: 'https://api.sarmg031.com',
    logoutUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/v2/logout?client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&returnTo=https://sarmg031.netlify.app'
  },
  tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
  loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=https://sarmg031.netlify.app/callback&scope=openid%20profile%20email&prompt=login',
  downloadLoginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=https://sarmg031.netlify.app/patient/patient-medical-record/download&scope=openid%20profile%20email&prompt=login'
};

export const httpOptions = {
  contentType: 'application/json',
  observe: 'response' as const,
  accept: 'application/json'
};