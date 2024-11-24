describe('template spec', () => {

  beforeEach(() => {
    cy.visit('/patient');
    cy.intercept('GET', '/api/patient', {
      statusCode: 200,
      body: {
        Id: '12345',
        FullName: { FirstName: 'John', LastName: 'Doe' },
        DateOfBirth: '1990-01-01',
        Gender: 'Male',
        ContactInformation: { Email: 'john.doe@example.com', PhoneNumber: 123456789 },
        EmergencyContact: 987654321,
        AppointmentHistory: [
          { Start: '2023-11-01T09:00:00', End: '2023-11-01T10:00:00' }
        ]
      }
    }).as('getPatient');
  });
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })



})
