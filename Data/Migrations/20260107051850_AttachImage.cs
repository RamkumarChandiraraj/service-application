using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AttachImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_User_ProfileId",
                table: "User",
                column: "ProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Attachments_ProfileId",
                table: "User",
                column: "ProfileId",
                principalTable: "Attachments",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Attachments_ProfileId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_ProfileId",
                table: "User");
        }
    }
}
