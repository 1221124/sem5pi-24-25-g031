/// <reference types="cypress" />

describe('Patient E2E Tests', () => {
  const baseUrl = 'https://localhost:4200';

  beforeEach(() => {
    cy.loginRedirect('gui.cr04@gmail.com');

    cy.url().should('include', '/patient');
  });
  it('should display patient details', () => {
    cy.get('.patient-details').within(() => {
      cy.contains('First Name:').should('exist');
      cy.contains('Last Name:').should('exist');
      cy.contains('Date of Birth:').should('exist');
      cy.contains('Email:').should('exist');
      cy.contains('Phone Number:').should('exist');
    });
  });

  it('should open and close the edit email modal', () => {

    cy.get('button[aria-label="edit-email"]').click();
    cy.get('.modal-content').should('be.visible');

    cy.get('input#email').type('updated.email@example.com');
    cy.get('button').contains('Save').click();

    cy.get('.modal-content').should('be.visible');
  });

  it('should open and close the edit phone number modal', () => {
    cy.wait(1000);

    cy.get('button[aria-label="edit-phone-number"]').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('input#phoneNumber').clear().type('987654321');
    cy.get('button').contains('Save').click();
  });


  it('should remove the delete account button after deleting the patient', () => {

    cy.wait(2000);
    cy.get('.delete-button').contains('Delete Account').should('be.visible');


    cy.get('.delete-button').contains('Delete Account').click();

    cy.wait(2000);
    cy.get('.delete-button').should('not.exist');
    cy.get('.patient-details').should('not.exist');

  });

});
