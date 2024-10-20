# UC002 -  As a Backoffice User (Admin, Doctor, Nurse, Technician), I want to reset my password if I forget it, so that I can regain access to the system securely

## 3. Design - Use Case Realization

### 3.1. Rationale

| Interaction ID                                           | Question: Which class is responsible for...         | Answer                | Justification (with patterns)                                                                                                                                                       |
|:---------------------------------------------------------|:----------------------------------------------------|:----------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Step 1: User requests to reset the password.             | ... initiating the password reset process?          | **UserController**    | The **UserController** manages the password reset request, ensuring proper communication between the user interface and the underlying business logic.                              |
| Step 2: Create a DTO to encapsulate password reset data. | ... preparing the password data for the controller? | **ChangePasswordDto** | The **ChangePasswordDto** encapsulates the data necessary for the password reset, ensuring that only the essential information is transferred between layers.                       |
| Step 3: Validate authentication token.                   | ... validating the user's token?                    | **IAMService**        | The **StaffService** is responsible for validating the user's token, ensuring that only authenticated users can access the password reset functionality.                            |
| Step 4: Retrieve the user based on the provided ID.      | ... retrieving the user?                            | **UserService**       | The **UserService** contains the business logic for retrieving user data, ensuring that only valid and consistent data is processed.                                                |
| Step 5: Update the user's password.                      | ... updating the user's password?                   | **User**              | The **User** class is responsible for applying the new password and validating the current password before performing the update, ensuring the integrity of the reset process.      |
| Step 6: Persist changes in the repository.               | ... persisting the password in the database?        | **UserRepository**    | The **UserRepository** is responsible for saving the password changes in the database, separating data access logic from business logic, in accordance with the Repository pattern. |

### Systematization ##

According to the taken rationale, the conceptual classes promoted to software classes are:

* **StaffController**: Manages password reset requests and ensures communication between the user interface and business logic.
* **ChangePasswordDto**: Data Transfer Object that encapsulates the data necessary for the password reset, transferring only relevant information between the layers.
* **IAMService**: Responsible for validating the user's token, ensuring that only authenticated users can access the password reset functionality.
* **UserService**: Contains business logic for retrieving and updating user data, ensuring consistency and validity of the information.
* **UserRepository**: Responsible for persisting user data in the database, separating data access logic from business logic.
* **PasswordResetUI**: Responsible for displaying feedback messages to the user, informing them of success or failure in the password reset process.

Other software classes (i.e. Pure Fabrication) identified:

* **User**: Represents the user entity, containing the necessary attributes and methods to manage user data and password update logic.

## 3.2. Sequence Diagram (SD)

![uc002-sequence-diagram.svg](svg/uc002-sequence-diagram.svg)

## 3.3. Class Diagram (CD)

![uc002-class-diagram.svg](svg/uc002-class-diagram.svg)
