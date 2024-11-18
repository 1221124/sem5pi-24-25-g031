using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries{
    public class RoomCapacity{
        public string Capacity { get; private set; }

        public RoomCapacity(int capacity){
            Capacity = capacity.ToString();
        }

        public RoomCapacity(string capacity)
        {
            try
            {
                if(capacity == "" )
                    throw new BusinessRuleValidationException("Room capacity cannot be empty");

                if(int.Parse(capacity) < 0)
                    throw new BusinessRuleValidationException("Room capacity cannot be negative");
                
                Capacity = capacity;
            }
            catch (Exception)
            {
                throw new BusinessRuleValidationException("Room capacity must be a number");
            }
        }

        public void UpdateCapacity(int capacity)
        {
            Capacity = capacity.ToString();
        }
        
        public override string ToString()
        {
            return Capacity.ToString();
        }
        
        
    }
}