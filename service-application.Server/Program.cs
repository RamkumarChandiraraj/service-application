using Common.Base;
using Data.Base;
using Data.Context;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using service_application.Server.Hubs;
using service_application.Server.Providers;
using Services.Impl;
using Services.Interface;
using Services.Mappings;
using System.Text;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;


var corsPolicyName = "AllowAll";
var builder = WebApplication.CreateBuilder(args);

//Serilog configuration

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

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
builder.Services.AddScoped<INotificationService, NotificationService>();

// =======================
// Repository
// =======================
builder.Services.AddScoped(typeof(IRepositary<>), typeof(Repository<>));

// =======================
// SignalR
// =======================
builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
builder.Services.AddSignalR();

// =======================
// Authentication (JWT)
// =======================
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])
        ),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                context.Token = authHeader["Bearer ".Length..].Trim();
            }
            return Task.CompletedTask;
        }
    };
});

// =======================
// Swagger
// =======================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {JWT token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// =======================
// Build App
// =======================
var app = builder.Build();

// =======================
// Firebase Initialization (SAFE & OPTIONAL)
// =======================
if (FirebaseApp.DefaultInstance == null)
{
    var firebasePath = Path.Combine(
        app.Environment.ContentRootPath,
        "firebase-adminsdk.json"
    );

    if (!File.Exists(firebasePath))
    {
        Console.WriteLine("❌ Firebase admin SDK file NOT found");
        Console.WriteLine(firebasePath);
    }
    else
    {
        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromFile(firebasePath)
        });

        Console.WriteLine("✅ Firebase Admin SDK initialized");
    }
}

// =======================
// Middleware Pipeline
// =======================
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors(corsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.MapFallbackToFile("/index.html");

if (app.Environment.IsDevelopment())
{
    app.UseSpa(spa =>
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:5173");
    });
}

app.Run();
