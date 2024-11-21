using System;
using DDDNetCore.Domain.Appointments;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.Appointments
{
    public class AppointmentNumberUnitTest
    {
        [Fact]
        public void Constructor_ValidValue_SetsValue()
        {
            // Arrange
            var appointmentNumber = new AppointmentNumber("12345");

            // Act & Assert
            Assert.Equal("12345", appointmentNumber.Value);
        }

        [Fact]
        public void Constructor_EmptyValue_ThrowsArgumentException()
        {
            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new AppointmentNumber(""));
            Assert.Equal("Appointment number cannot be empty", exception.Message);
        }

        [Fact]
        public void Constructor_NullValue_ThrowsArgumentException()
        {
            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new AppointmentNumber(null));
            Assert.Equal("Appointment number cannot be empty", exception.Message);
        }

        [Fact]
        public void ToString_ReturnsValue()
        {
            // Arrange
            var appointmentNumber = new AppointmentNumber("12345");

            // Act
            var result = appointmentNumber.ToString();

            // Assert
            Assert.Equal("12345", result);
        }

        [Fact]
        public void Equals_SameValue_ReturnsTrue()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("12345");

            // Act
            var result = appointmentNumber1.Equals(appointmentNumber2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_DifferentValue_ReturnsFalse()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("67890");

            // Act
            var result = appointmentNumber1.Equals(appointmentNumber2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Equals_Null_ReturnsFalse()
        {
            // Arrange
            var appointmentNumber = new AppointmentNumber("12345");

            // Act
            var result = appointmentNumber.Equals(null);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Equals_SameReference_ReturnsTrue()
        {
            // Arrange
            var appointmentNumber = new AppointmentNumber("12345");

            // Act
            var result = appointmentNumber.Equals(appointmentNumber);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void GetHashCode_SameValue_ReturnsSameHashCode()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("12345");

            // Act
            var hashCode1 = appointmentNumber1.GetHashCode();
            var hashCode2 = appointmentNumber2.GetHashCode();

            // Assert
            Assert.Equal(hashCode1, hashCode2);
        }

        [Fact]
        public void OperatorEquality_SameValue_ReturnsTrue()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("12345");

            // Act
            var result = appointmentNumber1 == appointmentNumber2;

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void OperatorEquality_DifferentValue_ReturnsFalse()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("67890");

            // Act
            var result = appointmentNumber1 == appointmentNumber2;

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void OperatorInequality_SameValue_ReturnsFalse()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("12345");

            // Act
            var result = appointmentNumber1 != appointmentNumber2;

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void OperatorInequality_DifferentValue_ReturnsTrue()
        {
            // Arrange
            var appointmentNumber1 = new AppointmentNumber("12345");
            var appointmentNumber2 = new AppointmentNumber("67890");

            // Act
            var result = appointmentNumber1 != appointmentNumber2;

            // Assert
            Assert.True(result);
        }
    }
}
