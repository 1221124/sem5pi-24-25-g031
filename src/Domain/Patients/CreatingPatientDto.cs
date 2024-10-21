using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.Patients {

    public class CreatingPatientDto{
        public FullName FullName { get; set; }
        public Name Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public ContactInformation ContactInformation { get; set; }

        public CreatingPatientDto(FullName fullName, Name name, DateTime dateOfBirth, ContactInformation contactInformation)
        {
          FullName = fullName;
          Name = name;
          DateOfBirth = dateOfBirth; 
          ContactInformation = contactInformation;
        }
    }
}