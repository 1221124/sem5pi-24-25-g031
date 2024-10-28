using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePatientTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TokenExpiryDate",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "VerificationToken",
                table: "Patients");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TokenExpiryDate",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerificationToken",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
