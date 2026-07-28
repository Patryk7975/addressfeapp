using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using PatrimonialeImporter.Models;
using System.Reflection;

namespace PatrimonialeImporter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImportController : ControllerBase
    {
        private readonly IPatrimonialeImportService _importService;

        public ImportController(IPatrimonialeImportService importService)
        {
            _importService = importService;
        }

        /// <summary>
        /// Runs the import process using the embedded Excel data file.
        /// </summary>
        [HttpPost("RunImport/{clientId}")]
        public async Task<ActionResult<ImportResult>> RunImport(Guid clientId, CancellationToken cancellationToken)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var srcExcelFileName = assembly.GetManifestResourceNames().FirstOrDefault(e => e.EndsWith("xlsx"));

            if (string.IsNullOrEmpty(srcExcelFileName))
            {
                return NotFound("Nie znaleziono zasobu pliku Excel.");
            }

            using Stream? stream = assembly.GetManifestResourceStream(srcExcelFileName);
            if (stream == null)
            {
                return NotFound("Nie można otworzyć strumienia zasobu Excel.");
            }

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);

            var result = await _importService.RunImportAsync(clientId, worksheet, cancellationToken);
            return Ok(result);
        }
    }
}
