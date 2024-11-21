using System;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.Appointments
{
    public class AppointmentUnitTest
    {
        [Fact]
        public void Constructor_ValidInputs_CreatesInstance()
        {
            // Arrange
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var surgeryRoomNumber = SurgeryRoomNumber.OR1;
            var appointmentNumber = new AppointmentNumber("A123");
            var appointmentDate = new Slot(DateTime.Now.AddDays(1), DateTime.Now.AddDays(1).AddHours(2));

            // Act
            var appointment = new Appointment(operationRequestId, surgeryRoomNumber, appointmentNumber, appointmentDate);

            // Assert
            Assert.NotNull(appointment);
            Assert.Equal(operationRequestId, appointment.OperationRequestId);
            Assert.Equal(surgeryRoomNumber, appointment.SurgeryRoomNumber);
            Assert.Equal(appointmentNumber, appointment.AppointmentNumber);
            Assert.Equal(appointmentDate, appointment.AppointmentDate);
        }

        [Fact]
        public void Constructor_InvalidSlot_ThrowsBusinessRuleValidationException()
        {
            // Arrange
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var surgeryRoomNumber = SurgeryRoomNumber.OR1;
            var appointmentNumber = new AppointmentNumber("A123");

            // Assert
            Assert.Throws<BusinessRuleValidationException>(() => //Act 
                new Appointment(operationRequestId, surgeryRoomNumber, appointmentNumber, 
                    new Slot(DateTime.Now.AddDays(1), DateTime.Now.AddDays(1).AddHours(-1))));
        }


        [Fact]
        public void Constructor_DuplicateAppointments_AreNotEqual()
        {
            // Arrange
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var surgeryRoomNumber = SurgeryRoomNumber.OR1;
            var appointmentNumber = new AppointmentNumber("A123");
            var appointmentDate = new Slot(DateTime.Now.AddDays(1), DateTime.Now.AddDays(1).AddHours(2));

            var appointment1 = new Appointment(operationRequestId, surgeryRoomNumber, appointmentNumber, appointmentDate);
            var appointment2 = new Appointment(operationRequestId, surgeryRoomNumber, appointmentNumber, appointmentDate);

            // Assert
            Assert.NotEqual(appointment1, appointment2);
        }

        [Fact]
        public void Properties_Accessed_ReturnExpectedValues()
        {
            // Arrange
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var surgeryRoomNumber = SurgeryRoomNumber.OR2;
            var appointmentNumber = new AppointmentNumber("B456");
            var appointmentDate = new Slot(DateTime.Now.AddDays(2), DateTime.Now.AddDays(2).AddHours(3));

            var appointment = new Appointment(operationRequestId, surgeryRoomNumber, appointmentNumber, appointmentDate);

            // Assert
            Assert.Equal(operationRequestId, appointment.OperationRequestId);
            Assert.Equal(surgeryRoomNumber, appointment.SurgeryRoomNumber);
            Assert.Equal(appointmentNumber, appointment.AppointmentNumber);
            Assert.Equal(appointmentDate, appointment.AppointmentDate);
        }

        [Fact]
        public void Constructor_InvalidSurgeryRoomNumber_ThrowsArgumentException()
        {
            // Arrange
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var appointmentNumber = new AppointmentNumber("C789");
            var appointmentDate = new Slot(DateTime.Now.AddDays(3), DateTime.Now.AddDays(3).AddHours(4));

            // Assert
            Assert.Throws<ArgumentException>(() => // Act
                new Appointment(operationRequestId, SurgeryRoomNumberUtils.FromString(""), appointmentNumber, appointmentDate));
        }
    }
}
