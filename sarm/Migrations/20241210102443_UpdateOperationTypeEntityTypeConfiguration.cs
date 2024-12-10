using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOperationTypeEntityTypeConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhasesDuration",
                table: "OperationTypes");

            migrationBuilder.DropColumn(
                name: "RequiredStaff",
                table: "OperationTypes");

            migrationBuilder.AddColumn<int>(
                name: "Cleaning",
                table: "OperationTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Preparation",
                table: "OperationTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Surgery",
                table: "OperationTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "RequiredStaff",
                columns: table => new
                {
                    OperationTypeId = table.Column<string>(type: "text", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Specialization = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    IsRequiredInPreparation = table.Column<string>(type: "text", nullable: false),
                    IsRequiredInSurgery = table.Column<string>(type: "text", nullable: false),
                    IsRequiredInCleaning = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequiredStaff", x => new { x.OperationTypeId, x.Id });
                    table.ForeignKey(
                        name: "FK_RequiredStaff_OperationTypes_OperationTypeId",
                        column: x => x.OperationTypeId,
                        principalTable: "OperationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RequiredStaff");

            migrationBuilder.DropColumn(
                name: "Cleaning",
                table: "OperationTypes");

            migrationBuilder.DropColumn(
                name: "Preparation",
                table: "OperationTypes");

            migrationBuilder.DropColumn(
                name: "Surgery",
                table: "OperationTypes");

            migrationBuilder.AddColumn<string>(
                name: "PhasesDuration",
                table: "OperationTypes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequiredStaff",
                table: "OperationTypes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
