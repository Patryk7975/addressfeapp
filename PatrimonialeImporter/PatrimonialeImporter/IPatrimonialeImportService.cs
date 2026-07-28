using ClosedXML.Excel;
using PatrimonialeImporter.Models;

namespace PatrimonialeImporter
{
    public interface IPatrimonialeImportService
    {
        Task<ImportResult> RunImportAsync(Guid clientId, IXLWorksheet worksheet, CancellationToken cancellationToken = default);
    }
}
