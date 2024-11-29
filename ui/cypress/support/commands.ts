// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// cypress/support/commands.js or commands.ts
import jwtDecode from 'jwt-decode';

Cypress.Commands.add('loginByAuth0Api', () => {
  cy.request({
    method: 'POST',
    url: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token',
    body: {
      grant_type: 'password',
      username: Cypress.env('username'),
      password: Cypress.env('password'),
      audience: Cypress.env('api_audience'),
      //scope: 'openid profile email',
      client_id: Cypress.env('client_id'),
      client_secret: Cypress.env('client_secret'),
    }
  }).then((response) => {
    const { access_token, id_token, expires_in } = response.body;

    const auth0State = {
      access_token,
      id_token,
      expires_in,
    };

    localStorage.setItem('auth0Cypress', JSON.stringify(auth0State));

    cy.visit('/');
  });
});

