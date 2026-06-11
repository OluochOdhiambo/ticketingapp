using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.MainBoundedContext.Migrations
{
    /// <inheritdoc />
    public partial class reviewentityupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuantityOnOrder",
                table: "Ticket");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuantityOnOrder",
                table: "Ticket",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
