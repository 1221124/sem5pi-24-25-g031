namespace DDDNetCore.Tests.Unit.Domain.SurgeryRooms;

using Xunit;
using FluentAssertions;
using DDDNetCore.Domain.Surgeries;

public class CurrentStatusUtilsUnitTest
{
    [Fact]
    public void ToString_ShouldReturnCorrectString_ForStatusOccupied()
    {
        // Act
        var result = CurrentStatusUtils.ToString(CurrentStatus.OCCUPIED);

        // Assert
        result.Should().Be("Occupied");
    }
    
    [Fact]
    public void ToString_ShouldReturnCorrectString_ForStatusAvailable()
    {
        // Act
        var result = CurrentStatusUtils.ToString(CurrentStatus.AVAILABLE);

        // Assert
        result.Should().Be("Available");
    }
    
    [Fact]
    public void ToString_ShouldReturnCorrectString_ForStatusUnderMaintenance()
    {
        // Act
        var result = CurrentStatusUtils.ToString(CurrentStatus.UNDER_MAINTENANCE);

        // Assert
        result.Should().Be("Under Maintenance");
    }

    [Fact]
    public void FromString_ShouldReturnCorrectStatus_ForStringOccupied()
    {
        // Act
        var result = CurrentStatusUtils.FromString("Occupied");

        // Assert
        result.Should().Be(CurrentStatus.OCCUPIED);
    }
    
    [Fact]
    public void FromString_ShouldReturnCorrectStatus_ForStringAvailable()
    {
        // Act
        var result = CurrentStatusUtils.FromString("Available");

        // Assert
        result.Should().Be(CurrentStatus.AVAILABLE);
    }
    
    [Fact]
    public void FromString_ShouldReturnCorrectStatus_ForStringUnderMaintenance()
    {
        // Act
        var result = CurrentStatusUtils.FromString("Under Maintenance");

        // Assert
        result.Should().Be(CurrentStatus.UNDER_MAINTENANCE);
    }
    

    [Fact]
    public void FromString_ShouldReturnDefaultStatus_ForInvalidString()
    {
        // Act
        var result = CurrentStatusUtils.FromString("invalid-string");

        // Assert
        result.Should().Be(CurrentStatus.AVAILABLE); // Default behavior
    }

    [Fact]
    public void ToString_ShouldReturnUnknown_ForUndefinedStatus()
    {
        // Arrange
        var undefinedStatus = (CurrentStatus)(-1);

        // Act
        var result = CurrentStatusUtils.ToString(undefinedStatus);

        // Assert
        result.Should().Be("Unknown");
    }
}
