import '../support/commands.ts';

declare global {
  interface Window {
    isDoctor: boolean;
  }
}

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

  it('should navigate to the operation request selection when "Schedule an Appointment" is clicked', () => {
    cy.get('button').contains('Schedule an Appointment').click();
    cy.url().should('include', '/doctor/operation-requests');
    cy.get('app-operation-requests-table').should('exist');
  });

  it('should show the from when operation request is selected', () => {
    cy.get('button').contains('Schedule an Appointment').click();
    cy.get('app-operation-requests-table').should('exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.window().then((win) => {
      win.isDoctor = true;
    });
    cy.get('table tbody tr').first().find('button').contains('Convert to Appointment').click();
    cy.wait(2000);
    cy.url().should('include', '/doctor/appointments/create');
    cy.get('app-appointments-form').should('exist');
  });

  it('should handle the "Back" button and return to the previous page', () => {
    cy.get('button').contains('Back').click();
    cy.url().should('include', '/doctor');
  });

  it('should allow appointment edit from the appointments list', () => {
    cy.get('app-appointments-list').should('exist');
    cy.get('button').contains('Edit').first().click();
    cy.get('app-appointments-form').should('exist');
  });
});