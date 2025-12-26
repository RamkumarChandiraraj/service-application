using Common.Base;
using Common.BaseResponse;
using Data.Base;
using Data.Context;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Services.Impl;
using Services.Interface;
using Services.Mappings;

var corsPolicyName = "AllowAll";
var builder = WebApplication.CreateBuilder(args);

// ===================== DATABASE =====================
var con = builder.Configuration.GetConnectionString("DB_mysql");

builder.Services.AddDbContext<ServiceApplicationDbContext>(options =>
    options.UseMySQL(con),
    ServiceLifetime.Scoped
);

// ===================== MAPSTER =====================
builder.Services.AddMapster();
RegisterMapper.RegisterMapsterConfiguration();

// ===================== SERVICES =====================
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IAttachmentService, AttachmentService>();


// ===================== API RESPONSE =====================
builder.Services.AddScoped(typeof(IApiMessage<>), typeof(ApiMessage<>));

// ===================== REPOSITORY =====================
builder.Services.AddScoped(typeof(IRepositary<>), typeof(Repository<>));

// ===================== CONTROLLERS =====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===================== CORS =====================
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ===================== MIDDLEWARE =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(corsPolicyName);

app.UseAuthorization();

app.MapControllers();

app.Run();
