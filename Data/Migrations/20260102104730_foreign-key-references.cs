using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class foreignkeyreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Registrations_LocationId",
                table: "Registrations",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_ServiceId",
                table: "Registrations",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Registrations_Locations_LocationId",
                table: "Registrations",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Registrations_Service_ServiceId",
                table: "Registrations",
                column: "ServiceId",
                principalTable: "Service",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Registrations_Locations_LocationId",
                table: "Registrations");

            migrationBuilder.DropForeignKey(
                name: "FK_Registrations_Service_ServiceId",
                table: "Registrations");

            migrationBuilder.DropIndex(
                name: "IX_Registrations_LocationId",
                table: "Registrations");

            migrationBuilder.DropIndex(
                name: "IX_Registrations_ServiceId",
                table: "Registrations");
        }
    }
}
