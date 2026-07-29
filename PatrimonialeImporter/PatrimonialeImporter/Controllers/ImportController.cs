using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using PatrimonialeImporter.Models;

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
            var directory = AppContext.BaseDirectory;
            var parts = directory.Split("\\");

            var filePath = "";
            foreach (var part in parts)
            {
                if (part.ToLower() == "bin" || part.ToLower() == "debug" || part.ToLower() == "release" || part.ToLower().StartsWith("net"))
                    continue;

                filePath += part + "\\";
            }

            filePath += @"Resources\PatrimonialeData.xlsx";

            using var workbook = new XLWorkbook(filePath);
            var worksheet = workbook.Worksheet(1);

            var result = await _importService.RunImportAsync(clientId, worksheet, cancellationToken);
            return Ok(result);
        }
    }
}
