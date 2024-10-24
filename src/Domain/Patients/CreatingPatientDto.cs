using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Patients {

    public class CreatingPatientDto{
        
        public FullName Fullname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public ContactInformation ContactInformation { get; set; }
        
        

        public CreatingPatientDto(FullName fullname, DateTime dateOfBirth, ContactInformation contactInformation)
        {
            Fullname = fullname;
            DateOfBirth = dateOfBirth;
            ContactInformation = contactInformation;
        }
    }
}