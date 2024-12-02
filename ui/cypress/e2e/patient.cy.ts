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
    cy.get('button').contains('Edit').eq(0).click();
    cy.get('.modal-content').should('be.visible');

    cy.get('input#email').type('updated.email@example.com');
    cy.get('button').contains('Save').click();

    // Verifica se houve um erro (erro 500 no backend)
    cy.get('.toast') // Substitua '.toast' por um seletor que indique o erro no seu frontend.
      .should('contain.text', 'There was an error updating the patient information');

    // Confirma que o modal permanece aberto após o erro
    cy.get('.modal-content').should('be.visible');
  });

  it('should open and close the edit phone number modal', () => {
    cy.get('button').contains('Edit').eq(1).click();
    cy.get('.modal-content').should('be.visible');
    cy.get('input#phoneNumber').type('987654321');
    cy.get('button').contains('Save').click();
    cy.get('.modal-content').should('not.exist');
  });

  it('should delete the patient account', () => {
    cy.get('.delete-button').contains('Delete Account').click();
    cy.get('.toast').should('contain.text', 'Patient deleted successfully!');
  });

});
