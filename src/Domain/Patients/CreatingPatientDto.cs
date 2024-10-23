using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Patients {

    public class CreatingPatientDto{
        
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string dateOfBirth { get; set; }
        public string phoneNumber { get; set; }
        public string email { get; set; }
        
        

        public CreatingPatientDto(string firstName, string lastName, string dateOfBirth, string phoneNumber, string email)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.dateOfBirth = dateOfBirth;
            this.phoneNumber = phoneNumber;
            this.email = email;
        }
    }
}