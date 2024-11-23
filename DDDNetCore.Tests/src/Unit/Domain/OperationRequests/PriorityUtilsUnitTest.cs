using System;
using DDDNetCore.Domain.OperationRequests;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.OperationRequests
{
    
    public class PriorityUtilsUnitTests
    {
        [Fact]
        public void ToString_WithValidPriority_ReturnsCorrectString()
        {
            // Act & Assert
            Assert.Equal("elective", PriorityUtils.ToString(Priority.ELECTIVE));
            Assert.Equal("urgent", PriorityUtils.ToString(Priority.URGENT));
            Assert.Equal("emergency", PriorityUtils.ToString(Priority.EMERGENCY));
        }

        [Fact]
        public void ToString_WithInvalidPriority_ReturnsEmptyString()
        {
            // Arrange
            Priority invalidPriority = (Priority)(-1);

            // Act
            var result = PriorityUtils.ToString(invalidPriority);

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void FromString_WithValidString_ReturnsCorrectPriority()
        {
            // Act & Assert
            Assert.Equal(Priority.ELECTIVE, PriorityUtils.FromString("elective"));
            Assert.Equal(Priority.URGENT, PriorityUtils.FromString("urgent"));
            Assert.Equal(Priority.EMERGENCY, PriorityUtils.FromString("emergency"));
        }

        [Fact]
        public void FromString_WithInvalidString_ThrowsArgumentException()
        {
            // Arrange
            var invalidString = "invalid";

            // Act & Assert
            var ex = Assert.Throws<ArgumentException>(() => PriorityUtils.FromString(invalidString));
            Assert.Equal("Invalid priority value", ex.Message);
        }

        [Fact]
        public void Equals_WithSamePriorities_ReturnsTrue()
        {
            // Act & Assert
            Assert.True(PriorityUtils.Equals(Priority.ELECTIVE, Priority.ELECTIVE));
            Assert.True(PriorityUtils.Equals(Priority.URGENT, Priority.URGENT));
            Assert.True(PriorityUtils.Equals(Priority.EMERGENCY, Priority.EMERGENCY));
        }

        [Fact]
        public void Equals_WithDifferentPriorities_ReturnsFalse()
        {
            // Act & Assert
            Assert.False(PriorityUtils.Equals(Priority.ELECTIVE, Priority.URGENT));
            Assert.False(PriorityUtils.Equals(Priority.URGENT, Priority.EMERGENCY));
            Assert.False(PriorityUtils.Equals(Priority.EMERGENCY, Priority.ELECTIVE));
        }
    }
}
