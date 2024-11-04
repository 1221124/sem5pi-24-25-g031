# Surgical Appointment and Resource Management System

## Overview

This project is a **web-based system** designed to manage surgical appointments and hospital resources. The application provides features such as scheduling surgeries, managing patient and staff records, and visualizing hospital resource availability in real-time. The system is developed with GDPR compliance to ensure data privacy and security.

## Key Features

- **Surgical Appointment Management**: Schedule, update, and cancel surgeries, ensuring that doctors, patients, and rooms are available.
- **Patient and Staff Management**: Handle patient records, medical conditions, emergency contacts, and staff details, including their availability.
- **3D Hospital Visualization**: Real-time 3D rendering of hospital rooms and their availability.
- **Resource Optimization**: Optimize scheduling based on resource availability (doctors, staff, and rooms).
- **GDPR Compliance**: Ensure that all patient and staff data are managed according to EU regulations, including the right to be forgotten and data access controls.

## Modules

### 1. **Backoffice Web Application**

- **User Management**: Allows admins to register, edit, and remove users (e.g., doctors, nurses, technicians, patients).
- **Patient Management**: Manage patient details including medical history, allergies, and emergency contacts.
- **Staff Management**: Manage hospital staff availability, specialization, and contact details.
- **Operation Request**: Doctors can request surgical operations and update or remove these requests.

### 2. **3D Visualization Module**

- Displays the hospital layout and available resources (rooms, equipment) in real-time.
- Shows room availability and scheduling information, integrating data from the planning module.

### 3. **Planning/Optimization Module**

- **Surgical Scheduling**: Schedules surgeries based on staff and room availability, ensuring that surgeries are scheduled without conflicts.
- **Resource Optimization**: Optimizes surgery schedules by considering room capacity, staff specialization, and operation duration.
- Ensures that operations do not exceed the estimated duration unless rescheduled.

### 4. **GDPR Module**

- **Data Privacy**: Ensures that all sensitive data is handled according to GDPR standards.
- **User Rights**: Allows patients to request data deletion, update personal information, and control access to their data.
- Logs and audits actions related to personal data for full compliance.

### 5. **Business Continuity Plan (BCP) Module**

- Ensures the system remains functional during technical failures.
- Provides failover mechanisms for data recovery and system continuity.

## Data Model

### Entities and Attributes

1. **User**
   - Attributes: `Username`, `Role` (Admin, Doctor, Nurse, Technician, Patient), `Email`
   - Users authenticate via an Identity Access Management (IAM) system.
  
2. **Patient**
   - Attributes: `First Name`, `Last Name`, `Medical Record Number`, `Contact Information`, `Allergies/Medical Conditions`, `Emergency Contact`
  
3. **Staff**
   - Attributes: `First Name`, `Last Name`, `License Number`, `Specialization`, `Contact Information`, `Availability Slots`
  
4. **Operation Request**
   - Attributes: `ID`, `Patient ID`, `Doctor ID`, `Operation Type`, `Deadline`, `Priority`
  
5. **Appointment**
   - Attributes: `ID`, `Request ID`, `Room ID`, `Date and Time`, `Status (scheduled, completed, canceled)`
  
6. **Surgery Room**
   - Attributes: `Room Number`, `Type`, `Capacity`, `Assigned Equipment`, `Current Status`

## Technologies Used

- **Frontend**: HTML, CSS and Typescript (with Angular framework)
- **Backend**: C# (with .NET framework)
- **Database**: Azure SQL Server
- **3D Visualization**: Three.js for real-time rendering
- **Authentication**: Auth0 IAM
- **Compliance**: GDPR Module

## Usage

### Admin

- **Add Staff**: Admins can register new doctors, nurses, and technicians into the system, assigning appropriate roles and managing their profiles.
- **Manage Users**: Admins can edit or deactivate user accounts, ensuring that only authorized personnel have access to the system.
- **Create Operation Types**: Admins can add or update operation types, such as appendectomies or heart surgeries, defining necessary staff and equipment for each type.
- **Audit and GDPR Compliance**: Admins have the ability to manage and review logs related to patient data access, deletion, or modification requests as part of GDPR compliance.

### Doctors

- **Request Surgeries**: Doctors can submit operation requests, specifying the patient, type of surgery, priority, and desired date.
- **Update Surgery Requests**: Doctors can modify existing requests, updating priorities or deadlines.
- **View Surgery Schedule**: Doctors can view their scheduled operations and ensure availability for upcoming appointments.
- **Cancel Surgery Requests**: Unscheduled surgeries can be canceled, notifying the planning module and updating the system records accordingly.

### Patients

- **Profile Management**: Patients can create or update their profiles with relevant personal and medical information, ensuring their records are up to date.
- **View Appointments**: Patients can log in to view upcoming surgeries and their appointment history.
- **Request Account Deletion**: Patients can request the deletion of their accounts and personal data as per GDPR regulations.

### 3D Visualization Module

- **Room Availability**: The 3D module allows users to visualize hospital rooms in real time, displaying their availability, status (available, occupied, or under maintenance), and assigned equipment.
- **Interaction**: Users can interact with the visualization, selecting rooms to view details such as ongoing surgeries, scheduled maintenance, and more.

### Planning/Optimization Module

- **Automated Scheduling**: The system will automatically generate surgery schedules based on staff availability, room capacity, and equipment, ensuring no conflicts in timing.
- **Resource Optimization**: The system ensures efficient use of resources by optimizing the schedules to fit the hospital’s needs.
- **Real-Time Updates**: Any updates to room availability or staff schedules are reflected immediately, ensuring that the surgery schedule remains up to date.

### GDPR Module

- **Data Access**: Patients can view and request access to their personal data, including medical records and appointment history.
- **Data Deletion**: Patients can request account and data deletion in compliance with GDPR. Upon confirmation, their data will be erased within the legally required time frame.
- **Audit Logs**: All actions involving personal data (e.g., edits, deletions, accesses) are logged for review and audit by the Admin to ensure GDPR compliance.