using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class updatingLocationandservice_column_datatype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Registrations");

            migrationBuilder.DropColumn(
                name: "Services",
                table: "Registrations");

            migrationBuilder.AddColumn<long>(
                name: "LocationId",
                table: "Registrations",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "ServiceId",
                table: "Registrations",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Registrations");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "Registrations");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Registrations",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "Services",
                table: "Registrations",
                type: "longtext",
                nullable: false);
        }
    }
}
