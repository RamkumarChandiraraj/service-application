using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyProfileToRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ProfileImageId",
                table: "Registrations",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_ProfileImageId",
                table: "Registrations",
                column: "ProfileImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Registrations_Attachments_ProfileImageId",
                table: "Registrations",
                column: "ProfileImageId",
                principalTable: "Attachments",
                principalColumn: "ID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Registrations_Attachments_ProfileImageId",
                table: "Registrations");

            migrationBuilder.DropIndex(
                name: "IX_Registrations_ProfileImageId",
                table: "Registrations");

            migrationBuilder.DropColumn(
                name: "ProfileImageId",
                table: "Registrations");
        }
    }
}
