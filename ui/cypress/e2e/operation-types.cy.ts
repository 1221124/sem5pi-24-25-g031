describe('OperationTypesComponent', () => {
  beforeEach(() => {
    cy.visit('/admin/operationTypes');
  });

  it('should display a list of operation types', () => {
    cy.intercept('GET', 'http://localhost:5500/api/operationTypes', {
      statusCode: 200,
      body: [
        {
          Id: '123e4567-e89b-12d3-a456-426614174000',
          Name: 'Operation 1',
          Specialization: 'Cardiology',
          RequiredStaff: [{ Role: 'Doctor', Specialization: 'Cardiology', Quantity: 1 }],
          PhasesDuration: { Preparation: 30, Surgery: 120, Cleaning: 15 },
          Status: 'Active'
        },
        {
          Id: '123e4567-e89b-12d3-a456-426614174001',
          Name: 'Operation 2',
          Specialization: 'Neurology',
          RequiredStaff: [{ Role: 'Nurse', Specialization: 'Neurology', Quantity: 2 }],
          PhasesDuration: { Preparation: 45, Surgery: 150, Cleaning: 20 },
          Status: 'Inactive'
        }
      ]
    }).as('getOperationTypes');
    cy.wait('@getOperationTypes');
    cy.get('table').should('be.visible');
    cy.get('tr').should('have.length', 2);
  });

  it('should create a new operation type when valid data is provided', () => {
    cy.intercept('POST', 'http://localhost:5500/api/operationTypes', {
      statusCode: 201,
      body: {
        Id: '123e4567-e89b-12d3-a456-426614174002',
        Name: 'New Operation',
        Specialization: 'Cardiology',
        RequiredStaff: [{ Role: 'Doctor', Specialization: 'Cardiology', Quantity: 2 }],
        PhasesDuration: { Preparation: 30, Surgery: 120, Cleaning: 15 },
        Status: 'Active'
      }
    }).as('createOperationType');

    cy.get('button').contains('Create Operation Type').click();
    cy.get('select[name="specialization"]').select('Cardiology');
    cy.get('input[name="operationName"]').type('New Operation');
    cy.get('input[name="preparationDuration"]').type('30');
    cy.get('input[name="surgeryDuration"]').type('120');
    cy.get('input[name="cleaningDuration"]').type('15');
    cy.get('select[name="newStaffRole"]').select('Doctor');
    cy.get('select[name="newStaffSpecialization"]').select('Cardiology');
    cy.get('input[name="newStaffQuantity"]').type('2');
    cy.get('button').contains('Add Staff').click();
    cy.get('button').contains('Submit Operation Type').click();
    cy.wait('@createOperationType');
    cy.contains('Operation Type successfully created!').should('be.visible');
  });

  it('should update an existing operation type', () => {
    cy.intercept('PUT', 'http://localhost:5500/api/operationTypes/123e4567-e89b-12d3-a456-426614174000', {
      statusCode: 200,
      body: {
        Id: '123e4567-e89b-12d3-a456-426614174000',
        Name: 'Updated Operation',
        Specialization: 'Neurology',
        RequiredStaff: [{ Role: 'Doctor', Specialization: 'Neurology', Quantity: 2 }],
        PhasesDuration: { Preparation: 60, Surgery: 180, Cleaning: 25 },
        Status: 'Active'
      }
    }).as('updateOperationType');

    cy.get('button').contains('Update').click();
    cy.get('input[name="operationName"]').clear().type('Updated Operation');
    cy.get('select[name="specialization"]').select('Neurology');
    cy.get('input[name="preparationDuration"]').clear().type('60');
    cy.get('input[name="surgeryDuration"]').clear().type('180');
    cy.get('input[name="cleaningDuration"]').clear().type('25');
    cy.get('button').contains('Submit Operation Type').click();
    cy.wait('@updateOperationType');
    cy.contains('Operation Type updated!').should('be.visible');
  });

  it('should activate an operation type', () => {
    cy.intercept('PUT', 'http://localhost:5500/api/operationTypes/123e4567-e89b-12d3-a456-426614174000', {
      statusCode: 200,
      body: {
        Id: '123e4567-e89b-12d3-a456-426614174000',
        Status: 'Active'
      }
    }).as('activateOperationType');

    cy.get('button').contains('Activate').click();
    cy.wait('@activateOperationType');
    cy.contains('Operation Type activated!').should('be.visible');
  });

  it('should inactivate an operation type', () => {
    cy.intercept('DELETE', 'http://localhost:5500/api/operationTypes/123e4567-e89b-12d3-a456-426614174000', {
      statusCode: 200,
      body: {}
    }).as('inactivateOperationType');

    cy.get('button').contains('Inactivate').click();
    cy.wait('@inactivateOperationType');
    cy.contains('Operation Type inactivated!').should('be.visible');
  });

  it('should filter operation types by specialization', () => {
    cy.get('select[name="specialization"]').select('Cardiology');
    cy.get('button').contains('Apply Filters').click();
    cy.get('tr').should('have.length', 1);
    cy.contains('Operation 1').should('be.visible');
    cy.contains('Operation 2').should('not.exist');
  });

  it('should show message when no operation types are available', () => {
    cy.intercept('GET', 'http://localhost:5500/api/operationTypes', {
      statusCode: 200,
      body: []
    }).as('getEmptyOperationTypes');
    
    cy.visit('/operationTypes');
    cy.wait('@getEmptyOperationTypes');
    cy.contains('No operation types available').should('be.visible');
  });
});