import '../support/commands.ts';

describe('Appointment Form E2E Tests', () => {
  beforeEach(() => {
    cy.loginRedirect('1220784@isep.ipp.pt');
    cy.wait(5000);
    cy.get('.btn.btn-primary').contains('Manage Appointments').should('be.visible').click();
    cy.url().should('include', '/doctor/appointments');

    cy.wait(5000);
    cy.get('.btn.btn-primary').contains('Schedule an Appointment').should('be.visible').click();
    cy.url().should('include', '/doctor/appointments/create');
  });

  it('should create a new appointment', () => {
    const surgeryRoom = 'Room 1';
    const startDate = '2024-12-30 09:00';
    const endDate = '2024-12-30 11:00';
    const assignedStaff = ['D20241', 'D20242'];

    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('input[name="appointmentDateStart"]').type(startDate);
    cy.get('input[name="appointmentDateEnd"]').type(endDate);

    cy.get('select[name="surgeryRoom"]').select(surgeryRoom);

    assignedStaff.forEach(staff => {
      cy.get('input[name="assignedStaff"]').type(staff);
      cy.get('button').contains('Add Staff').click();
    });

    cy.get('button[type="submit"]').contains('Create Appointment').click();

    cy.get('table tbody tr').should('have.length.greaterThan', 1);
  });

  it('should show required staff for appointment', () => {
    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('input[name="appointmentDateStart"]').type('2024-12-30 09:00');
    cy.get('input[name="appointmentDateEnd"]').type('2024-12-30 11:00');

    cy.get('select[name="surgeryRoom"]').select('Room 1');

    cy.get('h4').should('contain', 'Required Staff for this Appointment');
    cy.get('.list-group-item').should('have.length.greaterThan', 0);
  });

  it('should display staff options based on role and specialization', () => {
    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('input[name="appointmentDateStart"]').type('2024-12-30 09:00');
    cy.get('input[name="appointmentDateEnd"]').type('2024-12-30 11:00');

    cy.get('select[name="surgeryRoom"]').select('Room 1');

    cy.get('h5').should('contain', 'Doctor - Orthopaedics');
    cy.get('input[type="checkbox"]').should('be.visible');
  });

  it('should allow staff selection for the appointment', () => {
    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('input[name="appointmentDateStart"]').type('2024-12-30 09:00');
    cy.get('input[name="appointmentDateEnd"]').type('2024-12-30 11:00');

    cy.get('select[name="surgeryRoom"]').select('Room 1');

    cy.get('input[type="checkbox"]').first().check();

    cy.get('button[type="submit"]').contains('Create Appointment').click();

    cy.get('table tbody tr').should('have.length.greaterThan', 1);
  });

  it('should disable the submit button when the form is invalid', () => {
    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('button[type="submit"]').should('be.disabled');
    
    cy.get('input[name="appointmentDateStart"]').type('2024-12-30 09:00');
    cy.get('input[name="appointmentDateEnd"]').type('2024-12-30 11:00');
    cy.get('select[name="surgeryRoom"]').select('Room 1');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should update an existing appointment', () => {
    const updatedAppointmentNumber = 'A123-Updated';
    cy.get('input[placeholder="Filter by Appointment Number"]').type('A123');
    cy.get('button').contains('Apply Filters').click();

    cy.get('table tbody tr').contains('A123').parent().find('button').contains('Update').click();

    cy.get('input[name="appointmentDateStart"]').clear().type('2024-12-30 10:00');
    cy.get('input[name="appointmentDateEnd"]').clear().type('2024-12-30 12:00');

    cy.get('button[type="submit"]').contains('Update Appointment').click();

    cy.get('table tbody tr').should('contain', updatedAppointmentNumber);
  });

  it('should cancel the appointment creation', () => {
    cy.get('.btn.btn-primary.create-btn').click();

    cy.get('button[type="button"]').contains('Cancel').click();

    cy.url().should('include', '/doctor/appointments');
  });
});