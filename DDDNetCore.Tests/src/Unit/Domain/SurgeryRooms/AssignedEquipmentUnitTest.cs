using System;
using Action = FirebaseAdmin.Messaging.Action;

namespace DDDNetCore.Tests.Unit.Domain.SurgeryRooms;

using Xunit;
using FluentAssertions;
using DDDNetCore.Domain.SurgeryRooms;

public class AssignedEquipmentUnitTest
{
    [Fact]
    public void Constructor_ShouldInitializeEquipmentCorrectly()
    {
        // Arrange
        var equipmentName = "Surgical Table";

        // Act
        var assignedEquipment = new AssignedEquipment(equipmentName);

        // Assert
        assignedEquipment.Equipment.Should().Be(equipmentName);
    }

    [Fact]
    public void ToString_ShouldReturnCorrectEquipmentName()
    {
        // Arrange
        var equipmentName = "Heart Monitor";
        var assignedEquipment = new AssignedEquipment(equipmentName);

        // Act
        var result = assignedEquipment.ToString();

        // Assert
        result.Should().Be(equipmentName);
    }
}