using PatrimonialeImporter.Enums;

namespace PatrimonialeImporter.Models
{
    public class PatrimonialeDeceasedInfoDto
    {
        public DeceaseStatus? DeceaseStatus { get; set; }

        public DateTime? DeceaseDate { get; set; }

        public DateTime? DeceaseInformationDate { get; set; }
    }
}
