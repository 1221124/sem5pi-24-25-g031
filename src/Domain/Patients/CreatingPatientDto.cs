using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Patients {

    public class CreatingPatientDto{
        
        public FullName Fullname { get; set; }
        // String representation to accept the date from JSON
        public string DateOfBirthString 
        {
            get => BirthDate.ToString();
            set 
            {
                BirthDate = DateOfBirth.Parse(value); // Call your Parse method here
            }
        }

        public DateOfBirth BirthDate { get; private set; }  // Use the DateOfBirth type}
        public ContactInformation ContactInformation { get; set; }
        
        

        public CreatingPatientDto(FullName fullname, DateOfBirth dateOfBirth, ContactInformation contactInformation)
        {
            Fullname = fullname;
            BirthDate = dateOfBirth;
            ContactInformation = contactInformation;
        }
        
        
    }
}