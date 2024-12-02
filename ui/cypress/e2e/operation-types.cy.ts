import '../support/commands.ts';

describe('Operation Types E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('sarmg031@gmail.com');

    cy.wait(5000);
    cy.get('.btn.btn-primary').contains('Manage Operation Types').should('be.visible').click();
    cy.url().should('include', '/admin/operationTypes');
  });

  it('should create a new operation type', () => {
    const operationName = 'Hand Surgery';
    const specialization = 'Orthopaedics';

    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('input[name="operationName"]').type(operationName);
    cy.get('select[name="specialization"]').select(specialization);

    cy.get('select[name="newStaffRole"]').select('Nurse');
    cy.get('select[name="newStaffSpecialization"]').select('Orthopaedics');
    cy.get('input[name="newStaffQuantity"]').clear().type('2');
    cy.get('button').contains('Add Staff').click();

    cy.get('input[name="preparationDuration"]').clear().type('30');
    cy.get('input[name="surgeryDuration"]').clear().type('120');
    cy.get('input[name="cleaningDuration"]').clear().type('45');

    cy.get('button[type="submit"]').contains('Submit Operation Type').click();

    // cy.get('.success').should('exist').and('contain', 'Operation Type successfully created!');
    cy.get('table tbody tr').should('have.length.greaterThan', 1);
  });

  it('should update an existing operation type', () => {
    cy.get('input[placeholder="Filter by Name"]').type('Hip Replacement Surgery');
    cy.get('button').contains('Apply Filters').click();

    cy.get('table tbody tr').contains('Hand Surgery').parent().find('button').contains('Update').click();

    const updatedName = 'Updated Hand Surgery';

    cy.get('input[name="operationName"]').clear().type(updatedName);

    cy.get('button[type="submit"]').contains('Update Operation Type').click();

    cy.get('.success').should('exist').and('contain', 'Operation Type successfully updated!');
  });

  it('should filter operation types by name', () => {
    cy.get('input[placeholder="Filter by Name"]').type('Hip Replacement Surgery');
    cy.get('button').contains('Apply Filters').click();

    cy.get('table tbody tr').should('have.length', 1);
    cy.get('table tbody tr').first().should('contain', 'Hip Replacement Surgery');
  });
  it('should inactivate an operation type', () => {
    cy.get('input[placeholder="Filter by Name"]').type('Hip Replacement Surgery');
    cy.get('button').contains('Apply Filters').click();
    cy.get('table tbody tr').contains('Hip Replacement Surgery').parent().find('button').contains('Inactivate').click();

    cy.get('table tbody tr').contains('Hip Replacement Surgery').parent().should('contain', 'Inactive');
  });

  it('should activate an operation type', () => {
    cy.get('input[placeholder="Filter by Name"]').type('Hip Replacement Surgery');
    cy.get('button').contains('Apply Filters').click();
    cy.get('table tbody tr').contains('Hip Replacement Surgery').parent().find('button').contains('Activate').click();

    cy.get('table tbody tr').contains('Hip Replacement Surgery').parent().should('contain', 'Active');
  });

  it('should navigate back to the admin home', () => {
    cy.get('.btn.btn-outline-primary.back-btn').click();
    cy.url().should('include', '/admin');
  });

  it('should navigate through pagination', () => {
    cy.get('button').contains('Next').click();
    cy.get('span').should('contain.text', 'Page 2');

    cy.get('button').contains('Previous').click();
    cy.get('span').should('contain.text', 'Page 1');
  });
});
