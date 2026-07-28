using ClosedXML.Excel;
using PatrimonialeImporter;
using System.Reflection;

var assembly = Assembly.GetExecutingAssembly();

var srcExcelFileName = assembly.GetManifestResourceNames().Single(e => e.EndsWith("xlsx"));
using Stream? stream = assembly.GetManifestResourceStream(srcExcelFileName);

if (stream == null)
{
    throw new FileNotFoundException("Nie znaleziono zasobu.");
}

using var workbook = new XLWorkbook(stream);

var worksheet = workbook.Worksheet(1);

new PatrimonialeImportService().RunImport(worksheet);