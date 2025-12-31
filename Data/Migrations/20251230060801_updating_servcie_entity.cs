using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class updating_servcie_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<long>(
                name: "CategoryId",
                table: "Service",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Service",
                type: "longtext",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Service_CategoryId",
                table: "Service",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Service_Categories_CategoryId",
                table: "Service",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Service_Categories_CategoryId",
                table: "Service");

            migrationBuilder.DropIndex(
                name: "IX_Service_CategoryId",
                table: "Service");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Service");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Service");

            
        }
    }
}
