# UC001 - As Admin, I want to register new backoffice users (e.g., doctors, nurses, technicians, admins) via an out-of-band process, so that they can access the backoffice system with appropriate permissions

## 2. Analysis

### 2.1. Relevant Domain Model Excerpt

![UC001 - Domain Model](png/uc001-domain-model.png)

### 2.2. Process Specification

#### 2.2.1. Normal Flow

1. **Preconditions**: The Admin is logged in and has access to the backoffice management functionality.
2. **Select Option**: The Admin chooses to register a new backoffice user.
3. **Enter User Details**: The Admin enters the user's mechanographic number and selects the user's role (e.g., Doctor, Nurse, Technician, Admin).

#### 2.2.2. Exceptional Flows

- **EF030.1**: If the email is not sent, the system must notify the Customer Manager and log the error.

### 2.3. Functional Requirements Reevaluation

- **FR030.1**: The system shall notify candidates by email about the results of the verification process.
- **FR030.2**: The system shall record that the notification has been made.
- **FR030.3**: The system shall provide feedback to the Customer Manager on the success or failure of the phase closure and notification process.

### 2.4. Non-functional Requirements Specification

- **Security**: Implement access control mechanisms to ensure that only authorized Customer Managers can send notifications.
- **Performance**: Ensure the notification process completes within acceptable time limits to maintain system responsiveness.
- **Usability**: Interface should be intuitive, guiding the Customer Manager smoothly through the notification process with clear instructions and error handling.

### 2.5. Data Integrity and Security

- Data integrity measures should ensure that notification actions are accurately recorded and reflected in the system without compromising data consistency.
- Security measures should prevent unauthorized access to notification functionality and protect sensitive candidate data.

### 2.6. Interface Design

- The interface will follow the EAPLI framework's design patterns, providing a user-friendly experience for the Customer Manager.
- The interface should provide an intuitive and efficient workflow for selecting candidates and sending notifications, with clear indications of success or failure.

### 2.7. Risk Analysis

- **R030.1**: System Error During Notification
  - **Mitigation**: Implement error handling mechanisms to notify the Customer Manager of any system failures and provide guidance on how to proceed.
- **R030.2**: Unauthorized Access to Notification Functionality
  - **Mitigation**: Implement secure encryption standards for storing and transmitting user credentials to prevent unauthorized access.

### 2.8. Decisions

- **D030.1**: Use role-based access control for notification functionality, restricting access to authorized Customer Managers only.
- **D030.2**: Utilize the system's email notification service to send updates to candidates.
- **D030.3**: Implement a logging mechanism to record the success or failure of email notifications for audit purposes.
- **D030.4**: Use the provided domain model as a reference for implementing notification functionality.
