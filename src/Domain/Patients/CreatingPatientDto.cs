using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Patients {

    public class CreatingPatientDto{
        
        public string Fullname { get; set; }
        public string DateOfBirth { get; set; }
        public string ContactInformation { get; set; }
        
        

        public CreatingPatientDto(string fullname, string dateOfBirth, string contactInformation)
        {
            Fullname = fullname;
            DateOfBirth = dateOfBirth;
            ContactInformation = contactInformation;
        }
    }
}