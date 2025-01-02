export const environment = {
  production: false,
  homeUrl: 'https://gray-beach-096809203.4.azurestaticapps.net',
  patientBackend: 'http://localhost:4000/api',
  /*sarm*/
  usersApiUrl: 'http://backend-sarmg031.azurewebsites.net/api/Users',
  operationRequests: 'http://backend-sarmg031.azurewebsites.net/api/OperationRequest',
  operationTypes: 'http://backend-sarmg031.azurewebsites.net/api/OperationTypes',
  enums: 'http://backend-sarmg031.azurewebsites.net/api/Enums',
  staffs: 'http://backend-sarmg031.azurewebsites.net/api/Staff',
  patients: 'http://backend-sarmg031.azurewebsites.net/api/Patient',
  surgeryRooms: 'http://backend-sarmg031.azurewebsites.net/api/SurgeryRooms',
  roomTypes: 'http://backend-sarmg031.azurewebsites.net/api/RoomType',
  specializations: 'http://backend-sarmg031.azurewebsites.net/api/Specialization',
  /*patient backend*/
  medicalConditions: 'http://localhost:4000/api/medical-condition',
  allergies: 'http://localhost:4000/api/allergy',
  patientMedicalRecord: 'http://localhost:4000/api/patient-medical-record',
  /*algav*/
  prolog: 'http://backend-sarmg031.azurewebsites.net/api/Prolog',
  appointments: 'http://backend-sarmg031.azurewebsites.net/api/Appointments',
  three_d_module: 'http://localhost:63342/3DVisualizationModule/Basic_Thumb_Raiser/Thumb_Raiser.html?_ijt=m86s9d2mdo8vjm4a4bb9u7udi7&_ij_reload=RELOAD_ON_SAVE',
  /*auth0*/
  authConfig: {
    clientId: 'ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn',
    clientSecret: 'NnTGmyVIeaoTO9SfHdPRs5wVMpQJrdq_fbkUlkwxy5xfCJiARpsxrGZMY9LnBeSR',
    redirectUri: 'https://gray-beach-096809203.4.azurestaticapps.net/callback',
    authDomain: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/',
    audience: 'https://api.sarmg031.com',
    logoutUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/v2/logout?client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&returnTo=https://gray-beach-096809203.4.azurestaticapps.net'
  },
  tokenUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
  loginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=https://gray-beach-096809203.4.azurestaticapps.net/callback&scope=openid%20profile%20email&prompt=login',
  downloadLoginUrl: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=token&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=https://gray-beach-096809203.4.azurestaticapps.net/patient/patient-medical-record/download&scope=openid%20profile%20email&prompt=login'
};

export const httpOptions = {
  contentType: 'application/json',
  observe: 'response' as const,
  accept: 'application/json'
};