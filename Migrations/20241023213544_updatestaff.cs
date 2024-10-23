using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class updatestaff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LicenseNumber",
                table: "Staffs");

            migrationBuilder.RenameColumn(
                name: "BloodType",
                table: "Patients",
                newName: "MedicalRecordNumber");

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Condition",
                table: "Patients");

            migrationBuilder.RenameColumn(
                name: "MedicalRecordNumber",
                table: "Patients",
                newName: "BloodType");

            migrationBuilder.AddColumn<string>(
                name: "LicenseNumber",
                table: "Staffs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
