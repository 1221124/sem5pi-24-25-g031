using System;
using Domain.Shared;

namespace Domain.Staff
{
    public class StaffDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
        public string Specialization { get; set; }
        public List<Slot> Slot { get; set; }
        public bool Active { get; set; }
    }
}