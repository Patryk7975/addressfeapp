using PatrimonialeImporter;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Add Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Patrimoniale Importer API",
        Version = "v1",
        Description = "REST API for Patrimoniale importer"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Add typed HttpClient for PatrimonialeImportService
builder.Services.AddHttpClient<IPatrimonialeImportService, PatrimonialeImportService>();

var app = builder.Build();

app.UseCors("AllowAll");

// Configure Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Patrimoniale Importer API v1");
    c.RoutePrefix = "swagger";
});

// Redirect root to Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapControllers();

app.Run();