using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries{
    public class RoomCapacity{
        public int Capacity { get; private set; }

        public RoomCapacity(int capacity){
            Capacity = capacity;
        }

        public RoomCapacity(string capacity)
        {
            try
            {
                if(capacity == "" )
                    throw new BusinessRuleValidationException("Room capacity cannot be empty");

                if(int.Parse(capacity) < 0)
                    throw new BusinessRuleValidationException("Room capacity cannot be negative");
                
                Capacity = int.Parse(capacity);
            }
            catch (Exception)
            {
                throw new BusinessRuleValidationException("Room capacity must be a number");
            }
        }

        public void UpdateCapacity(int capacity)
        {
            Capacity = capacity;
        }
        
        public override string ToString()
        {
            return Capacity.ToString();
        }
        
        
    }
}