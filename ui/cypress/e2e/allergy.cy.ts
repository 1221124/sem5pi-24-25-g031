describe('Allergy E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('sarmg031@gmail.com');

    cy.wait(5000);
    cy.get('.btn.btn-secondary').contains('Manage Allergies').should('be.visible').click();
    cy.url().should('include', '/admin/allergy');
  });

  it('should display allergies table and details', () => {
    cy.get('app-allergy-table').should('exist');
    cy.get('table thead').should('be.visible');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should open and close the create allergy modal', () => {
    cy.get('button').contains('Add Allergy').click();
    cy.get('app-create-allergy .modal-content').should('be.visible'); // Modal de criação visível
    cy.get('.close').click();
    cy.get('app-create-allergy .modal-content').should('not.exist'); // Modal fechado
  });



  it('should create a new allergy', () => {
    cy.get('button').contains('Add Allergy').click();
    cy.get('input#code').type('DA97');
    cy.get('input#name').type('Peanut Allergy');
    cy.get('input#description').type('Severe allergic reaction to peanuts.');

    cy.get('button.btn-create-request').click();
    cy.get('.modal-content').should('not.exist');

    cy.get('table tbody tr').last().within(() => {
      cy.contains('DA97');
      cy.contains('Peanut Allergy');
      cy.contains('Severe allergic reaction to peanuts.');
    });
  });
  
  it('should edit an allergy', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button.edit-button').click(); // Abre o modal de edição
    });

    cy.get('app-update-allergy .modal-content').should('be.visible');
    cy.get('textarea#description').clear().type('Updated Description.');
    cy.get('button').contains('Save').click();

    cy.get('table tbody tr').first().within(() => {
      cy.contains('Updated Description.');
    });
  });

  it('should delete an allergy', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button.delete-button').click();
    });

    cy.get('.delete-allergy').should('be.visible');
    cy.get('button.btn-delete').click();

    cy.get('.delete-allergy').should('not.exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

});
