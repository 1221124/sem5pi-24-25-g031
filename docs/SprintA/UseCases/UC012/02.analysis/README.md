# UC012 - As Customer Manager, I want the system to notify candidates, by email, of the result of the verification process

## 2. Analysis

### 2.1. Relevant Domain Model Excerpt

The relevant domain model includes aggregates such as Staff and User, with root entities like Staff, and value objects like License Number and Specialization. These value objects are essential for creating a new staff profile in the system.

![UC012 - Domain Model](png/uc012-domain-model.png)

### 2.2. Process Specification

#### 2.2.1. Normal Flow

1. **Authenticate Admin**: Verify that the Admin is authenticated and has the necessary permissions.
2. **Access Staff Management Interface**: The Admin navigates to the staff management section in the backoffice.
3. **Create New Staff**: The Admin inputs the new staff member's details, such as First Name, Last Name, Contact Information (email and phone), and Specialization.
4. **Generate License Number:**: The system automatically generates a unique **License Number** for the new staff member.
5. **Validate Data:** The system checks that the email and phone number are unique within the system.
6. **Store Profile:** The system securely stores the staff profile, applying role-based access control.
7. **Feedback:** The system provides feedback to the Admin on the success or failure of the staff profile creation.

#### 2.2.2. Exceptional Flows

- **EF012.1**: If the email or phone number is already in use, the system alerts the Admin of the duplication and does not create the profile.

### 2.3. Functional Requirements Reevaluation

- **FR012.1:** The system shall allow the Admin to create new staff profiles with details like name, contact information, and specialization.
- **FR012.2:** The system shall generate a unique **staff ID** when creating a new staff profile.
- **FR012.3:** The system shall validate that the staff’s email and phone number are unique.
- **FR012.4:** The system shall store staff profiles securely with role-based permissions.

### 2.4. Non-functional Requirements Specification

- **Security:** The system must ensure that only authenticated and authorized Admins can create staff profiles, and that data is stored securely.
- **Usability:** The interface should be intuitive, allowing the Admin to create new profiles quickly and without errors.

### 2.5. Data Integrity and Security

- **Data Integrity:** The system must ensure that staff data is accurately stored and that no duplicates are created.
- **Data Security:** Staff profiles must be protected from unauthorized access, and any sensitive data should be encrypted.

### 2.6. Interface Design

- The interface will follow the system’s design patterns, providing a user-friendly experience for Admins when entering new staff details.
- There should be clear fields for inputting Name, Contact Information, and Specialization, with automatic validation for duplicate data.

### 2.7. Risk Analysis

- **R012.1**: Data Duplication Error
  - **Mitigation**: Implement strict validation to ensure that email and phone numbers are unique before creating the profile.
- **R012.2**: Unauthorized Access to the System
  - **Mitigation**: Use role-based access control to restrict profile creation to authorized Admins only.

### 2.8. Decisions

- **D012.1**: Use role-based access control to ensure that only authorized Admins can create staff profiles.
- **D012.2**: Implement a validation mechanism to ensure that emails and phone numbers are not duplicated.
- **D012.3**: The system will automatically generate a unique license number for staff, ensuring uniqueness.
