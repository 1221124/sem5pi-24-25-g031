using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSessionFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DBLog",
                table: "DBLog");

            migrationBuilder.RenameTable(
                name: "DBLog",
                newName: "DBLogs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DBLogs",
                table: "DBLogs",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DBLogs",
                table: "DBLogs");

            migrationBuilder.RenameTable(
                name: "DBLogs",
                newName: "DBLog");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DBLog",
                table: "DBLog",
                column: "Id");
        }
    }
}
