using PatrimonialeImporter.Enums;

namespace PatrimonialeImporter.Models
{
    public class PatrimonialeIncomeDto
    {
        public decimal? GrossMonthlyIncome { get; set; }

        public CurrencyCode? IncomeCurrency { get; set; }
    }

}
