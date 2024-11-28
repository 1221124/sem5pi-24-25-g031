/// <reference types="cypress" />

describe('Patient E2E Tests', () => {
  const baseUrl = 'https://localhost:4200';

  beforeEach(() => {

    cy.get('input#email').type('1221330@isep.ipp.pt');
    cy.get('input#password').type('Apresentacao1!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/staff')

    cy.visit('/patient');
  });

  it('should load and display a list of operation request', () => {

    cy.get('.operation-list').should('exist');
    cy.get('.operation-list thead tr th').each((header, index) => {
      const expectedHeaders = [
        'Description', 'Priority', 'Deadline', 'Patient',
        'Operation Type', 'Status', 'Actions'
      ];
      expect(header).to.have.text(expectedHeaders[index]);
    });
    cy.get('.operation-list tbody tr').should('have.length.greaterThan', 0);

  });



  it('should navigate to add operation request when "Create new Operation Request" is clicked', () => {
    cy.get('.button-container button').contains('Create new Operation Request').click();
    cy.url().should('include', '/request-operation');
  });

  it('should navigate to edit operation type when "Edit" is clicked', () => {

    cy.get('tbody tr').first().find('button').contains('Edit').click();


    cy.url().should('include', '/update-operation-type');
    cy.url().should('include', 'id=');
  });

  it('should navigate to deactivate operation type when "Deactivate" is clicked', () => {
    cy.get('tbody tr').first().find('button').contains('Deactivate').click();


    cy.url().should('include', '/inactive-operation-type');
    cy.url().should('include', 'id=');
  });

  //POST

  it('should display the form correctly', () => {
    cy.visit('/add-operation-type');
    cy.get('form.add-box').should('exist');
    cy.get('input#operationTypeName').should('exist');
    cy.get('input#preparationTime').should('exist');
    cy.get('input#surgeryTime').should('exist');
    cy.get('input#cleaningTime').should('exist');
    cy.get('input#listOfStaff').should('exist');
    cy.get('input#specialization').should('exist');
    cy.get('button[type="submit"]').contains('Register');
  });

  it('should validate required fields', () => {
    cy.visit('/add-operation-type');

    cy.get('button[type="submit"]').click();

    cy.get('input#operationTypeName:invalid').should('exist');
    cy.get('input#preparationTime:invalid').should('exist');
    cy.get('input#surgeryTime:invalid').should('exist');
    cy.get('input#cleaningTime:invalid').should('exist');
    cy.get('input#listOfStaff:invalid').should('exist');
    cy.get('input#specialization:invalid').should('exist');
  });

  it('should successfully register a new operation type', () => {
    cy.visit('/get-operation-type'); // A página onde a tabela com os tipos de operações é exibida

    // Interceptar a requisição GET inicial para carregar os tipos de operação
    cy.intercept('GET', `${baseUrl}/operation-types`, []).as('getOperationTypes');

    // Contar o número de linhas na tabela antes da criação
    cy.get('.operation-list table tbody tr').should('have.length.greaterThan', 0)
      .then(($rowsBefore) => {
        const initialRowCount = $rowsBefore.length;  // Armazenar o número de itens antes de criar

        // Interceptar a requisição POST ao criar um novo tipo de operação
        cy.intercept('POST', `${baseUrl}/operation-types`, {
          statusCode: 201,
          body: {
            id: 'T001',
            operationTypeName: 'Test Surgery',
            preparationTime: 30,
            surgeryTime: 90,
            cleaningTime: 20,
            listOfStaff: ['3 Doctors', '2 Nurses'],
            specialization: 'General Surgery',
            active: true,
          },
        }).as('createOperationType');

        // Interceptar a requisição GET após a criação para atualizar a tabela com o novo tipo de operação
        cy.intercept('GET', `${baseUrl}/operation-types`, [
          {
            id: 'T001',
            operationTypeName: 'Test Surgery',
            preparationTime: 30,
            surgeryTime: 90,
            cleaningTime: 20,
            listOfStaff: ['3 Doctors', '2 Nurses'],
            specialization: 'General Surgery',
            active: true,
          },
        ]).as('getOperationTypesAfterCreate');

        // Preencher o formulário de criação de tipo de operação
        cy.visit('/add-operation-type');  // Visitar a página onde o formulário está

        cy.get('input#operationTypeName').type('Test Surgery');
        cy.get('input#preparationTime').type('30');
        cy.get('input#surgeryTime').type('90');
        cy.get('input#cleaningTime').type('20');
        cy.get('input#listOfStaff').type('3 Doctors, 2 Nurses');
        cy.get('input#specialization').type('General Surgery');

        // Submeter o formulário
        cy.get('button[type="submit"]').click();

        // Verificar o redirecionamento e a mensagem de sucesso
        cy.on('window:alert', (text) => {
          expect(text).to.contains('Operation Type created successfully');
        });

        // Verificar que o número de linhas na tabela aumentou após a criação
        cy.get('.operation-list table tbody tr').should('have.length', initialRowCount + 1);
      });
  });



  it('should show an error if the operation type name already exists', () => {
    cy.visit('/add-operation-type');

    cy.intercept('GET', `${baseUrl}/operation-types`, [
      {
        id: 'R001',
        operationTypeName: 'Test Surgery',
        preparationTime: 30,
        surgeryTime: 90,
        cleaningTime: 20,
        listOfStaff: ['3 Doctors', '2 Nurses'],
        specilization: 'General Surgery',
        active: true,
      },
    ]).as('getOperationTypes');

    cy.get('input#operationTypeName').type('Test Surgery');
    cy.get('input#preparationTime').type('30');
    cy.get('input#surgeryTime').type('90');
    cy.get('input#cleaningTime').type('20');
    cy.get('input#listOfStaff').type('3 Doctors, 2 Nurses');
    cy.get('input#specialization').type('General Surgery');

    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Operation Type Name already exists');
    });
  });

  it('should show an error if the API request fails', () => {
    cy.visit('/add-operation-type');

    cy.intercept('POST', `${baseUrl}/operation-types`, {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('createOperationType');

    cy.get('input#operationTypeName').type('Error Surgery');
    cy.get('input#preparationTime').type('30');
    cy.get('input#surgeryTime').type('90');
    cy.get('input#cleaningTime').type('20');
    cy.get('input#listOfStaff').type('3 Doctors, 2 Nurses');
    cy.get('input#specialization').type('General Surgery');

    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error: Internal Server Error');
    });
  });







  //PUT


  it('should successfully update an operation type', () => {
    cy.intercept('PUT', `${baseUrl}/operation-types/715fcf1e-7bba-46ef-a268-f6028b44c217`, {
      statusCode: 200,
      body: {
        id: '715fcf1e-7bba-46ef-a268-f6028b44c217',
        operationTypeName: 'Updated Test Surgery',
        preparationTime: 40,
        surgeryTime: 100,
        cleaningTime: 30,
        listOfStaff: ['3 Doctors , 3 Nurses'],
        specialization: 'Updated General Surgery',
        active: true,
      },
    }).as('updateOperationType');

    cy.visit('/update-operation-type?id=715fcf1e-7bba-46ef-a268-f6028b44c217');  // Visiting the update page

    // Change some of the values
    cy.get('input#operationTypeName').clear().type('Updated Test Surgery');
    cy.get('input#preparationTime').clear().type('40');
    cy.get('input#surgeryTime').clear().type('100');
    cy.get('input#cleaningTime').clear().type('30');
    cy.get('input#listOfStaff').clear().type('3 Doctors, 3 Nurses');
    cy.get('input#specialization').clear().type('Updated General Surgery');

    cy.get('button[type="submit"]').click();



    cy.visit('/get-operation-type');
  });

  it('should show an error if the operation type name already exists during update', () => {
    cy.visit('/update-operation-type?id=715fcf1e-7bba-46ef-a268-f6028b44c217');

    cy.intercept('PUT', `${baseUrl}/operation-types/715fcf1e-7bba-46ef-a268-f6028b44c217`, {
      statusCode: 400,
      body: { message: 'Operation Type Name already exists' },
    }).as('updateOperationTypeError');

    cy.get('input#operationTypeName').clear().type('Test Surgery');  // Set to existing name

    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Operation Type Name already exists');
    });
  });

  it('should show an error if the API request fails during update', () => {
    cy.visit('/update-operation-type?id=715fcf1e-7bba-46ef-a268-f6028b44c217');

    cy.intercept('PUT', `${baseUrl}/operation-types/715fcf1e-7bba-46ef-a268-f6028b44c217`, {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('updateOperationTypeFail');

    cy.get('input#operationTypeName').clear().type('Error Surgery');
    cy.get('input#preparationTime').clear().type('30');
    cy.get('input#surgeryTime').clear().type('90');
    cy.get('input#cleaningTime').clear().type('20');
    cy.get('input#listOfStaff').clear().type('3 Doctors, 2 Nurses');
    cy.get('input#specialization').clear().type('General Surgery');

    cy.get('button[type="submit"]').click();


    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error: Internal Server Error');
    });
  });





  // SEARCH

  it('should search operation types by name', () => {
    cy.visit('/get-operation-type');  // Visit the search page

    // Intercept the GET request for searching by operation type name
    cy.intercept('GET', `${baseUrl}/operation-types?name=Test Surgery`, [
      {
        id: 'T001',
        operationTypeName: 'Test Surgery',
        preparationTime: 30,
        surgeryTime: 90,
        cleaningTime: 20,
        listOfStaff: ['3 Doctors', '2 Nurses'],
        specialization: 'General Surgery',
        active: true,
      },
    ]).as('searchOperationTypes');

    // Fill the search form with the name filter
    cy.get('select#filterType').select('name');
    cy.get('input#filter').type('Test Surgery');

    // Click the search button
    cy.get('button').contains('Search').click();

    // Assert that the table contains the correct data after the search
    cy.get('.operation-list table tbody tr')
      .should('have.length', 1)
      .first()
      .should('contain.text', 'Test Surgery');
  });

  it('should search operation types by specialization', () => {
    cy.visit('/get-operation-type');

    // Intercept the GET request for searching by specialization
    cy.intercept('GET', `${baseUrl}/operation-types?specialization=General Surgery`, [
      {
        id: 'T002',
        operationTypeName: 'General Surgery',
        preparationTime: 30,
        surgeryTime: 90,
        cleaningTime: 20,
        listOfStaff: ['3 Doctors', '2 Nurses'],
        specialization: 'General Surgery',
        active: true,
      },
    ]).as('searchBySpecialization');

    // Fill the search form with the specialization filter
    cy.get('select#filterType').select('Specialization');
    cy.get('input#filter').type('General Surgery');

    // Click the search button
    cy.get('button').contains('Search').click();



    cy.get('.operation-list table tbody tr')
      .should('have.length.greaterThan', 0)
      .first()
      .should('include.text', 'General Surgery');


  });

  it('should search operation types by active status', () => {
    cy.visit('/get-operation-type');

    // Intercept the GET request for searching by active status
    cy.intercept('GET', `${baseUrl}/operation-types?active=true`, [
      {
        id: 'T003',
        operationTypeName: 'Active Surgery',
        preparationTime: 30,
        surgeryTime: 90,
        cleaningTime: 20,
        listOfStaff: ['3 Doctors', '2 Nurses'],
        specialization: 'Active Surgery',
        active: true,
      },
    ]).as('searchByActiveStatus');

    // Fill the search form with the active status filter
    cy.get('select#filterType').select('active');
    cy.get('input#filter').type('true');

    // Click the search button
    cy.get('button').contains('Search').click();

    cy.get('.operation-list table tbody tr')
      .should('have.length.greaterThan', 0)
      .first()
      .should('include.text', 'true');


  });








  //INACTIVATE

  it('should display the inactivation UI correctly', () => {

    cy.visit('/inactive-operation-type?id=715fcf1e-7bba-46ef-a268-f6028b44c217');

    cy.get('.inactive-operation-type-container h2').should('contain.text', 'Inactivate Operation Type');


    cy.get('.button-group button').then((buttons) => {
      expect(buttons).to.have.length(2);
      expect(buttons.eq(0)).to.contain.text('Confirm');
      expect(buttons.eq(1)).to.contain.text('Cancel');
    });
  });


  it('should cancel the action and navigate back when "Cancel" is clicked', () => {

    cy.visit('/inactive-operation-type?id=715fcf1e-7bba-46ef-a268-f6028b44c217');

    cy.get('.button-group button').contains('Cancel').click();


    cy.url().should('not.include', '/inactive-operation-type');
  });


  it('should open a confirmation dialog when "Confirm" is clicked', () => {

    cy.visit('/inactive-operation-type?id=715fcf1e-7bba-46ef-a268-f6028b44c217');

    cy.intercept('GET', '**/operation-types/715fcf1e-7bba-46ef-a268-f6028b44c217', {
      statusCode: 200,
      body: { id: '124', operationTypeName: 'Test Operation', active: true },
    });


    cy.get('.button-group button').contains('Confirm').click();


    cy.get('.dialog-container h2').should('contain.text', 'Confirm Action');
    cy.get('.dialog-container p').should('contain.text', 'Are you sure that you want to inactive this operation type?');
  });



});
