describe('Operation Requests E2E Tests', () => {

  beforeEach(() => {
    cy.loginRedirect('sarmg031@gmail.com'); // Use a valid email for login

    cy.wait(5000);
    cy.get('.btn.btn-primary').contains('Manage Patients').should('be.visible').click();
    cy.url().should('include', '/admin/patients');
  });


  it('should display patients table and details', () => {
    cy.get('.get-patients').should('exist'); // Verifica se a tabela de pacientes existe
    cy.get('table thead').should('be.visible'); // Verifica se o cabeçalho da tabela está visível
    cy.get('table tbody tr').should('have.length.greaterThan', 0); // Certifica que há pacientes listados
  });

  it('should open and close the create patient-main modal', () => {
    cy.get('button').contains('Create Patient').click();
    cy.get('.modal-content').should('be.visible'); // Verifica se o modal está visível
    cy.get('.close').click();
    cy.get('.modal-content').should('not.exist'); // Verifica que o modal foi fechado
  });


  it('should create a new patient-main', () => {
    cy.get('button').contains('Create Patient').click();
    cy.get('input#firstName').type('John');
    cy.get('input#lastName').type('Doe');
    cy.get('input#date').type('1990-01-01');
    cy.get('select#gender').select('Male');
    cy.get('input#phoneNumber').type('123456789');
    cy.get('input#email').type('john.doe@example.com');

    cy.get('button.btn-create-patient').click(); // Clique para criar o paciente

    cy.get('.modal-content').should('not.exist'); // Verifica que o modal foi fechado
    cy.get('table tbody tr').last().within(() => {
      cy.contains('Bia'); // Verifica que o paciente foi adicionado à tabela
      cy.contains('Silva');
      cy.contains('bea.cr04@gmail.com');
      cy.contains('913455432');
    });
  });

  it('should edit a patient-main', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button.edit-button').click(); // Abre o modal de edição
    });

    cy.get('.modal-content').should('be.visible');
    cy.get('input#firstNameEdit').clear().type('Updated John');
    cy.get('input#lastNameEdit').clear().type('Updated Doe');
    cy.get('button').contains('Save Patient').click();

    cy.get('table tbody tr').first().within(() => {
      cy.contains('Updated John');
      cy.contains('Updated Doe');
    });
  });

  it('should delete a patient-main', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button.delete-button').click(); // Abre o modal de confirmação
    });

    cy.get('.modal-content').should('be.visible'); // Verifica que o modal está aberto
    cy.get('button.confirm-button').click(); // Confirma a exclusão

    cy.get('.modal-content').should('not.exist'); // Verifica que o modal foi fechado
    cy.get('table tbody tr').should('have.length.greaterThan', 0); // Verifica que os pacientes restantes ainda estão listados
  });

  it('should view appointment history', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('View').click(); // Abre o modal de histórico de compromissos
    });

    cy.get('.modal-content').should('be.visible'); // Verifica que o modal foi aberto
    cy.get('table').should('exist'); // Verifica que a tabela de histórico existe
    cy.get('.modal-content .close').click();
    cy.get('.modal-content').should('not.exist'); // Verifica que o modal foi fechado
  });

  it('should navigate back to admin home', () => {
    cy.get('button.button-back-admin').click();
    cy.url().should('not.include', '/patients'); // Verifica que o usuário foi redirecionado
  });

});
