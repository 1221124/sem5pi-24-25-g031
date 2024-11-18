using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class SurgeryAndAppointmentUpdated2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Surgeries_MaintenanceSlots");

            migrationBuilder.DropTable(
                name: "Surgeries");

            migrationBuilder.DropColumn(
                name: "OperationType",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "Priority",
                table: "Appointments",
                newName: "AppointmentNumber");

            migrationBuilder.CreateTable(
                name: "SurgeryRooms",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SurgeryRoomNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomCapacity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedEquipment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SurgeryRooms_MaintenanceSlots",
                columns: table => new
                {
                    SurgeryRoomId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Start = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    End = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRooms_MaintenanceSlots", x => new { x.SurgeryRoomId, x.Id });
                    table.ForeignKey(
                        name: "FK_SurgeryRooms_MaintenanceSlots_SurgeryRooms_SurgeryRoomId",
                        column: x => x.SurgeryRoomId,
                        principalTable: "SurgeryRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SurgeryRooms_MaintenanceSlots");

            migrationBuilder.DropTable(
                name: "SurgeryRooms");

            migrationBuilder.RenameColumn(
                name: "AppointmentNumber",
                table: "Appointments",
                newName: "Priority");

            migrationBuilder.AddColumn<string>(
                name: "OperationType",
                table: "Appointments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Surgeries",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AssignedEquipment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SurgeryRoom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomCapacity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SurgeryNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Surgeries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Surgeries_MaintenanceSlots",
                columns: table => new
                {
                    SurgeryId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    End = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Start = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Surgeries_MaintenanceSlots", x => new { x.SurgeryId, x.Id });
                    table.ForeignKey(
                        name: "FK_Surgeries_MaintenanceSlots_Surgeries_SurgeryId",
                        column: x => x.SurgeryId,
                        principalTable: "Surgeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
