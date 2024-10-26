using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;
using Microsoft.DiaSymReader;

namespace Domain.Patients {

    public class CreatingPatientDto{
        
        public FullName Fullname { get; set; }
        public DateOfBirth BirthDate { get; private set; }  // Use the DateOfBirth type}
        public ContactInformation ContactInformation { get; set; }
        public Gender Gender { get; set; }
        
        

        public CreatingPatientDto(FullName fullname, DateOfBirth dateOfBirth, ContactInformation contactInformation, Gender gender)
        {
            Fullname = fullname;
            BirthDate = dateOfBirth;
            ContactInformation = contactInformation;
            Gender = gender;
        }
        
        
    }
}