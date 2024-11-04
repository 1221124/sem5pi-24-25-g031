# UC016 - As a Doctor, I want to request an operation, so that the Patient has access to the necessary healthcare.

## 2. Analysis

### 2.1. Relevant Domain Model Excerpt

![UC016 - Domain Model](png/uc016-domain-model.png)

### 2.2. Process Specification

#### 2.2.1. Normal Flow
1. **Authenticate Doctor**: Verify that the Doctor is logged in with appropriate permissions.
2. **Access Operation Request Management Interface**: Navigates to the operation request management section of the backoffice.
3. **Identifies Doctor**: Doctor ID is saved in the system to be used in the system.
4. **Obtains Patients' IDs**: The system returns all active Patients' IDs.
5. **Select Patient's ID**: Doctor selects the Patient's ID for the operation request.
6. **Obtains Doctor Specializations**: The system identified the Doctor specializations according to their ID.
7. **Display Operations' Types**: Following the Doctor specializations the system provides the operations' types related to it.
8. **Select Operation Type**: Doctor selects the appropriate operation type for the operation request.
9. **Display Priority Levels**: The system provides to the user all the priority levels.
10. **Select Priority Level**: Doctor selects the appropriate priority to the operation request.
11. **Provides Suggested Deadline**: Doctor provides to the system a suggested deadline to do the operation.
12. **Record Operation Request**: Record operation request in to the system.
13. **Updates Medical History**: Patient's medical history is updated to register the operation request.
14. **Feedback**: The system provides feedback to the Doctor on the success or failure of the operation request.

#### 2.2.2. Exceptional Flows
- **EF016.1**: If any option is invalid the system should request the User to type again.

### 2.3. Functional Requirements Reevaluation
- **FR016.1**: The system shall provide Patients' IDs, Operations' Types and Priority's Levels to the User.
- **FR016.2**: The system shall record the operation request in the system. 
- **FR016.3**: The system shall provide feedback to the Doctor on the success or failure of the operation request.

### 2.4. Non-functional Requirements Specification
- **Security**: Implement access control mechanisms to ensure that only authorized Doctor can request operations.
- **Performance**: Ensure the notification process completes within acceptable time limits to maintain system responsiveness.
- **Usability**: Interface should be intuitive, guiding the Doctor smoothly through the notification process with clear instructions and error handling.

### 2.5. Data Integrity and Security
- Data integrity measures should ensure that notification actions are accurately recorded and reflected in the system without compromising data consistency.
- Security measures should prevent unauthorized access to notification functionality and protect sensitive candidate data.

### 2.6. Interface Design
- The interface should provide an intuitive and efficient workflow for requesting operations, with clear indications of success or failure.

### 2.7. Risk Analysis
- **R016.1**: System Error During Operation Requests
    - **Mitigation**: Implement error handling mechanisms to warn the Doctor of any system failures and provide guidance on how to proceed.
- **R016.2**: Unauthorized Access to Operation Request Functionality
  - **Mitigation**: Implement secure encryption standards for storing and transmitting user credentials to prevent unauthorized access.

### 2.8. Decisions
- **D016.1**: Use role-based access control for operation requests functionality, restricting access to authorized Doctors only.
- **D016.2**: Use the provided domain model as a reference for implementing operation requests functionality.