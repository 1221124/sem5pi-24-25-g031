# UC013 -  As an Admin, I want to edit a staff’s profile, so that I can update their information

## 3. Design - Use Case Realization

### 3.1. Rationale

| Interaction ID                                                      | Question: Which class is responsible for...            | Answer               | Justification (with patterns)                                                                                                                                                             |
|:--------------------------------------------------------------------|:-------------------------------------------------------|:---------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Step 1: Admin submits a request to edit a staff profile.            | ... triggering the update process?                     | **U**  | The **StaffController** handles the Admin's request to edit staff profiles, ensuring proper communication between the UI and the underlying business logic, in line with the MVC pattern. |
| Step 2: Create a DTO to encapsulate updated staff data.             | ... prepare the staff profile data for the controller? | **StaffDto**         | The **StaffDto** encapsulates the updated data for the staff profile to be transferred between layers, ensuring only the necessary information is passed along.                           |
| Step 3: Retrieve all staff profiles from the service.               | ... retrieve all staff profiles from the service?      | **StaffService**     | The **StaffService** contains the business logic for retrieving staff profiles from the repository, ensuring that only valid and consistent data is processed.                            |
| Step 4: Return the staff profiles to the service.                   | ... return the staff profiles to the service?          | **StaffRepository**  | The **StaffRepository** is responsible for fetching staff profile data from the database, adhering to the Repository pattern to separate data access logic from business logic.           |
| Step 5: Access the repository to fetch data.                        | ... Repository                                         | **IStaffRepository** | The **IStaffRepository** defines the contract for data access methods, ensuring that different implementations of data sources can be used without affecting the business logic.          |
| Step 6: Update the staff profile with new data.                     | ... Controller                                         | **StaffController**  | The **StaffController** sends the updated staff profile back to the Admin after processing, completing the request-response cycle in the MVC structure.                                   |
| Step 7: Log all profile changes.                                    | ... logging changes                                    | **LogService**       | The **LogService** records all changes made to the staff profile, ensuring an audit trail for accountability and review.                                                                  |
| Step 8: Trigger confirmation email for contact information changes. | ... notify staff                                       | **EmailService**     | The **EmailService** sends a confirmation email to the staff member when their contact information is updated, ensuring they are informed of changes to their profile.                    |
| Step 9: Update edited data in real-time across the system.          | ... reflect updates                                    | **StaffService**     | The **StaffService** ensures that any changes to staff profiles are reflected in real-time across the system, maintaining data consistency and immediacy for all users.                   |

### Systematization ##

According to the taken rationale, the conceptual classes promoted to software classes are:

* **StaffController**: Responsible for managing HTTP requests, handling the search process for staff profiles, and ensuring proper communication between the UI and the underlying business logic.
* **StaffDto**: Data Transfer Object that encapsulates the employee profile data to be transferred between the layers of the system.
* **StaffService**: Contains the business logic for retrieving staff profiles from the repository, ensuring that only valid and consistent data is processed. Ensures that any changes to staff profiles are updated in real-time across the system.
* **StaffRepository**: Responsible for fetching staff profile data from the database, adhering to the Repository pattern to separate data access logic from business logic.
* **IStaffRepository**: Interface that defines the contract for data access methods, ensuring that different implementations of data sources can be used without affecting the business logic.
* **LogService**: Responsible for logging all changes made to staff profiles, creating an audit trail for accountability.
* **EmailService**: Handles the sending of confirmation emails to staff members whenever their contact information is updated.

Other software classes (i.e. Pure Fabrication) identified:

* **StaffProfile**: Represents the staff profile entity, containing the necessary attributes and methods to manage staff profile data.

## 3.2. Sequence Diagram (SD)

![uc013-sequence-diagram.svg](svg/uc013-sequence-diagram.svg)

## 3.3. Class Diagram (CD)

![uc013-class-diagram.svg](svg/uc013-class-diagram.svg)
