namespace DDDNetCore.Domain.Surgeries{
    public class RoomCapacity{
        public int Capacity { get; private set; }

        public RoomCapacity(int capacity){
            Capacity = capacity;
        }
    }
}