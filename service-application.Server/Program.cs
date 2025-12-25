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
builder.Services.AddScoped<IRegistrationService, RegistrationService>();
builder.Services.AddScoped(typeof(IApiMessage<>), typeof(ApiMessage<>));

//Repository Registration

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
