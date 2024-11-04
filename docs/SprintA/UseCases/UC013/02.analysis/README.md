# UC013 - As an Admin, I want to edit a staff’s profile, so that I can update their information

## 2. Analysis

### 2.1. Relevant Domain Model Excerpt

The relevant domain model includes aggregates such as User, Staff and Log, with root entities like Staff, and value objects like contact information, slot and specialization. The Log aggregate serves to record updates in real time across the system. These value objects are essential for editing a new staff profile in the system.

![UC013 - Domain Model](svg/uc013-domain-model.svg)

### 2.2. Process Specification

#### 2.2.1. Normal Flow

1. **Authenticate Admin**: Verify that the Admin is logged in with appropriate permissions to edit staff profiles.
2. **Access Staff Management Interface**: Navigate to the staff management section of the back office.
3. **Search for Staff Profile**: Admin can search for a specific staff member by name, email, or specialization.
4. **Select Staff Profile**: Choose the specific staff profile to edit.
5. **Edit Staff Information**: Update editable fields such as: Contact Information (Phone Number, Email), Availability Slots and Specialization.
6. **Save Changes**: The system saves the edited staff profile in the database with the same ID, replacing the previous information.
7. **Log Creation**: The system logs all profile changes for audit purposes.
8. **Send Confirmation Email**: If changes were made to contact information, the system sends a confirmation email to the staff member.
9. **Feedback**: The system provides feedback to the Admin on the success or failure of the profile update staff profile.

#### 2.2.2. Exceptional Flows

- **EF013.1**: If the admin fails to find the staff profile, the system should notify them that no matching profile was found.
- **EF013.2**: If the update fails (e.g., due to validation errors), the system should inform the Admin and indicate the reasons for the failure.
- **EF013.3**: If the confirmation email fails to send, the system must notify the Admin and log the error.

### 2.3. Functional Requirements Reevaluation

- **FR013.1**: The system shall provide editable fields for contact information, availability slots, and specialization.

### 2.4. Non-functional Requirements Specification

- **Security**: Implement access control mechanisms to ensure that only authorized Admins can edit staff profiles.
- **Performance**: Ensure that updates and logging of changes complete within acceptable time limits to maintain system responsiveness.
- **Usability**: Interface should be intuitive, guiding the Admin smoothly through the profile editing process with clear instructions and error handling.

### 2.5. Data Integrity and Security

- Data integrity measures should ensure that profile updates are accurately recorded and reflected in the system without compromising data consistency.
- Security measures should ensure that profile updates are accurately recorded and reflected in the system without compromising data consistency.

### 2.6. Interface Design

- The interface shall be user-friendly, providing a clear workflow for editing staff profiles with input fields for contact information (email, phone number), availability slots and specialization.

### 2.7. Risk Analysis

- **R013.1**: Database Error During Staff Profile Editing
  - **Mitigation**: Implement error handling mechanisms to log the error and notify the Admin of the issue.
- **R013.2**: Unauthorized Access to Profile Editing
  - **Mitigation**: Implement role-based access control to restrict editing functionality to authorized Admins only.

### 2.8. Decisions

- **D013.1**: Use the system's email notification service to send confirmation updates to staff members.
- **D013.2**: Implement error handling to log and notify the Admin of any issues during staff profile editing.
- **D013.3**: Utilize secure access control mechanisms (with the help of the IAM) to prevent unauthorized access to staff profile editing functionality.
- **D013.4**: Log the editing of new staff profiles for audit purposes and immediate availability for scheduling.
