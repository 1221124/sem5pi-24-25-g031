using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class updatedblogstablename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DbLog",
                table: "DbLog");

            migrationBuilder.RenameTable(
                name: "DbLog",
                newName: "DbLogs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DbLogs",
                table: "DbLogs",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DbLogs",
                table: "DbLogs");

            migrationBuilder.RenameTable(
                name: "DbLogs",
                newName: "DbLog");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DbLog",
                table: "DbLog",
                column: "Id");
        }
    }
}
