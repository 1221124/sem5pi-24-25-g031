using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Patients {

    public class CreatingPatientDto{
        public FullName FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public ContactInformation ContactInformation { get; set; }

        public CreatingPatientDto(FullName fullName, DateTime dateOfBirth, ContactInformation contactInformation)
        {
          FullName = fullName;
          DateOfBirth = dateOfBirth; 
          ContactInformation = contactInformation;
        }
       
    }
}