using Domain.Shared;
using Xunit;
using FluentAssertions;
using DDDNetCore.Domain.Surgeries;

namespace DDDNetCore.Tests.Unit.Domain.SurgeryRooms;

public class RoomCapacityUnitTest
{
    [Fact]
    public void Constructor_ShouldInitializeCapacityCorrectly_WhenIntegerIsProvided()
    {
        // Arrange
        var capacity = 50;

        // Act
        var roomCapacity = new RoomCapacity(capacity);

        // Assert
        roomCapacity.Capacity.Should().Be("50");
    }

    [Fact]
    public void Constructor_ShouldInitializeCapacityCorrectly_WhenStringIsProvided()
    {
        // Arrange
        var capacity = "75";

        // Act
        var roomCapacity = new RoomCapacity(capacity);

        // Assert
        roomCapacity.Capacity.Should().Be("75");
    }

    [Fact]
    public void Constructor_ShouldThrowException_WhenStringCapacityIsNotANumber()
    {
        // Act
        var act = () => new RoomCapacity("invalid");

        // Assert
        act.Should().Throw<BusinessRuleValidationException>().WithMessage("Room capacity must be a number");
    }

    [Fact]
    public void UpdateCapacity_ShouldUpdateCapacityCorrectly()
    {
        // Arrange
        var roomCapacity = new RoomCapacity(20);

        // Act
        roomCapacity.UpdateCapacity(30);

        // Assert
        roomCapacity.Capacity.Should().Be("30");
    }

    [Fact]
    public void ToString_ShouldReturnCorrectStringRepresentation()
    {
        // Arrange
        var roomCapacity = new RoomCapacity(100);

        // Act
        var result = roomCapacity.ToString();

        // Assert
        result.Should().Be("100");
    }

    [Fact]
    public void Constructor_ShouldHandleEdgeCase_WhenZeroCapacityIsProvided()
    {
        // Arrange
        var capacity = 0;

        // Act
        var roomCapacity = new RoomCapacity(capacity);

        // Assert
        roomCapacity.Capacity.Should().Be("0");
    }
}