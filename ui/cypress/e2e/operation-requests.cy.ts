  import '../support/commands.ts'

  describe('Operation Requests E2E Tests', () => {

    beforeEach(() => {
      cy.loginRedirect('1220784@isep.ipp.pt');
    });

    it('should display a list of operation requests', () => {
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
      cy.get('table thead th').should('contain.text', 'Request')
        .and('contain.text', 'Staff')
        .and('contain.text', 'Patient')
        .and('contain.text', 'Operation Type')
        .and('contain.text', 'Deadline Date')
        .and('contain.text', 'Priority')
        .and('contain.text', 'Status')
        .and('contain.text', 'Actions');
    });

    it('should filter operation requests by operation type', () => {
      cy.get('select#filters.searchOperationType').select('General Surgery');
      cy.get('button').contains('Filter').click();

      // Validate filtered results
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).should('contain.text', 'General Surgery');
      });
    });

    it('should create a new operation request', () => {
      cy.get('button').contains('Create Operation Request').click();

      // Fill the form in the modal
      cy.get('select#patient').select('Patient1');
      cy.get('select#operationType').select('Orthopedics');
      cy.get('input#deadlineDate').type('2024-12-01');
      cy.get('select#priority').select('Urgent');

      // Submit the form
      cy.get('button').contains('Create Request').click();

      // Assert success message and updated table
      cy.get('.toast').should('contain.text', 'Operation Request submitted successfully');
      cy.get('table tbody tr').should('have.length.greaterThan', 1);
    });

    it('should update an existing operation request', () => {
      // Open the update modal
      cy.get('table tbody tr').first().find('.btn-update-request').click();

      // Update fields in the modal
      cy.get('input#updateDeadlineDate').clear().type('2024-12-15');
      cy.get('select#updatePriority').select('Elective');
      cy.get('select#status').select('Accepted');

      // Submit the form
      cy.get('button').contains('Update Request').click();

      // Assert the changes in the table
      cy.get('table tbody tr').first().should('contain.text', 'Elective')
        .and('contain.text', 'Accepted');
    });

    it('should delete an operation request', () => {
      // Open the delete modal
      cy.get('table tbody tr').first().find('.btn-delete-request').click();

      // Confirm deletion
      cy.get('button').contains('Confirm').click();

      // Assert success message and updated table
      cy.get('.toast').should('contain.text', 'Operation Request deleted successfully');
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });

    it('should navigate through pagination', () => {
      cy.get('button').contains('Next').click();
      cy.get('span').should('contain.text', 'Page 2');
      cy.get('button').contains('Previous').click();
      cy.get('span').should('contain.text', 'Page 1');
    });
  });
