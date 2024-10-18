namespace Domain.OperationTypes
{
    public class CreatingOperationTypeDto
    {
        public string Description { get; set; }


        public CreatingOperationTypeDto(string description)
        {
            this.Description = description;
        }
    }
}