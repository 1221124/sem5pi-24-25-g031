describe('Allergy Entry Form E2E Tests', () => {

  const baseUrl = 'https://localhost:4200';

  beforeEach(() => {
    cy.loginRedirect("1220784@isep.ipp.pt");
    cy.get('.btn.btn-primary', { timeout: 10000 }).contains('Manage Patients Medical Record').should('be.visible').click();
    cy.url().should('include', '/doctor/patients');
  });

  it('should display patients table and details', () => {
    cy.get('.get-patients').should('exist');
    cy.get('table thead').should('be.visible');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  describe('View Patient Medical Record', () => {
    beforeEach(() => {
      cy.visit('/admin/patients'); // Visita a página de administração dos pacientes

      // Clica no botão "View Medical Record" para navegar até o registro médico do paciente
      cy.get('button').contains('View Medical Record').first().click();

      // Verifica se a URL foi alterada corretamente para a página do registro médico
      cy.url().should('include', '/doctor/patients/patient-medical-record');

      // Verifica se os elementos da página de registro médico estão visíveis
      cy.get('h1').contains('Patient Medical Record').should('be.visible');
      cy.get('p').contains('Medical Record Number:').should('be.visible');
    });

    it('should open the patient medical record modal', () => {
      // Você pode adicionar outros testes aqui relacionados ao registro médico
    });
  });

  describe('Patient Medical Record Component', () => {

    describe('Medical Condition Entry Form', () => {
      beforeEach(() => {
        cy.get('button').contains('View Medical Record').first().click();

        // Verifica se a URL foi alterada corretamente para a página do registro médico
        cy.url().should('include', '/doctor/patients/patient-medical-record');
        cy.get('h1').contains('Patient Medical Record').should('be.visible');
        cy.get('p').contains('Medical Record Number:').should('be.visible');
      });

      it('should display allergy entry form correctly', () => {

        cy.get('.add-btn').contains('Add Allergies').should('be.visible').click({ force: true });
      });
    });
  });
});
