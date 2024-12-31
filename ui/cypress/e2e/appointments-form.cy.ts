import '../support/commands.ts';

describe('Appointment Form E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('1220784@isep.ipp.pt');
    cy.wait(5000);
    cy.get('.btn.btn-primary').contains('Manage Appointments').should('be.visible').click();
    cy.url().should('include', '/doctor/appointments');
    cy.wait(2000);
  });

  it('should create a new appointment', () => {
    const surgeryRoom = 'OR1';
    const startDate = '2025-01-20 14:47';
    const assignedStaff = ['D20241 - David Sousa', 'D20243 - Beatriz Costa', 'D20244 - Aurora Magalhães', 'D20245 - Maria Leão', 'N20241 - Guilherme Ribeiro', 'N20242 - Mara Teixeira', 'N20243 - Simão Cunha', 'N20244 - Núria Sousa', 'T20241 - Tiago Carvalho'];

    cy.get('button').contains('Schedule an Appointment').click();

    cy.get('input type="datetime-local"]').clear().type(startDate);

    cy.get('select[name="surgeryRoom"]').select(surgeryRoom);

    assignedStaff.forEach(staff => {
      cy.get('input[type="checkbox"]').check(staff);
    });

    cy.get('button[type="submit"]').contains('Create Appointment').click();

    cy.wait(5000);

    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should show required staff for appointment', () => {
    cy.get('button').contains('Schedule an Appointment').click();

    cy.get('input type="datetime-local"]').clear().type('2025-01-20 18:00');

    cy.get('select[name="surgeryRoom"]').select('OR1');

    cy.get('h4').should('contain', 'Required Staff for this Appointment');
    cy.get('.list-group-item').should('have.length.greaterThan', 0);
  });

  it('should display staff options based on role and specialization', () => {
    cy.get('button').contains('Schedule an Appointment').click();

    cy.get('input type="datetime-local"]').clear().type('2025-01-20 18:00');

    cy.get('select[name="surgeryRoom"]').select('OR1');

    cy.get('h5').should('contain', 'Doctor - Orthopaedics');
    cy.get('input[type="checkbox"]').should('be.visible');
  });

  it('should allow staff selection for the appointment', () => {
    cy.get('button').contains('Schedule an Appointment').click();

    cy.get('input type="datetime-local"]').clear().type('2025-01-20 18:00');

    cy.get('select[name="surgeryRoom"]').select('OR3');

    cy.get('input[type="checkbox"]').first().check();
  });

  it('should disable the submit button when the form is invalid', () => {
    cy.get('button').contains('Schedule an Appointment').click();

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should update an existing appointment', () => {
    const surgeryRoom = 'OR1';
    const startDate = '2025-01-20 18:45';
    const assignedStaff = ['D20241 - David Sousa', 'D20243 - Beatriz Costa', 'D20244 - Aurora Magalhães', 'D20245 - Maria Leão', 'N20241 - Guilherme Ribeiro', 'N20242 - Mara Teixeira', 'N20243 - Simão Cunha', 'N20244 - Núria Sousa', 'T20241 - Tiago Carvalho'];

    cy.get('table tbody tr').first().find('button').contains('Edit').click();

    cy.get('input type="datetime-local"]').clear().type(startDate);

    cy.get('select[name="surgeryRoom"]').select(surgeryRoom);

    assignedStaff.forEach(staff => {
      cy.get('input[type="checkbox"]').check(staff);
    });

    cy.get('button[type="submit"]').contains('Update Appointment').click();

    cy.wait(5000);

    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should cancel the appointment creation', () => {
    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('button[type="button"]').contains('Cancel').click();

    cy.url().should('include', '/doctor/appointments');
  });
});