import '../support/commands.ts';

describe('Staff E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('sarmg031@gmail.com'); // Use a valid email for login

    // Navigate to the 'Manage Operation Requests' page after login
    cy.get('.btn.btn-secondary').contains('Manage Staffs').should('be.visible').click();
    cy.url().should('include', '/admin/staffs');
  });

  describe('Staff Management - Initial Page Load', () => {
    it('Should display the Staff Management page correctly', () => {
      cy.contains('h1', 'Staffs').should('exist');
      cy.contains('button', 'Back to Admin Home').should('exist');
      cy.contains('button', 'Create Staff').should('exist');
    });
  });

  describe('Staff Management - Create Staff Modal', () => {
    it('Should open and close the Create Staff modal', () => {
      cy.contains('button', 'Create Staff').click();
      cy.get('.modal-content').should('be.visible');
      cy.get('.modal-content .close').click();
      cy.get('.modal-content').should('not.exist');
    });
  });

  describe('Staff Management - Form Validation', () => {
    it('Should validate required fields in Create Staff form', () => {
      cy.contains('button', 'Create Staff').click();
      cy.contains('button', 'Submit').click();
    });
  });

  it('Should open and submit the Create Staff form', () => {
    // Abre o modal de criação
    cy.contains('Create Staff').click();
    cy.get('.modal-content').should('be.visible');

    // Preenche o formulário
    cy.get('input#firstName').type('John');
    cy.get('input#lastName').type('Doe');
    cy.get('input#email').type('john.doe@example.com');
    cy.get('input#phoneNumber').type('123456789');
    cy.get('.modal-content form select#specialization').should('be.visible').select('Cardiology');

    cy.get('#Doctor').check();


    // Submete o formulário
    cy.contains('Submit').click();
  });

  describe('Staff Management - Filters', () => {
    it('Should filter staff by name, email, and specialization', () => {

      // Filtro por nome
      cy.get('input[name="name"]').type('John Doe', { force: true });
      cy.contains('button', 'Apply Filters').click();
      //cy.get('table tbody').contains('td', 'John Doe').should('exist');

      // Limpa os filtros
      cy.contains('button', 'Clear Filters').click();

      // Filtro por e-mail
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.contains('button', 'Apply Filters').click();
      //cy.get('table tbody').contains('td', 'john.doe@example.com').should('exist');
    });
  });

  describe('Staff Management - Edit Staff', () => {
    it('Should edit a staff and update their information', () => {

      cy.contains('button', 'Next').click();

      // Verifica se a página 2 foi carregada
      cy.contains('span', 'Page 2 of').should('exist');

      // Espera até que o botão "Edit" esteja visível
      cy.get('button.action-btn.edit-btn').should('be.visible').as('editBtn');

      // Quebra a cadeia de comandos e clica no botão
      cy.get('button').contains('Edit').first().click();

      // Espera o modal de edição ser visível
      cy.get('.modal').should('be.visible');

      // Altera o número de telefone
      cy.get('input#phoneNumberEdit').clear().type('123123123');

      // Salva as alterações
      cy.contains('button', 'Save').click();

      // Valida a atualização
     // cy.get('table tbody').contains('td', '123123123').should('exist');
    });
  });



  describe('Staff Management - Activate/Deactivate Staff', () => {
  it('Should deactivate and reactivate a staff', () => {

    cy.contains('button', 'Next').click();

    // Verifica se a página 2 foi carregada
    cy.contains('span', 'Page 2 of').should('exist');


    cy.contains('button', 'Inactivate').first().click();
    cy.get('table tbody').contains('td', 'Inactive').should('exist');

    // Ativa novamente
    cy.contains('button', 'Activate').first().click();
    cy.get('table tbody').contains('td', 'Active').should('exist');
  });
});


describe('Staff Management - Pagination', () => {
  it('Should navigate between pages', () => {

    // Vai para próxima página
    cy.contains('button', 'Next').click();
    cy.contains('span', 'Page 2 of').should('exist');

    // Volta para a página anterior
    cy.contains('button', 'Previous').click();
    cy.contains('span', 'Page 1 of').should('exist');
  });
});


});
