namespace PatrimonialeImporter.Models
{
    public class ClientPatrimonialeRequest
    {
        public Guid ClientId { get; set; }

        public PatrimonialeRequestDto PatrimonialeRequestDto { get; set; }
    }
}
