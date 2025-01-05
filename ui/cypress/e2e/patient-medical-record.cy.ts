describe('Allergy Entry Form E2E Tests', () => {

  const baseUrl = 'https://localhost:4200';

  beforeEach(() => {
    cy.loginRedirect("1220784@isep.ipp.pt");
    cy.get('.btn.btn-primary', { timeout: 10000 }).contains('Manage Patients Medical Record').should('be.visible').click(); // Aumenta o timeout
    cy.url().should('include', '/doctor/patients');
  });

  it('should display patients table and details', () => {
    cy.get('.get-patients').should('exist'); // Verifica se a tabela de pacientes existe
    cy.get('table thead').should('be.visible'); // Verifica se o cabeçalho da tabela está visível
    cy.get('table tbody tr').should('have.length.greaterThan', 0); // Certifica que há pacientes listados
  });

  describe('View Patient Medical Record', () => {
    beforeEach(() => {
      cy.visit('/admin/patients'); // Visita a página de administração dos pacientes
    });

    it('should open the patient medical record modal', () => {
      cy.get('button').contains('View Medical Record').first().click(); // Clica no botão para visualizar o registro médico

    });

  });

  describe('Patient Medical Record Component', () => {

    describe('Medical Condition Entry Form', () => {
      beforeEach(() => {
        cy.visit('/admin/patients/patient-medical-record'); // Visita a página de entrada de condição médica

        cy.get('h1').contains('Patient Medical Record').should('be.visible'); // Verifica o título
        cy.get('p').contains('Medical Record Number:').should('be.visible'); // Verifica informações principais
      });
    });
  });
});
