namespace PatrimonialeImporter.Models
{
    public class PatrimonialeRequestDto
    {
        public Guid PatrimonialeId { get; init; }

        public Guid PatrimonialeBatchId { get; init; }

        public bool? Confirmed { get; init; }

        public DateOnly? CheckDate { get; init; }

        public PatrimonialeJobDto? PatrimonialeJob { get; init; }

        public bool? LegalEligibility { get; init; }

        public PatrimonialeIncomeDto? PatrimonialeIncome { get; init; }

        public PatrimonialeDeceasedInfoDto? DeceasedInformation { get; init; }
    }

}
