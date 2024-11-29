import '../support/commands.ts';

describe('Operation Requests E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('1220784@isep.ipp.pt'); // Use a valid email for login

    // Navigate to the 'Manage Operation Requests' page after login
    cy.get('.btn.btn-primary').contains('Manage Operation Requests').click();
    cy.url().should('include', '/operationRequests'); // Ensure we are on the operation requests page
  });

  it('should create a new operation request', () => {
    const patient = '202411000003';
    const operationType = 'ACL Reconstrution Surgery';
    const deadlineDate = '2024-12-01';
    const priority = ('URGENT').toUpperCase();

    // Open the modal to create a new operation request
    cy.get('button').contains('Create Operation Request').click();

    // Ensure the modal and the form elements are visible
    cy.get('select#patient').should('be.visible');
    cy.get('select#operationType').should('be.visible');
    cy.get('select#priority').should('be.visible');

    // Fill in the form fields
    cy.get('select#patient').select(patient);
    cy.get('select#operationType').select(operationType);
    cy.get('input#deadlineDate').type(deadlineDate);
    cy.get('select#priority').select(priority);

    // Submit the form to create the request
    cy.get('button').contains('Create Request').click();

    // Assert
    cy.get('table tbody tr').should('have.length.greaterThan', 1);

     cy.get('table tbody tr').last().should('contain.text', patient)
      .and('contain.text', operationType)
      .and('contain.text', deadlineDate)
      .and('contain.text', priority);  });

  it('should filter operation requests by operation type', () => {
    const operationType = 'ACL Reconstrution Surgery';

    // Act
    cy.get('select#filters\\.searchOperationType').select(operationType);
    cy.get('button').contains('Filter').click();

    // Assert
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).should('contain.text', operationType);
    });
  });

  it('should update an existing operation request', () => {
    const deadlineDate = '2024-12-15';
    const priority = ('ELECTIVE').toUpperCase();
    const status = ('ACCEPTED').toLowerCase();

    // Open the update modal for the first request
    cy.get('table tbody tr').first().find('.btn-update-request').click();

    // Ensure the modal is visible
    cy.get('.modal-content').should('be.visible');

    // Update the fields in the form
    cy.get('input#updateDeadlineDate').clear().type(deadlineDate);
    cy.get('select#updatePriority').select(priority);
    cy.get('select#status').select(status);

    // Submit the form to update the request
    cy.get('button').contains('Update Request').click();

    // Assert that the updated values appear in the table
    cy.get('table tbody tr').first().should('contain.text', deadlineDate)
      .and('contain.text', priority)
      .and('contain.text', status);
  });

  it('should delete an operation request', () => {
    cy.get('table tbody tr').first().find('.btn-delete-request').click();

    cy.get('button').contains('Confirm').click();

    // cy.get('.toast').should('contain.text', 'Operation Request deleted successfully');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should navigate through pagination', () => {
    // Navigate to next page
    cy.get('button').contains('Next').click();
    cy.get('span').should('contain.text', 'Page 2');

    // Navigate to previous page
    cy.get('button').contains('Previous').click();
    cy.get('span').should('contain.text', 'Page 1');
  });
});
