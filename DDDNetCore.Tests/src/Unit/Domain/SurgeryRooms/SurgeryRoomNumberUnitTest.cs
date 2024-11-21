using System;

namespace DDDNetCore.Tests.Unit.Domain.SurgeryRooms;

using Xunit;
using FluentAssertions;
using DDDNetCore.Domain.SurgeryRooms;


public class SurgeryRoomNumberUnitTest
{
    [Fact]
    public void ToString_ShouldReturnCorrectString_ForRoomOR1()
    {
        // Act
        var result = SurgeryRoomNumberUtils.ToString(SurgeryRoomNumber.OR1);

        // Assert
        result.Should().Be("OR1");
    }

    [Fact]
    public void ToString_ShouldReturnCorrectString_ForRoomOR2()
    {
        // Act
        var result = SurgeryRoomNumberUtils.ToString(SurgeryRoomNumber.OR2);

        // Assert
        result.Should().Be("OR2");
    }

    [Fact]
    public void ToString_ShouldReturnCorrectString_ForRoomOR6()
    {
        // Act
        var result = SurgeryRoomNumberUtils.ToString(SurgeryRoomNumber.OR6);

        // Assert
        result.Should().Be("OR6");
    }

    [Fact]
    public void FromString_ShouldReturnCorrectRoom_ForStringOR1()
    {
        // Act
        var result = SurgeryRoomNumberUtils.FromString("OR1");

        // Assert
        result.Should().Be(SurgeryRoomNumber.OR1);
    }

    [Fact]
    public void FromString_ShouldReturnCorrectRoom_ForStringOR3()
    {
        // Act
        var result = SurgeryRoomNumberUtils.FromString("OR3");

        // Assert
        result.Should().Be(SurgeryRoomNumber.OR3);
    }

    [Fact]
    public void FromString_ShouldReturnCorrectRoom_ForStringOR6()
    {
        // Act
        var result = SurgeryRoomNumberUtils.FromString("OR6");

        // Assert
        result.Should().Be(SurgeryRoomNumber.OR6);
    }

    [Fact]
    public void FromString_ShouldBeCaseInsensitive()
    {
        // Act
        var result = SurgeryRoomNumberUtils.FromString("or4");

        // Assert
        result.Should().Be(SurgeryRoomNumber.OR4);
    }

    [Fact]
    public void FromString_ShouldThrowException_ForInvalidString()
    {
        // Act
        Action act = () => SurgeryRoomNumberUtils.FromString("InvalidRoom");

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("Invalid surgery room number");
    }

    [Fact]
    public void ToString_ShouldThrowException_ForInvalidRoom()
    {
        // Arrange
        var invalidRoom = (SurgeryRoomNumber)(-1);

        // Act
        Action act = () => SurgeryRoomNumberUtils.ToString(invalidRoom);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("Invalid surgery room number");
    }
}