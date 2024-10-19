# UC012 - As an Admin, I want to create a new staff profile, so that I can add them to the hospital’s roster

## 3. Design - Use Case Realization

### 3.1. Rationale

| Interaction ID                                      | Question: Which class is responsible for...       | Answer            | Justification (with patterns)                                                                                              |
|:----------------------------------------------------|:--------------------------------------------------|:------------------|:---------------------------------------------------------------------------------------------------------------------------|
| Step 1: Create Staff Profile                        | ... triggering the profile creation process?      | StaffController   | Controller: Controller: StaffProfileController is responsible for managing the flow of creating new staff profiles.        |
|                                                     | ... storing information about staff?              | Staff             | Information Expert: Staff holds all relevant details about the staff, including name, specialization, and contact details. |
|                                                     | ... saving the new staff profile?                 | StaffRepository   | Information Expert: StaffRepository is responsible for saving staff profile details after validation.                      |
| Step 2: Create a DTO to encapsulate staff data.     | ... encapsulating staff profile data?             | StaffDTO          | DTO (Data Transfer Object): StaffDTO encapsulates staff data and transfers it between service and controller layers.       |
| Step 2: Validate Input                              | ... validating the staff profile details?         | StaffService      | Service: StaffService validates the provided data, ensuring email and phone number are unique.                             |
| Step 3: Show (in)success of the operation's message | ... showing the notification (in)success message? |                   | Pure Fabrication: StaffProfileUI shows the success or failure message of the staff profile creation process.               |

### Systematization ##

According to the taken rationale, the conceptual classes promoted to software classes are:

* Staff
* Specialization
* ContactInformation
* FullName

Other software classes (i.e. Pure Fabrication) identified:

* CreateStaffController
* IStaffRepository
* StaffService
* StaffDTO

## 3.2. Sequence Diagram (SD)

![uc012-sequence-diagram.svg](png/uc012-sequence-diagram.svg)

## 3.3. Class Diagram (CD)

![uc012-class-diagram.svg](png/uc012-class-diagram.svg)
