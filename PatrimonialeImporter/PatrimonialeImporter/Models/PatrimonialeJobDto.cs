using PatrimonialeImporter.Enums;

namespace PatrimonialeImporter.Models
{
    public class PatrimonialeJobDto
    {
        public EmploymentStatus? EmploymentStatus { get; init; }

        public EmployerType? EmployerType { get; init; }

        public ContractTypeTerm? ContractTypeTerm { get; init; }

        public ContractWorkingTime? ContractWorkingTime { get; init; }

        public DateOnly? StartDate { get; init; }

        public DateOnly? EndDate { get; init; }
    }
}
