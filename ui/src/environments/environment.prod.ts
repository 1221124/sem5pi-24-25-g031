export const environment = {
  production: false,
  homeUrl: 'https://sarmg031.netlify.app',
  patientBackend: 'https://sem5pi-24-25-g031-production.up.railway.app/api',
  /*sarm*/
  usersApiUrl: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Users',
  operationRequests: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/OperationRequest',
  operationTypes: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/OperationTypes',
  enums: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Enums',
  staffs: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Staff',
  patients: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Patient',
  surgeryRooms: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/SurgeryRooms',
  roomTypes: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/RoomType',
  specializations: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Specialization',
  /*patient backend*/
  medicalConditions: 'https://sem5pi-24-25-g031-production.up.railway.app/api/medical-condition',
  allergies: 'https://sem5pi-24-25-g031-production.up.railway.app/api/allergy',
  patientMedicalRecord: 'https://sem5pi-24-25-g031-production.up.railway.app/api/patient-medical-record',
  /*algav*/
  prolog: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Prolog',
  appointments: 'https://sem5pi-24-25-g031-production-3753.up.railway.app/api/Appointments',
  three_d_module: 'https://3d-sarmg031.netlify.app',
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