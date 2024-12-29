import '../support/commands.ts';

describe('Appointments Page E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('1220784@isep.ipp.pt');
    cy.wait(5000);
    cy.visit('/doctor/appointments');
    cy.url().should('include', '/doctor/appointments');
  });

  it('should show the "Schedule an Appointment" button for doctors', () => {
    cy.get('button').contains('Schedule an Appointment').should('be.visible');
  });

  it('should show the "Show Appointments" button when the form is active', () => {
    cy.get('button').contains('Show Appointments').should('be.visible');
  });

  it('should show the loading spinner when the data is being loaded', () => {
    cy.get('.loading-spinner').should('be.visible');
    cy.get('.spinner').should('exist');
    cy.get('h1').should('contain', 'LOADING');
    cy.get('p').should('contain', 'Please wait...');
  });

  it('should navigate to the appointment form when "Schedule an Appointment" is clicked', () => {
    cy.get('button').contains('Schedule an Appointment').click();
    cy.url().should('include', '/doctor/appointments/create');
    cy.get('app-appointments-form').should('exist');
  });

  it('should show the appointments list when "Show Appointments" is clicked', () => {
    cy.get('button').contains('Show Appointments').click();
    cy.url().should('include', '/doctor/appointments');
    cy.get('app-appointments-list').should('exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should display operation requests when "Schedule an Appointment" is clicked', () => {
    cy.get('button').contains('Schedule an Appointment').click();
    cy.get('app-operation-requests-table').should('exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should handle the "Back" button and return to the previous page', () => {
    cy.get('button').contains('Back').click();
    cy.url().should('include', '/doctor');
  });

  it('should allow appointment edit from the appointments list', () => {
    cy.get('button').contains('Show Appointments').click();
    cy.get('app-appointments-list').should('exist');
    cy.get('button').contains('Edit').first().click();
    cy.get('app-appointments-form').should('exist');
  });
});