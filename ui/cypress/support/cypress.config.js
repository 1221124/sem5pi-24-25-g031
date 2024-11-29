const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement your node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config; // Return the updated configuration if necessary
    },
      baseUrl: 'http://localhost:4200',
      chromeWebSecurity: false,
  },
    env: {
      username: "1220784@isep.ipp.pt",
      password: "Motokeros31!",
      client_id: "VWoR7eRRWIced0jJ3WO36QckEdEdTVNs",
      client_secret: "-b5qOsV4W0FE1Odi_-hyiguZbVhnOPuK2ZA_2gtRXma0Gt1YqbgECCuNRI3NTYpe",
      api_audience: "https://dev-q6k6pda68l05sqce.us.auth0.com/api/v2/"
    }
  }
);
