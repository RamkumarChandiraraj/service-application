using Common.Base;
using Data.Base;
using Data.Context;
using Data.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Services.Impl;
using Services.Interface;
using Services.Mappings;

var corsPolicyName = "AllowAll";
var builder = WebApplication.CreateBuilder(args);

var con = builder.Configuration.GetConnectionString("DB_mysql");
// Register DbContext with MySQL
builder.Services.AddDbContext<ServiceApplicationDbContext>(options =>
    options.UseMySQL(con),   ServiceLifetime.Scoped
    
    );

//mapper registration
builder.Services.AddMapster();
RegisterMapper.RegisterMapsterConfiguration();

//Service Registration
//builder.Services.AddScoped<ServiceApplicationDbContext>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped(typeof(IApiMessage<>), typeof(ApiMessage<>));
builder.Services.AddScoped<ILocationService, LocationService>();

//Repository Registration
builder.Services.AddScoped(typeof(IRepositary<>), typeof(Repository<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});





app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//}
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Enable CORS middleware, applying the named policy
app.UseCors(corsPolicyName); // Use the name of your defined policy
// Enable CORS middleware, applying the named policy
app.MapFallbackToFile("/index.html");

app.UseCors(corsPolicyName); // Use the name of your defined policy

app.UseAuthorization();

app.MapControllers();

app.Run();
