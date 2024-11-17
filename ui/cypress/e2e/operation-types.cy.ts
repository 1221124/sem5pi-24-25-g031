describe('OperationTypesComponent E2E Tests with Backend Isolation', () => {
  beforeEach(() => {
    cy.clock();
    cy.intercept('GET', 'http://localhost:5500/api/OperationTypes', {
      statusCode: 200,
      delayMs: 1000,
      body: {
        operationTypes: [
          { Id: '1', Name: 'Heart Surgery', Specialization: 'Cardiology', Status: 'Active' },
          { Id: '2', Name: 'Knee Surgery', Specialization: 'Orthopedics', Status: 'Inactive' },
        ],
        totalItems: 2,
      },
    }).as('getOperationTypes');
  });

  it('Should display the list of operation types and allow filtering', () => {
    cy.visit('/admin/operationTypes');
    cy.wait('@getOperationTypes');
    cy.get('tbody tr').should('have.length', 2);
    cy.intercept('GET', 'http://localhost:5500/api/OperationTypes*name=Heart*', {
      statusCode: 200,
      delayMs: 1000,
      body: {
        operationTypes: [{ Id: '1', Name: 'Heart Surgery', Specialization: 'Cardiology', Status: 'Active' }],
        totalItems: 1,
      },
    }).as('filterOperationTypes');
    cy.get('input[placeholder="Filter by Name"]').type('Heart');
    cy.get('button').contains('Apply Filters').click();
    cy.wait('@filterOperationTypes');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').first().contains('Heart Surgery');
  });

  it('Should open the create form and add a new operation type', () => {
    cy.visit('/admin/operationTypes');
    cy.wait('@getOperationTypes');
    cy.get('.create-btn').click();
    cy.get('form').should('be.visible');
    cy.get('input[name="operationName"]').type('Brain Surgery');
    cy.get('select[name="specialization"]').select('Neurosurgery');
    cy.get('input[id="preparationDuration"]').type('30');
    cy.get('input[id="surgeryDuration"]').type('120');
    cy.get('input[id="cleaningDuration"]').type('15');
    cy.get('select[name="newStaffRole"]').select('Nurse');
    cy.get('select[name="newStaffSpecialization"]').select('General');
    cy.get('input[id="newStaffQuantity"]').clear().type('3');
    cy.get('button').contains('Add Staff').click();
    cy.intercept('POST', 'http://localhost:5500/api/OperationTypes', {
      statusCode: 201,
      body: { message: 'Operation Type successfully created!' },
    }).as('createOperationType');
    cy.get('button[type="submit"]').contains('Submit Operation Type').click();
    cy.wait('@createOperationType');
    cy.contains('Operation Type successfully created!').should('be.visible');
  });

  it('Should paginate through operation types', () => {
    cy.visit('/admin/operationTypes');
    cy.wait('@getOperationTypes');
    cy.intercept('GET', 'http://localhost:5500/api/OperationTypes?pageNumber=2', {
      statusCode: 200,
      body: {
        operationTypes: [
          { Id: '3', Name: 'Shoulder Surgery', Specialization: 'Orthopedics', Status: 'Active' },
          { Id: '4', Name: 'Eye Surgery', Specialization: 'Ophthalmology', Status: 'Inactive' },
        ],
        totalItems: 4,
      },
    }).as('getPage2');
    cy.get('.pagination').contains('Next').click();
    cy.wait('@getPage2');
    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr').first().contains('Shoulder Surgery');
  });

  it('Should update an existing operation type', () => {
    cy.visit('/admin/operationTypes');
    cy.wait('@getOperationTypes');
    cy.intercept('PUT', 'http://localhost:5500/api/OperationTypes/1', {
      statusCode: 200,
      body: { message: 'Operation Type successfully updated!' },
    }).as('updateOperationType');
    cy.get('tbody tr').first().find('button').contains('Update').click();
    cy.get('form').should('be.visible');
    cy.get('input[name="operationName"]').clear().type('Heart Surgery - Updated');
    cy.get('button[type="submit"]').contains('Update Operation Type').click();
    cy.wait('@updateOperationType');
    cy.contains('Operation Type successfully updated!').should('be.visible');
  });

  it('Should activate and inactivate operation types', () => {
    cy.visit('/admin/operationTypes');
    cy.wait('@getOperationTypes');
    cy.intercept('PUT', 'http://localhost:5500/api/OperationTypes/2', {
      statusCode: 200,
      body: { message: 'Operation Type successfully updated to Active!' },
    }).as('activateOperationType');
    cy.intercept('DELETE', 'http://localhost:5500/api/OperationTypes/1', {
      statusCode: 200,
      body: { message: 'Operation Type successfully deleted!' },
    }).as('inactivateOperationType');
    cy.get('tbody tr').last().find('button').contains('Activate').click();
    cy.wait('@activateOperationType');
    cy.contains('Operation Type successfully updated to Active!').should('be.visible');
    cy.get('tbody tr').first().find('button').contains('Inactivate').click();
    cy.wait('@inactivateOperationType');
    cy.contains('Operation Type successfully deleted!').should('be.visible');
  });
});