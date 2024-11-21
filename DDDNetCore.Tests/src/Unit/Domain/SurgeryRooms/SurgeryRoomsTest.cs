namespace DDDNetCore.Tests.Unit.Domain.SurgeryRooms;

using Xunit;
using FluentAssertions;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.Domain.Surgeries;

public class SurgeryRoomTests
{
    [Fact]
    public void Constructor_ShouldInitializePropertiesCorrectly()
    {
        // Arrange
        var surgeryRoomNumber = SurgeryRoomNumber.OR1;
        var roomType = RoomType.OPERATING_ROOM;
        var roomCapacity = new RoomCapacity(5);
        var assignedEquipment = new AssignedEquipment("Basic Equipment");

        // Act
        var surgeryRoom = new SurgeryRoom(surgeryRoomNumber, roomType, roomCapacity, assignedEquipment);

        // Assert
        surgeryRoom.Id.Should().NotBeNull();
        surgeryRoom.SurgeryRoomNumber.Should().Be(surgeryRoomNumber);
        surgeryRoom.RoomType.Should().Be(roomType);
        surgeryRoom.RoomCapacity.Should().Be(roomCapacity);
        surgeryRoom.AssignedEquipment.Should().Be(assignedEquipment);
        surgeryRoom.CurrentStatus.Should().Be(CurrentStatus.AVAILABLE);
        surgeryRoom.MaintenanceSlots.Should().BeEmpty();
    }

    [Fact]
    public void Constructor_ShouldAssignUniqueId()
    {
        // Arrange
        var surgeryRoomNumber = SurgeryRoomNumber.OR2;
        var roomType = RoomType.CONSULTATION_ROOM;
        var roomCapacity = new RoomCapacity(3);
        var assignedEquipment = new AssignedEquipment("Advanced Equipment");

        // Act
        var surgeryRoom1 = new SurgeryRoom(surgeryRoomNumber, roomType, roomCapacity, assignedEquipment);
        var surgeryRoom2 = new SurgeryRoom(surgeryRoomNumber, roomType, roomCapacity, assignedEquipment);

        // Assert
        surgeryRoom1.Id.Should().NotBe(surgeryRoom2.Id);
    }

    [Fact]
    public void MaintenanceSlots_ShouldInitializeAsEmptyList()
    {
        // Arrange
        var surgeryRoomNumber = SurgeryRoomNumber.OR3;
        var roomType = RoomType.ICU;
        var roomCapacity = new RoomCapacity(2);
        var assignedEquipment = new AssignedEquipment("ICU Equipment");

        // Act
        var surgeryRoom = new SurgeryRoom(surgeryRoomNumber, roomType, roomCapacity, assignedEquipment);

        // Assert
        surgeryRoom.MaintenanceSlots.Should().NotBeNull();
        surgeryRoom.MaintenanceSlots.Should().BeEmpty();
    }
}
