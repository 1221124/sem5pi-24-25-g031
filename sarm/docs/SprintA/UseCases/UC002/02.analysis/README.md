# UC002 - As a Backoffice User (Admin, Doctor, Nurse, Technician), I want to reset my password if I forget it, so that I can regain access to the system securely

## 2. Analysis

### 2.1. Relevant Domain Model Excerpt

The relevant domain model includes aggregates such as Staff and User, featuring root entities like Staff and User, along with value objects like DeactivateTime, which is specifically created for this use case to record the action for audit purposes. These value objects are essential for deactivating a staff profile in the system.

![UC002 - Domain Model](png/uc002-domain-model.svg)

### 2.2. Process Specification

#### 2.2.1. Normal Flow

1. **Request Password Reset**: User initiates a password reset request via the system.
2. **Verify User Email**: The system checks if the provided email is valid.
3. **Generate Password Reset Token**: If the email is verified, the system generates a password reset token.
4. **Send Password Reset Link**: The system sends an email to the user containing the password reset link.
5. **Click Reset Link**: The user clicks on the password reset link received in the email - expires after a predefined period (e.g., 24 hours) for security.
6. **Verify Token**: The system verifies the validity of the token.
7. **Redirect to Reset Password Page**: If the token is valid, the system redirects the user to the reset password page.
8. **Enter New Password**: The user enters a new password.
9. **Validate Password Complexity**: The system checks if the new password meets complexity requirements.
10. **Update Password**: If valid, the system updates the user’s password in the database.
11. **Provide Feedback**: The system informs the user that the password has been updated successfully.

#### 2.2.2. Exceptional Flows

- **EF002.1**: If the email is not verified, the system must notify the user and allow them to retry.
- **EF002.2**: If the token is invalid, the system must notify the user and redirect them to the password reset request page.
- **EF002.3**: If the password fails complexity validation, the system must provide feedback on the requirements.

### 2.3. Functional Requirements Reevaluation

- **FR002.1**: The system shall send a password reset link to the user's email.
- **FR002.2**: The system shall verify the validity of the password reset token.
- **FR002.3**: The system shall allow the user to enter a new password and validate its complexity.
- **FR002.4**: The system shall provide feedback on the success or failure of the password reset operation.

_Note_: The requirement "The system shall notify candidates by email about the results of the verification process" will not be implemented since it will be used an external IAM.

### 2.4. Non-functional Requirements Specification

- **Security**: Implement access control mechanisms to ensure that only authorized Backoffice Users can reset passwords.
- **Performance**: Ensure the password reset process completes within acceptable time limits to maintain system responsiveness.
- **Usability**: The interface should be intuitive, guiding the user smoothly through the password reset process with clear instructions.

### 2.5. Data Integrity and Security

- Data integrity measures should ensure that password reset actions are accurately recorded and reflected in the system without compromising data consistency.
- Security measures should prevent unauthorized access to password reset functionality and protect sensitive user data.

### 2.6. Interface Design

- The interface should provide an intuitive and efficient workflow for resetting passwords, with clear indications of success or failure.

### 2.7. Risk Analysis

- **R002.1**: System Error During Email Sending
  - **Mitigation**: Implement error handling mechanisms to notify the user of any failures and allow retries.
- **R002.2**: Unauthorized Access to Password Reset Functionalit
  - **Mitigation**: Implement secure encryption standards for storing and transmitting user credentials to prevent unauthorized access.

### 2.8. Decisions

- **D002.1**: Use validation mechanisms to ensure that user emails are valid during the password reset process.
- **D002.2**: Implement error handling to log and notify the User of any issues during the password reset process.
- **D002.3**: Utilize secure access control mechanisms to prevent unauthorized access to the password reset functionality.
- **D002.4**: Log the password reset process for audit purposes and ensure that data is updated immediately in the system.
- **D002.5**: Use the provided domain model as a reference for implementing password reset functionality.
