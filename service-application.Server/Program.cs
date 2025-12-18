using Common.Base;
using Data.Base;
using Data.Context;
using Data.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Services.Impl;
using Services.Interface;
using Services.Mappings;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with MySQL
builder.Services.AddDbContext<ServiceApplicationDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DB_mysql")), ServiceLifetime.Singleton);

//mapper registration
builder.Services.AddMapster();
RegisterMapper.RegisterMapsterConfiguration();

//Service Registration
//builder.Services.AddScoped<ServiceApplicationDbContext>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped(typeof(IApiMessage<>), typeof(ApiMessage<>));

//Repository Registration

builder.Services.AddScoped(typeof(IRepositary<>), typeof(Repository<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
