import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    env: {
      operationTypesUrl: "/OperationTypes",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
