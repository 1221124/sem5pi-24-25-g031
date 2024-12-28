const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://sarmg031:zbNOoQ5G9709Svhv@sarmg031.1zt2e.mongodb.net/",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
    medicalCondition: {
      name: "MedicalConditionController",
      path: "../controllers/medicalConditionController"
    },
    allergy: {
      name: "AllergyController",
      path: "../controllers/allergyController"
    },
    patientMedicalRecord: {
      name: "PatientMedicalRecordController",
      path: "../controllers/patientMedicalRecordController"
    }
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    medicalCondition: {
      name: "MedicalConditionRepo",
      path: "../repos/medicalConditionRepo"
    },
    allergy: {
      name: "AllergyRepo",
      path: "../repos/allergyRepo"
    },
    patientMedicalRecord: {
      name: "PatientMedicalRecordRepo",
      path: "../repos/patientMedicalRecordRepo"
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../services/medicalConditionService"
    },
    allergy: {
      name: "AllergyService",
      path: "../services/allergyService"
    },
    patientMedicalRecord: {
      name: "PatientMedicalRecordService",
      path: "../services/patientMedicalRecordService"
    }
  },
};
