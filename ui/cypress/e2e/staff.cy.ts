import '../support/commands.ts';

describe('Staff E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('sarmg031@gmail.com');
    cy.get('.btn.btn-secondary').contains('Manage Staffs').should('be.visible').click();
    cy.url().should('include', '/admin/staffs');
  });

  describe('Initial Page Load', () => {
    it('Should display the Staff Management page correctly', () => {
      cy.contains('h1', 'Staffs').should('exist');
      cy.contains('button', 'Back to Admin Home').should('exist');
      cy.contains('button', 'Create Staff').should('exist');
    });
  });

  describe('Create Staff', () => {
    it('Should open and close the Create Staff modal', () => {
      cy.contains('button', 'Create Staff').click();
      cy.get('.modal-content').should('be.visible');
      cy.get('.modal-content .close').click();
      cy.get('.modal-content').should('not.exist');
    });

    it('Should validate required fields in Create Staff form', () => {
      cy.contains('button', 'Create Staff').click();
      cy.contains('button', 'Submit').click();
    });

    it('Should open and submit the Create Staff form', () => {
      cy.contains('Create Staff').click();
      cy.get('.modal-content').should('be.visible');

      cy.get('input#firstName').type('John');
      cy.get('input#lastName').type('Doe');
      cy.get('input#email').type('john.doe@example.com');
      cy.get('input#phoneNumber').type('123456789');
      cy.get('.modal-content form select#specialization')
        .should('be.visible')
        .select('Cardiology');
      cy.get('#Doctor').check();

      cy.contains('Submit').click();
    });
  });

  describe('Filters', () => {
    it('Should filter staff by name', () => {
      cy.get('input[name="name"]').type('John Doe', { force: true });
      cy.contains('button', 'Apply Filters').click();

      cy.get('table tbody', { timeout: 10000 })
        .should('be.visible')
        .contains('td', 'John')
        .should('exist');

      cy.contains('button', 'Clear Filters').click();
    });
  });

  describe('Edit Staff', () => {
    it('Should edit a staff and update their information', () => {
      cy.contains('button', 'Next').click();
      cy.contains('span', 'Page 2 of').should('exist');

      cy.get('button.action-btn.edit-btn').should('be.visible').as('editBtn');
      cy.get('button.action-btn.edit-btn').first().click();

      cy.get('.modal').should('be.visible');
      cy.get('input#phoneNumberEdit').clear().type('123123123');
      cy.contains('button', 'Save').click();
    });
  });

  describe('Activate/Deactivate Staff', () => {
    it('Should deactivate and reactivate a staff', () => {
      cy.contains('button', 'Next').click();
      cy.contains('span', 'Page 2 of').should('exist');

      cy.contains('button', 'Inactivate').first().click();
      cy.get('table tbody').contains('td', 'Inactive').should('exist');

      cy.contains('button', 'Activate').first().click();
      cy.get('table tbody').contains('td', 'Active').should('exist');
    });
  });

  describe('Pagination', () => {
    it('Should navigate between pages', () => {
      cy.contains('button', 'Next').click();
      cy.contains('span', 'Page 2 of').should('exist');

      cy.contains('button', 'Previous').click();
      cy.contains('span', 'Page 1 of').should('exist');
    });
  });
});
