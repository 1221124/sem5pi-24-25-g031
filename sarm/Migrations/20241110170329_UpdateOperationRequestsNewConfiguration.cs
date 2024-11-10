using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOperationRequestsNewConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "OperationRequests",
                newName: "Staff");

            migrationBuilder.RenameColumn(
                name: "PatientId",
                table: "OperationRequests",
                newName: "Patient");

            migrationBuilder.RenameColumn(
                name: "OperationTypeId",
                table: "OperationRequests",
                newName: "OperationType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Staff",
                table: "OperationRequests",
                newName: "StaffId");

            migrationBuilder.RenameColumn(
                name: "Patient",
                table: "OperationRequests",
                newName: "PatientId");

            migrationBuilder.RenameColumn(
                name: "OperationType",
                table: "OperationRequests",
                newName: "OperationTypeId");
        }
    }
}
