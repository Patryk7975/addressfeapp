namespace PatrimonialeImporter.Models
{
    public class PatrimonialeRequestDto
    {
        public Guid PatrimonialeId { get; init; }

        public Guid PatrimonialeBatchId { get; init; }

        public bool? Confirmed { get; init; }

        public DateOnly? CheckDate { get; init; }

        public PatrimonialeJobDto? Job { get; init; }

        public bool? LegalEligibility { get; init; }

        public PatrimonialeIncomeDto? Income { get; init; }

        public PatrimonialeDeceasedInfoDto? DeceasedInformation { get; init; }

        public string? ChangeSource { get; init; }

        public Guid? SellerId { get; init; }

        public Guid? InvestorId { get; init; }

        public string? ChangeBasis { get; init; }
    }
}
