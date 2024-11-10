using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentHistoryListSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessToken",
                table: "UsersSessions");

            migrationBuilder.RenameColumn(
                name: "IdToken",
                table: "UsersSessions",
                newName: "Cookie");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Cookie",
                table: "UsersSessions",
                newName: "IdToken");

            migrationBuilder.AddColumn<string>(
                name: "AccessToken",
                table: "UsersSessions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
