# UC015 - As an Admin, I want to list/search staff profiles, so that I can see the details edit, and remove staff profiles

## 3. Design - Use Case Realization

### 3.1. Rationale

| Interaction ID                                              | Question: Which class is responsible for...        | Answer               | Justification (with patterns)                                                                                                                                                                              |
|:------------------------------------------------------------|:---------------------------------------------------|:---------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Step 1: Admin submits a request to list all staff profiles. | ... triggering the search process?                 | **StaffController**  | The **StaffController** handles the Admin's request to list or search staff profiles, ensuring proper communication between the UI and the underlying business logic, in line with the MVC pattern. |
| Step 2: Create a DTO to encapsulate staff profiles data.    | ... prepare the staff profiles for the controller? | **StaffDto**         | The **StaffDto** encapsulates the data for staff profiles to be transferred between layers, ensuring only the necessary information is passed along.                                                |
| Step 3: Retrieve all staff profiles from the service.       | ... retrieve all staff profiles from the service?  | **StaffService**     | The **StaffService** contains the business logic for retrieving staff profiles from the repository, ensuring that only valid and consistent data is processed.                                      |
| Step 4: Return the staff profiles to the service.           | ... return the staff profiles to the service?      | **StaffRepository**  | The **StaffRepository** is responsible for fetching staff profile data from the database, adhering to the Repository pattern to separate data access logic from business logic.                     |
| Step 5: Access the repository to fetch data.                | ... Repository                                     | **IStaffRepository** | The **IStaffRepository** defines the contract for data access methods, ensuring that different implementations of data sources can be used without affecting the business logic.                    |
| Step 6: Send the staff profiles back to the Admin.          | ... Controller                                     | **StaffController**  | The **StaffController** sends the list of staff profiles back to the Admin after processing, completing the request-response cycle in the MVC structure.                                            |

### Systematization ##

According to the taken rationale, the conceptual classes promoted to software classes are:

* **StaffController**: Responsible for managing HTTP requests, handling the search process for staff profiles, and ensuring proper communication between the UI and the underlying business logic.
* **StaffDto**: Data Transfer Object that encapsulates the employee profile data to be transferred between the layers of the system.
* **StaffService**: Contains the business logic for retrieving staff profiles from the repository, ensuring that only valid and consistent data is processed.
* **StaffRepository**: Responsible for fetching staff profile data from the database, adhering to the Repository pattern to separate data access logic from business logic.
* **IStaffRepository**: Interface that defines the contract for data access methods, ensuring that different implementations of data sources can be used without affecting the business logic.

Other software classes (i.e. Pure Fabrication) identified:

* **StaffProfile**: Represents the staff profile entity, containing the necessary attributes and methods to manage staff profile data.

## 3.2. Sequence Diagram (SD)

![uc015-sequence-diagram.svg](svg/uc015-sequence-diagram.svg)

## 3.3. Class Diagram (CD)

![uc015-class-diagram.svg](svg/uc015-class-diagram.svg)
