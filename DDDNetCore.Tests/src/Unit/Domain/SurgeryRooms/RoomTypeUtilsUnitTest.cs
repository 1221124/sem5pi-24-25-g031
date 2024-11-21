namespace DDDNetCore.Tests.Unit.Domain.SurgeryRooms;

using Xunit;
using FluentAssertions;
using DDDNetCore.Domain.SurgeryRooms;

public class RoomTypeUtilsUnitTest
{
    [Fact]
    public void FromString_ShouldReturnCorrectRoomType_ForOperatingRoom()
    {
        // Act
        var result = RoomTypeUtils.FromString("Operating Room");

        // Assert
        result.Should().Be(RoomType.OPERATING_ROOM);
    }

    [Fact]
    public void FromString_ShouldReturnCorrectRoomType_ForConsultationRoom()
    {
        // Act
        var result = RoomTypeUtils.FromString("Consultation Room");

        // Assert
        result.Should().Be(RoomType.CONSULTATION_ROOM);
    }

    [Fact]
    public void FromString_ShouldReturnCorrectRoomType_ForICU()
    {
        // Act
        var result = RoomTypeUtils.FromString("ICU");

        // Assert
        result.Should().Be(RoomType.ICU);
    }

    [Fact]
    public void FromString_ShouldBeCaseInsensitive()
    {
        // Act
        var result = RoomTypeUtils.FromString("operating room");

        // Assert
        result.Should().Be(RoomType.OPERATING_ROOM);
    }

    [Fact]
    public void ToString_ShouldReturnCorrectString_ForOperatingRoom()
    {
        // Act
        var result = RoomTypeUtils.ToString(RoomType.OPERATING_ROOM);

        // Assert
        result.Should().Be("Operating Room");
    }

    [Fact]
    public void ToString_ShouldReturnCorrectString_ForConsultationRoom()
    {
        // Act
        var result = RoomTypeUtils.ToString(RoomType.CONSULTATION_ROOM);

        // Assert
        result.Should().Be("Consultation Room");
    }

    [Fact]
    public void ToString_ShouldReturnCorrectString_ForICU()
    {
        // Act
        var result = RoomTypeUtils.ToString(RoomType.ICU);

        // Assert
        result.Should().Be("ICU");
    }

    [Fact]
    public void ToString_ShouldReturnUnknown_ForUndefinedRoomType()
    {
        // Arrange
        var undefinedRoomType = (RoomType)(-1);

        // Act
        var result = RoomTypeUtils.ToString(undefinedRoomType);

        // Assert
        result.Should().Be("Unknown");
    }
}
