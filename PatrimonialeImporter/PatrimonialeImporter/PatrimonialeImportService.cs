using ClosedXML.Excel;
using PatrimonialeImporter.Enums;
using PatrimonialeImporter.Models;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PatrimonialeImporter
{
    public class PatrimonialeImportService
    {
        public void RunImport(IXLWorksheet worksheet)
        {
            var requests = BuildPatrimonialeRequests(worksheet);
            SendRequestsToApi(requests);
        }

        private void SendRequestsToApi(List<ClientPatrimonialeRequest> requests)
        {
            var apiBaseUrl = "http://localhost:7000/api/patrimoniale";

            foreach (var request in requests)
            {
                using var httpClient = new HttpClient();
                var url = $"{apiBaseUrl}/{request.ClientId}";
                var body = request.PatrimonialeRequestDto;

                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                };

                string json = JsonSerializer.Serialize(body, jsonOptions);
                using var content = new StringContent(json, Encoding.UTF8, "application/json");

                try
                {
                    var response = httpClient.PostAsync(url, content).GetAwaiter().GetResult();
                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"POST {url} failed: {(int)response.StatusCode} {response.ReasonPhrase}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending POST to {url}: {ex}");
                }
            }
        }

        private List<ClientPatrimonialeRequest> BuildPatrimonialeRequests(IXLWorksheet worksheet)
        {
            var result = new List<ClientPatrimonialeRequest>();

            var batchId = Guid.NewGuid();

            foreach (var row in worksheet.RowsUsed())
            {
                if (row.RowNumber() < 3)
                    continue;

                try
                {
                    result.Add(BuildPatrimonialeRequestFromRow(row, batchId));
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to parse row {row.RowNumber()}");
                    Console.WriteLine(ex);
                }
            }

            return result;
        }

        private ClientPatrimonialeRequest BuildPatrimonialeRequestFromRow(IXLRow row, Guid batchId)
        {
            var clientGuid = Guid.Parse(row.Cell(1).Value.ToString());

            var job = GetJobDtoFromRow(row);
            var income = GetIncomeFromRow(row);
            var deceaseInfo = GetDeceaseInfoFromRow(row);

            //others
            bool? legalEligibility = bool.TryParse(
                row.Cell(13).GetString(),
                out var legalEligibilityValue)
                    ? legalEligibilityValue
                    : null;

            bool? confirmed = bool.TryParse(
                row.Cell(14).GetString(),
                out var confirmedValue)
                    ? confirmedValue
                    : null;

            DateOnly? checkDate = DateTime.TryParse(
                row.Cell(15).GetString(),
                out var checkDateValue)
                    ? DateOnly.FromDateTime(checkDateValue)
                    : null;

            return new ClientPatrimonialeRequest
            {
                ClientId = clientGuid,
                PatrimonialeRequestDto = new()
                {
                    CheckDate = checkDate,
                    Confirmed = confirmed,
                    LegalEligibility = legalEligibility,
                    PatrimonialeId = Guid.NewGuid(),
                    PatrimonialeBatchId = batchId,
                    DeceasedInformation = deceaseInfo,
                    PatrimonialeIncome = income,
                    PatrimonialeJob = job
                }
            };
        }

        private static PatrimonialeDeceasedInfoDto? GetDeceaseInfoFromRow(IXLRow row)
        {
            var deceaseStatus = Enum.TryParse<DeceaseStatus>(
                row.Cell(10).GetString(),
                true,
                out var deceaseStatusValue)
                    ? deceaseStatusValue
                    : (DeceaseStatus?)null;

            DateTime? deceaseDate = DateTime.TryParse(
                row.Cell(11).GetString(),
                out var deceaseDateValue)
                    ? deceaseDateValue
                    : null;

            DateTime? deceaseInformationDate = DateTime.TryParse(
                row.Cell(12).GetString(),
                out var deceaseInformationDateValue)
                    ? deceaseInformationDateValue
                    : null;

            var hasDecease = deceaseStatus != null || deceaseDate != null || deceaseInformationDate != null;

            var deceaseInfo = new PatrimonialeDeceasedInfoDto()
            {
                DeceaseStatus = deceaseStatus,
                DeceaseDate = deceaseDate,
                DeceaseInformationDate = deceaseInformationDate,
            };

            return hasDecease ? deceaseInfo : null;
        }


        private static PatrimonialeIncomeDto? GetIncomeFromRow(IXLRow row)
        {
            var grossMonthlyIncome = decimal.TryParse(
                row.Cell(8).GetString(),
                out var value)
                    ? value
                    : (decimal?)null;

            var currencyCode = Enum.TryParse<CurrencyCode>(
                row.Cell(9).GetString(),
                true,
                out var currencyValue)
                    ? currencyValue
                    : (CurrencyCode?)null;

            var hasIncome = grossMonthlyIncome != null || currencyCode != null;
            
            var income = new PatrimonialeIncomeDto()
            {
                GrossMonthlyIncome = grossMonthlyIncome,
                IncomeCurrency = currencyCode
            };

            return hasIncome ? income : null;
        }

        private static PatrimonialeJobDto? GetJobDtoFromRow(IXLRow row)
        {
            var employmentStatus = Enum.TryParse<EmploymentStatus>(
                row.Cell(2).GetString(),
                true,
                out var employmentStatusValue)
                    ? employmentStatusValue
                    : (EmploymentStatus?)null;

            var employerType = Enum.TryParse<EmployerType>(
                row.Cell(3).GetString(),
                true,
                out var employerTypeValue)
                    ? employerTypeValue
                    : (EmployerType?)null;

            var contractTypeTerm = Enum.TryParse<ContractTypeTerm>(
                row.Cell(4).GetString(),
                true,
                out var contractTypeTermValue)
                    ? contractTypeTermValue
                    : (ContractTypeTerm?)null;

            var contractWorkingTime = Enum.TryParse<ContractWorkingTime>(
                row.Cell(5).GetString(),
                true,
                out var contractWorkingTimeValue)
                    ? contractWorkingTimeValue
                    : (ContractWorkingTime?)null;

            var startDate = DateTime.TryParse(
                row.Cell(6).GetString(),
                out var startDateValue)
                    ? DateOnly.FromDateTime(startDateValue)
                    : (DateOnly?)null;

            var endDate = DateTime.TryParse(
                row.Cell(7).GetString(),
                out var endDateValue)
                    ? DateOnly.FromDateTime(endDateValue)
                    : (DateOnly?)null;

            var hasJob =
                employmentStatus != null ||
                employerType != null ||
                contractTypeTerm != null ||
                contractWorkingTime != null ||
                startDate != null ||
                endDate != null;

            var job = new PatrimonialeJobDto
            {
                EmploymentStatus = employmentStatus,
                EmployerType = employerType,
                ContractTypeTerm = contractTypeTerm,
                ContractWorkingTime = contractWorkingTime,
                StartDate = startDate,
                EndDate = endDate
            };

            return hasJob ? job : null;
        }
    }
}

