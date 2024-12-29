import '../support/commands.ts';

describe('Appointments List E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('1220784@isep.ipp.pt');
    cy.wait(5000);
    cy.get('.btn.btn-primary').contains('Manage Appointments').should('be.visible').click();
    cy.url().should('include', '/doctor/appointments');
  });

  it('should display appointments in the list', () => {
    cy.get('table').should('be.visible');
    cy.get('thead').contains('th', 'Code');
    cy.get('thead').contains('th', 'Request Code');
    cy.get('thead').contains('th', 'Surgery Room');
    cy.get('thead').contains('th', 'Appointment Date');
    cy.get('thead').contains('th', 'Assigned Staff');
    
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(0).should('not.be.empty');
      cy.wrap($row).find('td').eq(1).should('not.be.empty');
      cy.wrap($row).find('td').eq(2).should('not.be.empty');
      cy.wrap($row).find('td').eq(3).should('not.be.empty');
      cy.wrap($row).find('td').eq(4).should('not.be.empty');
    });
  });

  it('should filter appointments by request code', () => {
    cy.get('input[placeholder="Filter by Request Code"]').type('REQ456');
    cy.get('button').contains('Apply Filters').click();

    cy.get('table tbody tr').should('have.length', 1);
    cy.get('table tbody tr').first().should('contain', 'REQ456');
  });

  it('should navigate through pages', () => {
    cy.get('button').contains('Next').click();
    cy.get('span').should('contain.text', 'Page 2');

    cy.get('button').contains('Previous').click();
    cy.get('span').should('contain.text', 'Page 1');
  });

  it('should navigate back to the admin home', () => {
    cy.get('.btn.btn-outline-primary.back-btn').click();
    cy.url().should('include', '/admin');
  });
});