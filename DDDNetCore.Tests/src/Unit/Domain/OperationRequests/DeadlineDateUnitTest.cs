using System;
using DDDNetCore.Domain.OperationRequests;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.OperationRequests
{

    public class DeadlineDateUnitTest
    {
        [Fact]
        public void Constructor_WithValidDate_CreatesInstance()
        {
            // Arrange
            var validDate = new DateOnly(2024, 11, 20);

            // Act
            var deadlineDate = new DeadlineDate(validDate);

            // Assert
            Assert.Equal(validDate, deadlineDate.Date);
        }

        [Fact]
        public void Constructor_WithInvalidDateString_ThrowsFormatException()
        {
            // Arrange
            var invalidDateString = "invalid-date";

            // Assert                                  Act 
            var ex = Assert.Throws<FormatException>(() => DeadlineDate.Parse(invalidDateString));
            Assert.Equal("Invalid date format. Use yyyy-MM-dd.", ex.Message);
        }

        [Fact]
        public void Constructor_WithValidDateString_CreatesInstance()
        {
            // Arrange
            var validDateString = "2024-11-20";

            // Act
            var deadlineDate = new DeadlineDate(validDateString);

            // Assert
            Assert.Equal(new DateOnly(2024, 11, 20), deadlineDate.Date);
        }

        [Fact]
        public void ToString_ReturnsCorrectDateFormat()
        {
            // Arrange
            var validDate = new DateOnly(2024, 11, 20);
            var deadlineDate = new DeadlineDate(validDate);

            // Act
            var result = deadlineDate.ToString();

            // Assert
            Assert.Equal("2024-11-20", result);
        }

        [Fact]
        public void Parse_WithValidDateString_ReturnsDate()
        {
            // Arrange
            var validDateString = "2024-11-20";

            // Act
            var result = DeadlineDate.Parse(validDateString);

            // Assert
            Assert.Equal(new DateOnly(2024, 11, 20), result);
        }

        [Fact]
        public void Parse_WithInvalidDateString_ThrowsFormatException()
        {
            // Arrange
            var invalidDateString = "invalid-date";

            // Assert                                  Act 
            var ex = Assert.Throws<FormatException>(() => DeadlineDate.Parse(invalidDateString));
            Assert.Equal("Invalid date format. Use yyyy-MM-dd.", ex.Message); 
        }

        [Fact]
        public void Equals_WithSameDates_ReturnsTrue()
        {
            // Arrange
            var date1 = new DeadlineDate("2024-11-20");
            var date2 = new DeadlineDate("2024-11-20");

            // Act
            var areEqual = DeadlineDate.Equals(date1, date2);

            // Assert
            Assert.True(areEqual);
        }

        [Fact]
        public void Equals_WithDifferentDates_ReturnsFalse()
        {
            // Arrange
            var date1 = new DeadlineDate("2024-11-20");
            var date2 = new DeadlineDate("2024-11-21");

            // Act
            var areEqual = DeadlineDate.Equals(date1, date2);

            // Assert
            Assert.False(areEqual);
        }
    }
}
