using Common.Base;
using Data.Base;
using Data.Context;
using Data.Entities;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using service_application.Server.Hubs;
using service_application.Server.Providers;
using Services.Impl;
using Services.Interface;
using Services.Mappings;
using System.Text;

var corsPolicyName = "AllowAll";
var builder = WebApplication.CreateBuilder(args);

// =======================
// Database (MySQL)
// =======================
var con = builder.Configuration.GetConnectionString("DB_mysql");

builder.Services.AddDbContext<ServiceApplicationDbContext>(options =>
    options.UseMySQL(con)
);

// =======================
// Mapper
// =======================
builder.Services.AddMapster();
RegisterMapper.RegisterMapsterConfiguration();

// =======================
// Service Registration
// =======================
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped(typeof(IApiMessage<>), typeof(ApiMessage<>));
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAttachmentService, AttachmentService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();
builder.Services.AddScoped<IUserSearchService, UserSearchService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IForgotPasswordService, ForgotPasswordService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// 🔑 REGISTER CustomUserIdProvider
builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();

// =======================
// Repository
// =======================
builder.Services.AddScoped(typeof(IRepositary<>), typeof(Repository<>));

// =======================
// 🔐 JWT Authentication (FIXED)
// =======================

builder.Services.AddAuthentication();
//builder.Services.AddAuthentication(options =>
//{
//    // 🔑 REQUIRED FOR IIS + SWAGGER
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.SaveToken = true;

//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(
//            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])
//        ),
//        ValidateIssuer = true,
//        ValidIssuer = builder.Configuration["JWT:Issuer"],
//        ValidateAudience = true,
//        ValidAudience = builder.Configuration["JWT:Audience"],
//        ValidateLifetime = true,
//        ClockSkew = TimeSpan.Zero
//    };

//    // 🔥 IMPORTANT: Fix Swagger/IIS Authorization header issue
//    options.Events = new JwtBearerEvents
//    {
//        OnMessageReceived = context =>
//        {
//            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
//            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
//            {
//                context.Token = authHeader.Substring("Bearer ".Length).Trim();
//            }
//            return Task.CompletedTask;
//        }
//    };
//});

// =======================
// 🔒 GLOBAL AUTHORIZATION
// =======================
//builder.Services.AddAuthorization(options =>
//{
//    options.FallbackPolicy = options.DefaultPolicy;
//});

// =======================
// Swagger + JWT 🔒 Button
// =======================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1"
    });

    //c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //{
    //    Name = "Authorization",
    //    Type = SecuritySchemeType.ApiKey,
    //    Scheme = "Bearer",
    //    BearerFormat = "JWT",
    //    In = ParameterLocation.Header,
    //    Description = "Enter: Bearer {JWT token}"
    //});

    //c.AddSecurityRequirement(new OpenApiSecurityRequirement
    //{
    //    {
    //        new OpenApiSecurityScheme
    //        {
    //            Reference = new OpenApiReference
    //            {
    //                Type = ReferenceType.SecurityScheme,
    //                Id = "Bearer"
    //            }
    //        },
    //        Array.Empty<string>()
    //    }
    //});
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//SignalR for live chat
builder.Services.AddSignalR();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
              .AllowAnyHeader()
              .AllowAnyMethod()
              .SetIsOriginAllowed(org=> true)
              .AllowCredentials();
    });
});

// =======================
// Build App
// =======================
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors(corsPolicyName);

// 🔐 ORDER IS CRITICAL
app.UseAuthentication();   // FIRST
app.UseAuthorization();    // SECOND

app.MapControllers();
app.MapFallbackToFile("/index.html");
app.MapHub<ChatHub>("/chatHub");

app.Run();
